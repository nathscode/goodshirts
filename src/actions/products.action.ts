"use server";
import { and, desc, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import { AddressType, addressTable, products } from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";

const logger = getLogger();
export async function setProductFeatured(productId: string) {
	const session = await getCurrentUser();
	if (!session) {
		throw new Error("Unauthenticated User.. Try and Login");
	}

	try {
		const product = await db.query.products.findFirst({
			where: and(eq(products.id, productId)),
		});

		if (!product) {
			throw new Error("Product not found");
		}

		const newFeaturedStatus = !product.isFeatured;

		await db.transaction(async (tx) => {
			if (newFeaturedStatus) {
				await tx
					.update(products)
					.set({ isFeatured: false })
					.where(eq(products.id, productId));
			}
			await tx
				.update(products)
				.set({ isFeatured: newFeaturedStatus })
				.where(eq(products.id, productId));
		});

		return {
			status: "success",
			message: `Product ${newFeaturedStatus ? "set" : "removed"} as featured successfully`,
		};
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to update featured");
	}
}
