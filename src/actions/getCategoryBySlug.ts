"use server";
import { eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import { CategoriesWithExtra, categories } from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";

const logger = getLogger();

export default async function getCategoryBySlug(
	slug: string
): Promise<CategoriesWithExtra | null> {
	noStore();

	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}
	if (!slug) {
		return null;
	}
	try {
		const category = await db.query.categories.findFirst({
			where: eq(categories.slug, slug),
			with: {
				subCategories: true,
			},
		});

		if (!category) return null;
		const plainCategory = JSON.parse(JSON.stringify(category));
		return plainCategory;
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to fetch category");
	}
}
