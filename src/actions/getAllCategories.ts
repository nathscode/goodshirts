"use server";

import { CategoriesWithExtra, CategoryType, categories } from "@/src/db/schema";
import { desc } from "drizzle-orm";
import db from "../db";

export default async function getAllCategories(): Promise<
	CategoriesWithExtra[] | []
> {
	try {
		const allCategories = await db.query.categories.findMany({
			orderBy: [desc(categories.createdAt)],
			with: {
				subCategories: true,
			},
		});

		if (!allCategories) {
			return [];
		}
		const plainCategories = JSON.parse(JSON.stringify(allCategories));
		return plainCategories;
	} catch (error) {
		console.error("Error fetching all categories:", error);
		return [];
	}
}
