"use server";

import { ProductType, products } from "@/src/db/schema";
import { desc } from "drizzle-orm";
import db from "../db";

export default async function getAllProducts(): Promise<ProductType[] | null> {
	try {
		const allProducts = await db.query.products.findMany({
			orderBy: [desc(products.createdAt)],
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
