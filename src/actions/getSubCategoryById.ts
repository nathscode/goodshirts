"use server";
import { eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import { SubCategoryType, subCategories } from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";

const logger = getLogger();

export default async function getSubCategoryById(
	id: string
): Promise<SubCategoryType[] | []> {
	noStore();

	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}
	if (!id) {
		throw Error("category Id required");
	}
	try {
		const category = await db.query.subCategories.findMany({
			where: eq(subCategories.categoryId, id),
		});

		if (!category) return [];
		const plainCategory = JSON.parse(JSON.stringify(category));
		return plainCategory;
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to fetch category");
	}
}
