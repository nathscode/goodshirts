import checkIsAdmin from "@/src/actions/checkIsAdmin";
import getCurrentUser from "@/src/actions/getCurrentUser";
import db from "@/src/db";
import { categories } from "@/src/db/schema";
import { getLogger } from "@/src/lib/backend/logger";
import {
	generateRandomString,
	handlerNativeResponse,
	trimAndLowercase,
} from "@/src/lib/utils";
import {
	CategoriesSchema,
	CategoriesSchemaInfer,
} from "@/src/lib/validators/categories";
import slugify from "slugify";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { desc, eq } from "drizzle-orm";

const logger = getLogger();

export async function GET() {
	try {
		const categoriesAll = await db.query.categories.findMany({
			orderBy: [desc(categories.createdAt)],
		});
		if (!categoriesAll) {
			return handlerNativeResponse(
				{ status: 400, message: "No category yet" },
				400
			);
		}
		return NextResponse.json(categoriesAll);
	} catch (error: any) {
		let status = 500;

		return handlerNativeResponse({ status, message: error.message }, status);
	}
}
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

		const body: CategoriesSchemaInfer = await req.json();
		const payload = CategoriesSchema.safeParse(body);
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

		const { name, description } = payload.data;
		const formattedName = trimAndLowercase(name);
		let slug = slugify(formattedName, { lower: true });
		const existingCategory = await db.query.categories.findFirst({
			where: eq(categories.slug, slug),
		});

		if (existingCategory) {
			slug += `-${generateRandomString()}`;
		}

		const [newCategory] = await db
			.insert(categories)
			.values({
				slug,
				name: formattedName,
				description,
			})
			.returning();

		if (!newCategory) {
			return handlerNativeResponse(
				{ status: 400, message: "No category created" },
				400
			);
		}
		return NextResponse.json({ status: "success" });
	} catch (error: any) {
		logger.info("USER CATEGORY CREATION ERROR", error);

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
