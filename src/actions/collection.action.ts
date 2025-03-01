"use server";
import {
	CollectionWithExtra,
	ProductWithMedia,
	products,
} from "@/src/db/schema";
import { unstable_noStore as noStore } from "next/cache";

import { desc, eq } from "drizzle-orm";
import db from "../db";
import { getLogger } from "../lib/backend/logger";

const logger = getLogger();
export async function getAllCollections(): Promise<CollectionWithExtra[] | []> {
	noStore();
	try {
		const collectionsData = await db.query.collections.findMany({
			with: {
				collectionProducts: {
					with: {
						product: true,
					},
				},
			},
		});

		if (!collectionsData) {
			return [];
		}
		const collectionsDataFilter = collectionsData.map((collection) => ({
			...collection,
			collectionProducts: collection.collectionProducts.map((cp) => ({
				product: cp.product,
			})),
		}));
		const plainCollections = JSON.parse(JSON.stringify(collectionsDataFilter));
		return plainCollections;
	} catch (error) {
		console.error("Failed to fetch collections:", error);
		logger.error("Database Error:", error);
		throw new Error("Failed to fetch collections.");
	}
}

export async function getAllCollectionProducts(): Promise<
	ProductWithMedia[] | []
> {
	try {
		const allProducts = await db.query.products.findMany({
			where: eq(products.isActive, true),
			orderBy: [desc(products.createdAt)],
			with: {
				medias: true,
			},
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
