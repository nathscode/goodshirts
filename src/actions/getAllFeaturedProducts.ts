"use server";

import { ProductType, ProductWithExtra, products } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";
import db from "../db";
import getCurrentUser from "./getCurrentUser";

export default async function getAllFeaturedProducts(): Promise<
	ProductWithExtra[] | []
> {
	try {
		const allProducts = await db.query.products.findMany({
			orderBy: [desc(products.createdAt)],
			where: eq(products.isFeatured, true),
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

		if (!allProducts) {
			return [];
		}
		const plainProducts = JSON.parse(JSON.stringify(allProducts));
		return plainProducts;
	} catch (error) {
		console.error("Error fetching all products:", error);
		return [];
	}
}
