"use server";
import {
	CollectionWithExtra,
	ProductWithMedia,
	collections,
	products,
} from "@/src/db/schema";
import { unstable_noStore as noStore } from "next/cache";

import { and, desc, eq } from "drizzle-orm";
import db from "../db";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";
import checkIsAdmin from "./checkIsAdmin";

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

export async function setActivateCollection(collectionId: string) {
	const session = await getCurrentUser();
	if (!session) {
		throw new Error("Unauthenticated User.. Try and Login");
	}

	try {
		const collection = await db.query.collections.findFirst({
			where: and(eq(collections.id, collectionId)),
		});

		if (!collection) {
			throw new Error("collection not found");
		}

		const newDefaultStatus = !collection.isActive; // Toggle default status

		await db.transaction(async (tx) => {
			// If setting as default, remove default from all other addresses
			if (newDefaultStatus) {
				await tx
					.update(collections)
					.set({ isActive: false })
					.where(eq(collections.id, collectionId));
			}

			// Update selected address
			await tx
				.update(collections)
				.set({ isActive: newDefaultStatus })
				.where(eq(collections.id, collectionId));
		});

		return {
			status: "success",
			message: `Address ${newDefaultStatus ? "set" : "removed"} as default successfully`,
		};
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to update default address");
	}
}

export async function deleteCollection(collectionId: string) {
	const session = await getCurrentUser();
	const isAdmin = await checkIsAdmin();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}

	if (!isAdmin) {
		throw Error("You're not authorized to make this request");
	}

	try {
		const deleted = await db
			.delete(collections)
			.where(eq(collections.id, collectionId))
			.returning();

		if (!deleted) {
			return {
				status: "error",
				message: "Collection not found or unauthorized",
			};
		}

		return { status: "success", message: "Collection deleted successfully" };
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to delete collection");
	}
}
