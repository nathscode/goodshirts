import getCurrentUser from "@/src/actions/getCurrentUser";
import db from "@/src/db";
import { orderItems, reviews } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await getCurrentUser();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

		return NextResponse.json(eligibleItems, { status: 200 });
	} catch (error) {
		console.error("Error fetching eligible order items:", error);
		return NextResponse.json(
			{ error: "Failed to fetch eligible order items" },
			{ status: 500 }
		);
	}
}
