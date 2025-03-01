"use server";
import { eq, sql } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";
import db from "../db";
import {
	OrderType,
	orderItems,
	orders,
	products,
	statusEnum,
} from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import { orderUpdateSchema } from "../lib/validators/order";
import getCurrentUser from "./getCurrentUser";

const logger = getLogger();

type OrderResponse = {
	message: string;
	status: string;
	order?: OrderType;
};

export async function dashboardOrdersUpdate(
	values: z.infer<typeof orderUpdateSchema>
): Promise<OrderResponse | null> {
	noStore();

	// Check user authentication
	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}
	if (session.type !== "ADMIN") {
		throw Error("Unauthorized access");
	}

	// Validate request payload
	const validatedFields = orderUpdateSchema.safeParse(values);
	if (!validatedFields.success) {
		return {
			status: "error",
			message: `${validatedFields.error.flatten().fieldErrors}`,
		};
	}

	const { status, orderId } = validatedFields.data;

	// Check if order exists
	const orderExist = await db.query.orderItems.findFirst({
		where: eq(orderItems.id, String(orderId!)),
	});
	if (!orderExist) {
		return {
			status: "error",
			message: "Order does not exist",
		};
	}

	try {
		const typedStatus = status as (typeof statusEnum.enumValues)[number];

		const [orderUpdated] = await db
			.update(orderItems)
			.set({ status: typedStatus })
			.where(eq(orderItems.id, orderExist.id))
			.returning();

		if (!orderUpdated) {
			return { status: "error", message: "Failed to update order" };
		}
		if (typedStatus === "DELIVERED") {
			await db
				.update(products)
				.set({
					totalSales: sql`${products.totalSales} + 1`,
				})
				.where(eq(products.id, orderExist.productId!));
		}

		return {
			status: "success",
			message: "Order updated successfully!",
		};
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to update order");
	}
}
