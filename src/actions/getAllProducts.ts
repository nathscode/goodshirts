"use server";

import { ProductType, ProductWithCategory, products } from "@/src/db/schema";
import { desc } from "drizzle-orm";
import db from "../db";
import { getLogger } from "../lib/backend/logger";

const logger = getLogger();

export default async function getAllProducts(): Promise<
	ProductWithCategory[] | null
> {
	try {
		const allProducts = await db.query.products.findMany({
			orderBy: [desc(products.createdAt)],
			with: {
				category: true,
				subCategory: true,
			},
		});

		if (!allProducts) {
			return [];
		}
		const plainProducts = JSON.parse(JSON.stringify(allProducts));
		return plainProducts;
	} catch (error) {
		console.error("Error fetching all products:", error);
		logger.error("Error fetching all products:", error);
		return [];
	}
}
