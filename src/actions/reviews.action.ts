"use server";
import { unstable_noStore as noStore } from "next/cache";
import { OrderItemWithExtra, orderItems, reviews } from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import db from "../db";
import getCurrentUser from "./getCurrentUser";
import { eq } from "drizzle-orm";
import { ActionResponse } from "../types";

const logger = getLogger();
export async function getAllDeliveredReviews(): Promise<
	ActionResponse<OrderItemWithExtra[]>
> {
	noStore();
	try {
		const session = await getCurrentUser();
		if (!session) {
			throw new Error("Unauthenticated User.. Try and Login");
		}

		// Get delivered orderItems with product, variant, and size details
		const deliveredItems = await db.query.orderItems.findMany({
			where: eq(orderItems.status, "DELIVERED"),
			with: {
				order: true,
				product: {
					with: {
						medias: true,
					},
				},
				variant: true,
				size: true,
			},
		});

		// Get productIds that have been reviewed
		const reviewedProducts = await db
			.select({ productId: reviews.productId })
			.from(reviews);

		const reviewedProductIds = reviewedProducts.map((r) => r.productId);

		// Filter out items that have already been reviewed
		const eligibleItems = deliveredItems.filter(
			(item) => !reviewedProductIds.includes(item.productId)
		);

		if (eligibleItems.length === 0) {
			return { message: "No eligible items found", status: "error", data: [] };
		}
		// @ts-ignore
		return { status: "success", data: eligibleItems! };
	} catch (error) {
		console.error("Error fetching eligible order items:", error);
		logger.error("Failed to fetch eligible order items:", error);
		return { message: "Internal Server Error", status: "error", data: [] };
	}
}
