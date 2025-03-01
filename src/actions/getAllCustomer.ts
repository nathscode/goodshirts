import db from "@/src/db";
import { orders, users, orderItems } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";
import getCurrentUser from "@/src/actions/getCurrentUser";

export type UserWithOrderTotal = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	createdAt: Date;
	totalSpent: number;
};

export async function getAllCustomer(): Promise<UserWithOrderTotal[] | []> {
	const session = await getCurrentUser();
	if (!session) {
		throw new Error("Unauthenticated User.. Try and Login");
	}

	if (session.type !== "ADMIN") {
		throw new Error("Unauthenticated User.. You can't access this data");
	}

	try {
		// Query distinct users and calculate total order amount
		const usersWithOrderTotals = await db
			.select({
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				email: users.email,
				phoneNumber: users.phoneNumber,
				createdAt: users.createdAt,
				totalSpent: sql<number>`COALESCE(SUM(${orderItems.discountPrice ? orderItems.discountPrice : orderItems.price} * ${orderItems.quantity}), 0)`,
			})
			.from(users)
			.leftJoin(orders, eq(users.id, orders.userId))
			.leftJoin(orderItems, eq(orders.id, orderItems.orderId))
			.groupBy(users.id);

		if (!usersWithOrderTotals) {
			return [];
		}
		const plainOrders = JSON.parse(JSON.stringify(usersWithOrderTotals));
		return plainOrders;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch users with order totals");
	}
}
