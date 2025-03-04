"use server";

import { eq, sql } from "drizzle-orm";
import { orders, orderItems } from "@/src/db/schema";
import db from "../db";

export const getMonthlySales = async () => {
	try {
		const monthlySales = await db
			.select({
				month: sql<string>`TO_CHAR(${orders.createdAt}, 'Month')`.as("month"),
				totalSales: sql<number>`SUM(${orderItems.quantity})`.as("total_sales"),
			})
			.from(orderItems)
			.where(eq(orderItems.status, "DELIVERED"))
			.innerJoin(orders, sql`${orderItems.orderId} = ${orders.id}`)
			.groupBy(sql`TO_CHAR(${orders.createdAt}, 'Month')`)
			.orderBy(sql`MIN(${orders.createdAt})`);

		return monthlySales;
	} catch (error) {
		console.error("Error fetching monthly sales:", error);
		return [];
	}
};
