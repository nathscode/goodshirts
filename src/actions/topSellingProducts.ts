"use server";

import { orders, orderItems, products } from "@/src/db/schema";
import { sql, and, eq } from "drizzle-orm";
import db from "../db";

export const getTopSellingProducts = async () => {
	try {
		const topProducts = await db
			.select({
				id: products.id,
				name: products.name,
				stock: products.stockQuantity,
				totalSales: sql<number>`SUM(${orderItems.quantity})`.as("total_sales"),
				totalEarnings:
					sql<number>`SUM(${orderItems.quantity} * COALESCE(${orderItems.discountPrice}, ${orderItems.price}))`.as(
						"total_earnings"
					),
				previousSales:
					sql<number>`COALESCE(SUM(CASE WHEN ${orders.createdAt} < NOW() - INTERVAL '1 month' THEN ${orderItems.quantity} ELSE 0 END), 0)`.as(
						"previous_sales"
					),
			})
			.from(orderItems)
			.innerJoin(orders, eq(orderItems.orderId, orders.id))
			.innerJoin(products, eq(orderItems.productId, products.id))
			.where(eq(orderItems.status, "DELIVERED"))
			.groupBy(products.id)
			.orderBy(sql`total_sales DESC`)
			.limit(10);

		// Calculate growth percentage
		const productsWithGrowth = topProducts.map((product) => ({
			...product,
			growth:
				product.previousSales > 0
					? ((product.totalSales - product.previousSales) /
							product.previousSales) *
						100
					: 0, // If no previous sales, growth is 0%
		}));

		const plainTopProducts = JSON.parse(JSON.stringify(productsWithGrowth));
		return plainTopProducts;
	} catch (error) {
		console.error("Error fetching top products:", error);
		return [];
	}
};
