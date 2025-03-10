"use server";
import { and, desc, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import {
	AddressType,
	PriceVariantType,
	addressTable,
	productVariantPrices,
	productVariants,
} from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";
import checkIsAdmin from "./checkIsAdmin";

const logger = getLogger();
export async function getVariantById(
	id: string
): Promise<PriceVariantType | null> {
	noStore();

	if (!id) {
		throw Error("Id is required");
	}

	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}
	try {
		const variant = await db.query.productVariantPrices.findFirst({
			where: eq(productVariantPrices.id, id),
		});

		if (!variant) return null;
		const plainVariant = JSON.parse(JSON.stringify(variant));
		return plainVariant;
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to fetch variant");
	}
}

export async function deletePriceVariant(variantId: string) {
	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}
	const isAdmin = await checkIsAdmin();
	if (!isAdmin) {
		return { status: "error", message: "Not authorized" };
	}

	try {
		const deleted = await db
			.delete(productVariantPrices)
			.where(and(eq(productVariantPrices.id, variantId)))
			.returning();

		if (!deleted) {
			return {
				status: "error",
				message: "size variant not found or unauthorized",
			};
		}

		return { status: "success", message: "size variant deleted successfully" };
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to delete variant");
	}
}

export async function deleteVariant(variantId: string) {
	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}
	const isAdmin = await checkIsAdmin();
	if (!isAdmin) {
		return { status: "error", message: "Not authorized" };
	}

	try {
		const deleted = await db
			.delete(productVariants)
			.where(and(eq(productVariants.id, variantId)))
			.returning();

		if (!deleted) {
			return { status: "error", message: "variant not found or unauthorized" };
		}

		return { status: "success", message: "variant deleted successfully" };
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to delete variant");
	}
}
