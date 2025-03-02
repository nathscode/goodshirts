"use server";
import { and, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { SavedWithExtra, savedProducts } from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";
import db from "../db";
import { SavedInfo } from "../types";

const logger = getLogger();

type SaveProductResponse = {
	message: string;
	status: string;
	savedProduct?: SavedWithExtra;
};
export async function saveProductAction(
	productId: string
): Promise<SaveProductResponse> {
	noStore();

	const session = await getCurrentUser();
	if (!session) {
		throw new Error("Unauthenticated User.. Try and Login");
	}

	if (!productId) {
		throw new Error("userId and productId are required.");
	}
	try {
		const savedProduct = await db
			.select()
			.from(savedProducts)
			.where(
				and(
					eq(savedProducts.userId, session.id!),
					eq(savedProducts.productId, productId)
				)
			)
			.execute();

		if (savedProduct.length > 0) {
			await db
				.delete(savedProducts)
				.where(
					and(
						eq(savedProducts.userId, session.id!),
						eq(savedProducts.productId, productId)
					)
				)
				.returning();

			logger.info(
				`Product ${productId} removed from saved list for user ${session.id!}`
			);
			return { status: "success", message: "Product removed from saved list." };
		} else {
			await db
				.insert(savedProducts)
				.values({ userId: session.id!, productId })
				.execute();
			logger.info(
				`Product ${productId} saved successfully for user ${session.id!}`
			);
			return { status: "success", message: "Product saved successfully!" };
		}
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to toggle saved product");
	}
}

export async function isProductSaved(productId: string): Promise<SavedInfo> {
	const session = await getCurrentUser();
	if (!session) {
		throw new Error("Unauthenticated User.. Try and Login");
	}

	try {
		const savedProduct = await db
			.select()
			.from(savedProducts)
			.where(
				and(
					eq(savedProducts.userId, session.id!),
					eq(savedProducts.productId, productId)
				)
			)
			.execute();

		// Return the SavedInfo object directly
		return {
			isSavedByUser: !!savedProduct.length,
		};
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to check if product is saved");
	}
}
