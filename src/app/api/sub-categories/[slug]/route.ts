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

const logger = getLogger();

export async function PATCH(req: NextRequest) {
	try {
		// Validate Request Body
		const body: SubCategoriesSchemaInfer = await req.json();
		const payload = SubCategoriesSchema.safeParse(body);
		if (!payload.success) {
			return NextResponse.json(
				{ status: 400, errors: { message: payload.error.message } },
				{ status: 400 }
			);
		}

		const session = await getCurrentUser();
		if (!session) {
			return handlerNativeResponse(
				{
					status: 401,
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

		const { name, description, categorySlug, slug } = payload.data;

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
		const existingSubCategory = await db.query.subCategories.findFirst({
			where: eq(categories.slug, String(slug)),
		});

		if (!existingSubCategory) {
			return handlerNativeResponse(
				{
					status: 403,
					errors: {
						message: "No sub category found",
					},
				},
				401
			);
		}

		let newSlug = slug;

		const formattedName = trimAndLowercase(name);

		if (!existingSubCategory || existingSubCategory.name !== formattedName) {
			newSlug = slugify(name, { lower: true });

			const existingSlug = await db.query.categories.findFirst({
				where: eq(categories.slug, newSlug),
			});

			if (existingSlug) {
				newSlug += `-${generateRandomString()}`;
			}
		}

		const [updatedSubCategory] = await db
			.update(subCategories)
			.set({ name: formattedName, slug: newSlug, description })
			.where(eq(subCategories.id, String(existingSubCategory?.id)))
			.returning({ slug: subCategories.slug });

		if (!updatedSubCategory) {
			return NextResponse.json(
				{ status: 400, message: "No category updated" },
				{ status: 400 }
			);
		}

		return NextResponse.json(updatedSubCategory.slug);
	} catch (error: any) {
		return NextResponse.json(
			{ status: 500, message: error.message },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		const { slug } = params;

		if (!slug) {
			return NextResponse.json(
				{ status: 400, message: "Category slug is required" },
				{ status: 400 }
			);
		}

		const session = await getCurrentUser();
		if (!session) {
			return NextResponse.json(
				{ status: 401, message: "Unauthorized user" },
				{ status: 401 }
			);
		}

		const isAdmin = await checkIsAdmin();
		if (!isAdmin) {
			return NextResponse.json(
				{ status: 403, message: "Not authorized to make this request" },
				{ status: 403 }
			);
		}

		// Find sub-category by slug
		const existingSubCategory = await db.query.subCategories.findFirst({
			where: eq(subCategories.slug, slug),
		});

		if (!existingSubCategory) {
			return NextResponse.json(
				{ status: 404, message: "Sub Category not found" },
				{ status: 404 }
			);
		}

		// Delete sub-category
		await db
			.delete(subCategories)
			.where(eq(subCategories.id, existingSubCategory.id));

		return NextResponse.json({
			status: 200,
			message: "Sub Category deleted successfully",
		});
	} catch (error: any) {
		return NextResponse.json(
			{ status: 500, message: error.message },
			{ status: 500 }
		);
	}
}
