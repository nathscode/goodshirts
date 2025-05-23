"use server";
import { OrderWithExtra, orders } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";

const logger = getLogger();
export async function getUserOrdersById(
	id: string
): Promise<OrderWithExtra | null> {
	noStore();

	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}

	try {
		const userOrders = await db.query.orders.findFirst({
			where: and(eq(orders.id, id), eq(orders.userId, session.id!)),
			with: {
				items: {
					with: {
						product: {
							with: {
								medias: true, // Fetch product medias
							},
						},
						variant: true, // Fetch variant
						size: true,
					},
				},
			},
		});

		if (!userOrders) return null;
		const plainOrders = JSON.parse(JSON.stringify(userOrders));
		return plainOrders;
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to fetch order");
	}
}
export async function getDashboardOrdersById(
	id: string
): Promise<OrderWithExtra | null> {
	noStore();

	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}
	const isAdmin = session.type === "ADMIN";
	if (!isAdmin) {
		throw Error("Unauthenticated User.. You can't access this data");
	}

	try {
		const userOrders = await db.query.orders.findFirst({
			where: eq(orders.id, id),
			with: {
				user: true,
				guestUser: true,
				address: true,
				items: {
					with: {
						product: {
							with: {
								medias: true, // Fetch product medias
							},
						},
						variant: true, // Fetch variant
						size: true,
					},
				},
			},
		});

		if (!userOrders) return null;
		const plainOrders = JSON.parse(JSON.stringify(userOrders));
		return plainOrders;
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to fetch order");
	}
}
