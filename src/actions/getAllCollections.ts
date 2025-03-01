"use server";

import { CollectionType, collections } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";
import db from "../db";

export default async function getAllCollection(): Promise<
	CollectionType[] | null
> {
	try {
		const allCollections = await db.query.collections.findMany({
			where: eq(collections.isActive, true),
			orderBy: [desc(collections.createdAt)],
		});

		if (!allCollections) {
			return [];
		}
		const plainCollections = JSON.parse(JSON.stringify(allCollections));
		return plainCollections;
	} catch (error) {
		console.error("Error fetching all collections:", error);
		return [];
	}
}
