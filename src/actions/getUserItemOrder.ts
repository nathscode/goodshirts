"use server";
import { OrderItemWithExtra, orderItems } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";

const logger = getLogger();

export async function getUserOrderItemById(
	id: string
): Promise<OrderItemWithExtra | null> {
	noStore();

	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}

	try {
		const userOrders = await db.query.orderItems.findFirst({
			where: eq(orderItems.id, id),
			with: {
				product: {
					with: {
						medias: true,
					},
				},
			},
		});

		if (!userOrders) return null;
		const plainOrders = JSON.parse(JSON.stringify(userOrders));
		return plainOrders;
	} catch (error) {
		console.log(error);
		logger.error("Database Error:", error);
		throw new Error("Failed to fetch order");
	}
}
