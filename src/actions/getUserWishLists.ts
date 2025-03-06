"use server";
import { desc, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import { SavedWithExtra, savedProducts } from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";
import { ActionResponse } from "../types";

const logger = getLogger();

export async function getUserWishLists(): Promise<
	ActionResponse<SavedWithExtra[]>
> {
	noStore();

	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}
	try {
		const saved = await db.query.savedProducts.findMany({
			where: eq(savedProducts.userId, session.id!),
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

		if (!saved)
			return { message: "No saved items found", status: "error", data: [] };
		// @ts-ignore
		return { status: "success", data: saved! };
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to fetch Saved");
	}
}
