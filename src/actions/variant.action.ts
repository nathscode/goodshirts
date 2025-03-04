"use server";
import { and, desc, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import {
	AddressType,
	PriceVariantType,
	addressTable,
	productVariantPrices,
} from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";

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
