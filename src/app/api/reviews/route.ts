import getCurrentUser from "@/src/actions/getCurrentUser";
import db from "@/src/db";
import { reviews } from "@/src/db/schema";
import { handlerNativeResponse } from "@/src/lib/utils";
import { ReviewSchema, ReviewSchemaInfer } from "@/src/lib/validators/review";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await getCurrentUser();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get delivered orderItems with product, variant, and size details
		const AllUserReviews = await db.query.reviews.findMany({
			where: and(
				eq(reviews.userId, session.id!),
				eq(reviews.isVerifiedPurchase, true)
			),
			orderBy: [desc(reviews.createdAt)],
			with: {
				product: {
					with: {
						medias: true,
					},
				},
			},
		});

		return NextResponse.json(AllUserReviews, { status: 200 });
	} catch (error) {
		console.error("Error fetching eligible order items:", error);
		return NextResponse.json(
			{ error: "Failed to fetch eligible order items" },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		const session = await getCurrentUser();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body: ReviewSchemaInfer = await req.json();
		const payload = ReviewSchema.safeParse(body);
		if (!payload.success) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: payload.error.message,
					},
				},
				400
			);
		}

		const { productId, title, rating, comment } = payload.data;

		if (!productId || !rating || !title) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}
		const existingCategory = await db.query.reviews.findFirst({
			where: eq(reviews.productId, String(productId)),
		});

		if (existingCategory) {
			return handlerNativeResponse(
				{
					status: 409,
					errors: {
						message: "Already reviewed this product",
					},
				},
				401
			);
		}

		// Insert review into the database
		await db.insert(reviews).values({
			productId,
			userId: session.id,
			title,
			rating,
			comment,
			isVerifiedPurchase: true,
			createdAt: new Date(),
		});

		return NextResponse.json({ status: "success" });
	} catch (error) {
		console.error("Error creating review:", error);
		return NextResponse.json(
			{ error: "Failed to submit review" },
			{ status: 500 }
		);
	}
}
