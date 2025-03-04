"use server";

import { orders, orderItems, products, categories } from "@/src/db/schema";
import { sql, and, eq } from "drizzle-orm";
import db from "../db";

export const getTopCategories = async () => {
	try {
		const topCategories = await db
			.select({
				id: categories.id,
				name: categories.name,
				totalOrders: sql<number>`COUNT(DISTINCT ${orders.id})`.as(
					"total_orders"
				),
			})
			.from(orderItems)
			.innerJoin(orders, eq(orderItems.orderId, orders.id))
			.innerJoin(products, eq(orderItems.productId, products.id))
			.innerJoin(categories, eq(products.categoryId, categories.id))
			.where(eq(orderItems.status, "DELIVERED"))
			.groupBy(categories.id)
			.orderBy(sql`total_orders DESC`)
			.limit(5);

		const plainTopCategories = JSON.parse(JSON.stringify(topCategories));
		return plainTopCategories;
	} catch (error) {
		console.error("Error fetching top categories:", error);
		return [];
	}
};
