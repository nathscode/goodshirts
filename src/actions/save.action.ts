"use server";
import { and, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import { savedProducts } from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import { ActionResponse, SavedInfo } from "../types";
import getCurrentUser from "./getCurrentUser";

const logger = getLogger();

export async function saveProductAction(
	productId: string
): Promise<ActionResponse> {
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

export async function removeSavedProductAction(
	productId: string
): Promise<ActionResponse> {
	noStore();

	const session = await getCurrentUser();
	if (!session) {
		throw new Error("Unauthenticated User.. Try and Login");
	}

	if (!productId) {
		throw new Error("ProductId is required.");
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

		if (savedProduct.length === 0) {
			return { status: "error", message: "Product not found in saved list." };
		}
		await db
			.delete(savedProducts)
			.where(
				and(
					eq(savedProducts.userId, session.id!),
					eq(savedProducts.productId, productId)
				)
			)
			.execute();

		logger.info(
			`Product ${productId} removed from saved list for user ${session.id!}`
		);
		return { status: "success", message: "Product removed from saved list." };
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to remove saved product");
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
