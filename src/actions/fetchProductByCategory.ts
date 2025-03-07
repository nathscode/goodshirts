"use server";

import { ProductWithExtra, products } from "@/src/db/schema";
import { and, eq, not } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import getCurrentUser from "./getCurrentUser";

export default async function fetchProductByCategory(
	category: string,
	productId?: string
): Promise<ProductWithExtra[] | []> {
	try {
		noStore();

		if (!category) {
			throw new Error("Category is required");
		}

		// Construct where clause to exclude the specific productId if provided
		const whereClause = productId
			? and(
					eq(products.subCategoryId, category),
					not(eq(products.id, productId))
				)
			: eq(products.subCategoryId, category);
		const allProducts = await db.query.products.findMany({
			where: whereClause,
			with: {
				category: true,
				subCategory: true,
				variants: {
					with: {
						variantPrices: true,
					},
				},
				medias: true,
			},
		});
		console.log(allProducts);
		if (!allProducts) {
			return [];
		}

		return allProducts;
	} catch (error) {
		console.error("Error fetching products:", error);
		return [];
	}
}
