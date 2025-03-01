import db from "@/src/db";
import { collections, collectionProducts } from "@/src/db/schema";
import {
	generateRandomString,
	getRandomNumber,
	handlerNativeResponse,
	trimAndLowercase,
} from "@/src/lib/utils";
import { collectionSchema } from "@/src/lib/validators/collection";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/src/actions/getS3Client";
import slugify from "slugify";

const Bucket = process.env.TEBI_BUCKET_NAME;
export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const image: File = formData.get("image") as File;
		const name: string = formData.get("name") as string;
		const description: string = formData.get("description") as string;
		const startDate: string = formData.get("startDate") as string;
		const endDate: string = formData.get("endDate") as string;
		const slug: string = formData.get("slug") as string;
		const productIds = JSON.parse(formData.get("productIds") as string);

		if (!name || !description || !startDate || !endDate) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: "Name, category, and sub-category are required",
					},
				},
				400
			);
		}
		// Format collection name and slug
		const formattedName = trimAndLowercase(name);
		let collectionSlug = slugify(formattedName, { lower: true });

		// Check if a collection with the same slug already exists
		const existingCollection = await db.query.collections.findFirst({
			where: eq(collections.slug, collectionSlug),
		});

		if (existingCollection) {
			collectionSlug += `-${generateRandomString()}`; // Append a random string to make the slug unique
		}
		const buffer = Buffer.from(await image.arrayBuffer());
		const uniqueName = Date.now() + "_" + getRandomNumber(1, 999999);
		const imgExt = image.name.split(".");
		const filename = uniqueName + "." + imgExt[1];

		const fileParams = {
			Bucket: Bucket,
			Key: `uploads/${filename}`,
			Body: buffer,
			ContentType: image.type,
		};
		const command = new PutObjectCommand(fileParams);
		await s3.send(command);

		const imageUrl = `${process.env.NEXT_PUBLIC_TEBI_URL}/uploads/${filename}`;

		const result = await db.transaction(async (tx) => {
			// Insert new collection
			const [newCollection] = await tx
				.insert(collections)
				.values({
					name: formattedName,
					slug: collectionSlug,
					image: imageUrl,
					description,
					startDate: startDate ? new Date(startDate) : null,
					endDate: endDate ? new Date(endDate) : null,
				})
				.returning();

			if (!newCollection) {
				throw new Error("Failed to create collection");
			}
			if (productIds && productIds.length > 0) {
				await tx.insert(collectionProducts).values(
					productIds.map((productId: any) => ({
						collectionId: newCollection.id,
						productId,
					}))
				);
			}

			return newCollection;
		});

		return NextResponse.json({ status: "success" });
	} catch (error) {
		console.error("Error creating collection:", error);

		// Handle specific errors
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message || "Internal server error" },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
