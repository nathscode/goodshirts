import db from "@/src/db";
import { collections, collectionProducts } from "@/src/db/schema";
import {
	generateRandomString,
	getRandomNumber,
	handlerNativeResponse,
	trimAndLowercase,
} from "@/src/lib/utils";
import { collectionSchema } from "@/src/lib/validators/collection";
import { and, eq, not } from "drizzle-orm";
import { NextResponse } from "next/server";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/src/actions/getS3Client";
import slugify from "slugify";
import { getLogger } from "@/src/lib/backend/logger";

const logger = getLogger();

const Bucket = process.env.TEBI_BUCKET_NAME;

export async function GET(
	request: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		const { slug } = params;

		if (!slug) {
			return NextResponse.json({ error: "Slug is required" }, { status: 400 });
		}

		const collection = await db.query.collections.findFirst({
			where: eq(collections.slug, slug),
			with: {
				collectionProducts: {
					with: {
						product: {
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
						},
					},
				},
			},
		});

		if (!collection) {
			return NextResponse.json(
				{ error: "Collection not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(collection);
	} catch (error) {
		logger.error("Database Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch collection" },
			{ status: 500 }
		);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	try {
		const { slug } = params;
		const formData = await req.formData();

		// Get existing collection
		const existingCollection = await db.query.collections.findFirst({
			where: eq(collections.slug, slug),
		});

		if (!existingCollection) {
			return handlerNativeResponse(
				{ status: 404, errors: { message: "Collection not found" } },
				404
			);
		}

		// Extract form data
		const image: File | null = formData.get("image") as File | null;
		const name: string = formData.get("name") as string;
		const description: string = formData.get("description") as string;
		const startDate: string = formData.get("startDate") as string;
		const endDate: string = formData.get("endDate") as string;
		const productIds = JSON.parse(formData.get("productIds") as string);

		// Validate required fields
		if (!name || !description || !startDate || !endDate) {
			return handlerNativeResponse(
				{ status: 400, errors: { message: "All fields are required" } },
				400
			);
		}

		// Handle image update
		let imageUrl = existingCollection.image;
		if (image && image.size > 0) {
			// Delete old image if it exists
			if (existingCollection.image) {
				const oldImageKey = existingCollection.image.split("/uploads/")[1];
				try {
					await s3.send(
						new DeleteObjectCommand({
							Bucket: Bucket,
							Key: `uploads/${oldImageKey}`,
						})
					);
				} catch (error) {
					console.error("Error deleting old image:", error);
				}
			}

			// Upload new image
			const buffer = Buffer.from(await image.arrayBuffer());
			const uniqueName = Date.now() + "_" + getRandomNumber(1, 999999);
			const imgExt = image.name.split(".").pop();
			const filename = uniqueName + "." + imgExt;

			await s3.send(
				new PutObjectCommand({
					Bucket: Bucket,
					Key: `uploads/${filename}`,
					Body: buffer,
					ContentType: image.type,
				})
			);

			imageUrl = `${process.env.NEXT_PUBLIC_TEBI_URL}/uploads/${filename}`;
		}

		// Handle slug update if name changed
		let newSlug = existingCollection.slug;
		if (
			name.trim().toLowerCase() !== existingCollection.name.trim().toLowerCase()
		) {
			const formattedName = trimAndLowercase(name);
			newSlug = slugify(formattedName, { lower: true });

			// Check if new slug already exists (excluding current collection)
			const slugExists = await db.query.collections.findFirst({
				where: and(
					eq(collections.slug, newSlug),
					not(eq(collections.id, existingCollection.id))
				),
			});

			if (slugExists) {
				newSlug += `-${generateRandomString()}`;
			}
		}

		// Update collection in transaction
		const result = await db.transaction(async (tx) => {
			// Update collection
			const [updatedCollection] = await tx
				.update(collections)
				.set({
					name: name.trim(),
					slug: newSlug,
					image: imageUrl,
					description,
					startDate: startDate ? new Date(startDate) : null,
					endDate: endDate ? new Date(endDate) : null,
					updatedAt: new Date(),
				})
				.where(eq(collections.id, existingCollection.id))
				.returning();

			if (!updatedCollection) {
				throw new Error("Failed to update collection");
			}

			// Update collection products
			// First, delete all existing collection products
			await tx
				.delete(collectionProducts)
				.where(eq(collectionProducts.collectionId, existingCollection.id));

			// Then add the new ones
			if (productIds && productIds.length > 0) {
				await tx.insert(collectionProducts).values(
					productIds.map((productId: string) => ({
						collectionId: updatedCollection.id,
						productId,
					}))
				);
			}

			return updatedCollection;
		});

		return NextResponse.json({ status: "success", data: result });
	} catch (error) {
		console.error("Error updating collection:", error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : "Internal server error",
			},
			{ status: 500 }
		);
	}
}
