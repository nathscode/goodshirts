"use server";
import { desc } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import { SavedWithExtra, savedProducts } from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";

const logger = getLogger();

export async function getUserWishLists(): Promise<SavedWithExtra[] | []> {
	noStore();

	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}
	try {
		const saved = await db.query.savedProducts.findMany({
			orderBy: [desc(savedProducts.createdAt)],
			with: {
				product: {
					with: {
						medias: true,
					},
				},
				variant: true,
				size: true,
			},
		});

		if (!saved) return [];
		const plainSaved = JSON.parse(JSON.stringify(saved));
		return plainSaved;
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to fetch Saved");
	}
}
