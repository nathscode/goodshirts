import checkIsAdmin from "@/src/actions/checkIsAdmin";
import getCurrentUser from "@/src/actions/getCurrentUser";
import db from "@/src/db";
import { categories, subCategories } from "@/src/db/schema";
import { getLogger } from "@/src/lib/backend/logger";
import {
	generateRandomString,
	handlerNativeResponse,
	trimAndLowercase,
} from "@/src/lib/utils";
import {
	SubCategoriesSchema,
	SubCategoriesSchemaInfer,
} from "@/src/lib/validators/categories";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { ZodError } from "zod";

const logger = getLogger();
export async function POST(req: NextRequest) {
	try {
		const session = await getCurrentUser();
		if (!session) {
			return handlerNativeResponse(
				{
					status: 401, // Unauthorized
					errors: {
						message: "Unauthorized user",
					},
				},
				401
			);
		}
		const isAdmin = await checkIsAdmin();
		if (!isAdmin) {
			return handlerNativeResponse(
				{
					status: 403,
					errors: {
						message: "Not authorized to make this request",
					},
				},
				401
			);
		}

		const body: SubCategoriesSchemaInfer = await req.json();
		const payload = SubCategoriesSchema.safeParse(body);
		if (!payload.success) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: payload.error.message,
					},
				},
				400
			);
		}

		const { name, description, categorySlug } = payload.data;
		const formattedName = trimAndLowercase(name);

		const existingCategory = await db.query.categories.findFirst({
			where: eq(categories.slug, String(categorySlug)),
		});

		if (!existingCategory) {
			return handlerNativeResponse(
				{
					status: 403,
					errors: {
						message: "No category found",
					},
				},
				401
			);
		}

		let slug = slugify(formattedName, { lower: true });
		const existingSubCategory = await db.query.subCategories.findFirst({
			where: eq(categories.slug, slug),
		});

		if (existingSubCategory) {
			slug += `-${generateRandomString()}`;
		}

		const [newSubCategory] = await db
			.insert(subCategories)
			.values({
				categoryId: String(existingCategory.id),
				name: formattedName,
				slug,
				description,
			})
			.returning();

		if (!newSubCategory) {
			return handlerNativeResponse(
				{ status: 400, message: "No category created" },
				400
			);
		}
		return NextResponse.json({ status: "success" });
	} catch (error: any) {
		logger.info("USER SUBCATEGORY CREATION ERROR", error);

		// Handle specific errors
		if (error instanceof ZodError) {
			return handlerNativeResponse(
				{
					status: 422,
					errors: { message: error.errors[0]?.message || "Validation failed" },
				},
				422
			);
		}

		// Return a generic server error response
		return handlerNativeResponse(
			{ status: 500, errors: { message: "Something went wrong" } },
			500
		);
	}
}
