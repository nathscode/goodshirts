"use server";
import { ProductWithExtra, products } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import getCurrentUser from "./getCurrentUser";

export default async function fetchProductByCategory(
	category: string
): Promise<ProductWithExtra[] | null> {
	try {
		noStore();

		if (!category) {
			return null;
		}
		const session = await getCurrentUser();
		if (!session) return null;

		const allProducts = await db.query.products.findMany({
			where: eq(products.subCategoryId, category),
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
			return null;
		}
		const plainProducts = JSON.parse(JSON.stringify(allProducts));
		return plainProducts;
	} catch (error) {
		console.error("Error fetching all products:", error);
		return null;
	}
}
