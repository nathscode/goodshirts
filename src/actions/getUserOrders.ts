"use server";
import { OrderWithExtra, orders } from "@/src/db/schema";
import { and, eq, is } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";

const logger = getLogger();
export async function getUserOrders(): Promise<OrderWithExtra[] | []> {
	noStore();

	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}

	try {
		const userOrders = await db.query.orders.findMany({
			where: eq(orders.userId, session.id!),
			with: {
				user: true,
				address: true,
				items: {
					with: {
						product: {
							with: {
								medias: true, // Fetch product medias
							},
						},
						variant: true, // Fetch variant
					},
				},
			},
			orderBy: (orders, { desc }) => [desc(orders.createdAt)],
		});

		if (!userOrders) return [];
		const plainOrders = JSON.parse(JSON.stringify(userOrders));
		return plainOrders;
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to fetch order");
	}
}
export async function getDashboardOrders(): Promise<OrderWithExtra[] | []> {
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
		const userOrders = await db.query.orders.findMany({
			with: {
				user: true,
				address: true,
				guestUser: true,
				items: {
					with: {
						product: {
							with: {
								medias: true, // Fetch product medias
							},
						},
						variant: true, // Fetch variant
					},
				},
			},
			orderBy: (orders, { desc }) => [desc(orders.createdAt)],
		});

		if (!userOrders) return [];
		const plainOrders = JSON.parse(JSON.stringify(userOrders));
		return plainOrders;
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to fetch order");
	}
}
