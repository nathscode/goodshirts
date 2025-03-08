import db from "@/src/db";
import { categories, products, subCategories } from "@/src/db/schema";
import { eq, ilike, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const searchTerm = searchParams.get("q") || "";

	if (!searchTerm) {
		return NextResponse.json([]);
	}

	const results = await db
		.select({
			id: products.id,
			name: products.name,
			description: products.description,
			categoryName: categories.name,
			subCategoryName: subCategories.name,
		})
		.from(products)
		.leftJoin(categories, eq(products.categoryId, categories.id))
		.leftJoin(subCategories, eq(products.subCategoryId, subCategories.id))
		.where(
			or(
				ilike(products.name, `%${searchTerm}%`),
				ilike(products.description || "", `%${searchTerm}%`),
				ilike(categories.name, `%${searchTerm}%`),
				ilike(subCategories.name, `%${searchTerm}%`)
			)
		)
		.limit(10);

	return NextResponse.json(results);
}
