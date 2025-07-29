import db from "@/src/db";
import { products } from "@/src/db/schema";
import { getLogger } from "@/src/lib/backend/logger";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

const logger = getLogger();
export async function GET() {
	try {
		const allProducts = await db.query.products.findMany({
			where: eq(products.isActive, true),
			orderBy: [desc(products.createdAt)],
			with: {
				category: true,
				subCategory: true,
				variants: {
					with: {
						variantPrices: true,
					},
				},
				medias: true,
				reviews: {
					with: {
						user: true,
					},
				},
				saved: {
					with: {
						user: true,
					},
				},
			},
		});

		return NextResponse.json(allProducts);
	} catch (error) {
		logger.error("Database Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}
