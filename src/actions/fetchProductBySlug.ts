"use server";
import { ProductWithExtra, products } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import getCurrentUser from "./getCurrentUser";

export default async function fetchProductBySlug(
	slug: string
): Promise<ProductWithExtra | null> {
	try {
		noStore();

		if (!slug) {
			return null;
		}
		const allProducts = await db.query.products.findFirst({
			where: eq(products.slug, slug),
			with: {
				category: true,
				subCategory: true,
				variants: {
					with: {
						variantPrices: true,
					},
				},
				medias: true,
				reviews: {
					with: {
						user: true,
					},
				},
				saved: {
					with: {
						user: true,
					},
				},
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
