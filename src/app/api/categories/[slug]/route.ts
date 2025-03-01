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
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

const logger = getLogger();

export async function PATCH(req: NextRequest) {
	try {
		// Validate Request Body
		const body: CategoriesSchemaInfer = await req.json();
		const payload = CategoriesSchema.safeParse(body);
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

		const { name, description, slug } = payload.data;

		const existingCategory = await db.query.categories.findFirst({
			where: eq(categories.slug, String(slug)),
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

		const formattedName = trimAndLowercase(name);
		let newSlug = slug;

		if (!existingCategory || existingCategory.name !== formattedName) {
			newSlug = slugify(formattedName, { lower: true });

			const existingSlug = await db.query.categories.findFirst({
				where: eq(categories.slug, newSlug),
			});

			if (existingSlug) {
				newSlug += `-${generateRandomString()}`;
			}
		}

		const [updatedCategory] = await db
			.update(categories)
			.set({ name: formattedName, slug: newSlug, description })
			.where(eq(categories.id, String(existingCategory?.id)))
			.returning({ slug: categories.slug });

		if (!updatedCategory) {
			return NextResponse.json(
				{ status: 400, message: "No category updated" },
				{ status: 400 }
			);
		}

		return NextResponse.json(updatedCategory.slug);
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
		const existingCategory = await db.query.categories.findFirst({
			where: eq(categories.slug, slug),
		});

		if (!existingCategory) {
			return NextResponse.json(
				{ status: 404, message: "Category not found" },
				{ status: 404 }
			);
		}

		// Delete sub-category
		await db.delete(categories).where(eq(categories.id, existingCategory.id));

		return NextResponse.json({
			status: 200,
			message: "Category deleted successfully",
		});
	} catch (error: any) {
		return NextResponse.json(
			{ status: 500, message: error.message },
			{ status: 500 }
		);
	}
}
