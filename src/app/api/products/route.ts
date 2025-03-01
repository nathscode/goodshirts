import checkIsAdmin from "@/src/actions/checkIsAdmin";
import getCurrentUser from "@/src/actions/getCurrentUser";
import { s3 } from "@/src/actions/getS3Client";
import db from "@/src/db";
import { categories, medias, products, subCategories } from "@/src/db/schema";
import { getLogger } from "@/src/lib/backend/logger";
import {
	generateProductSKU,
	generateRandomNumbers,
	generateRandomString,
	getRandomNumber,
	handlerNativeResponse,
	trimAndLowercase,
} from "@/src/lib/utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { ZodError } from "zod";

const logger = getLogger();
const Bucket = process.env.TEBI_BUCKET_NAME;

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const params = Object.fromEntries(searchParams);
		const { category } = params;

		let conditions = [eq(products.isActive, true)];

		// **📌 Category Filtering Logic**
		if (category) {
			const existingCategory = await db.query.categories.findFirst({
				where: eq(categories.name, String(category)),
			});

			// **🛑 If Category Not Found, Return Error**
			if (!existingCategory) {
				return new NextResponse(
					JSON.stringify({
						status: 403,
						message: "Category not found",
					}),
					{ status: 403 }
				);
			}

			// **📌 Add Category Condition**
			conditions.push(eq(products.categoryId, existingCategory.id));
		}

		// **🔥 Fetch Products**
		const productsList = await db.query.products.findMany({
			where: and(...conditions),
			with: {
				medias: {
					columns: {
						id: true,
						url: true,
					},
				}, // Explicitly define columns in `medias`
				category: {
					columns: {
						id: true,
						name: true,
					},
				},
				variants: {
					with: {
						variantPrices: true,
					},
				},
			},
			orderBy: [sql`${products.createdAt} DESC`],
		});

		// **🛑 If No Products Found**
		if (!productsList.length) {
			return new NextResponse(
				JSON.stringify({ status: 404, message: "No products found" }),
				{ status: 404 }
			);
		}

		// **📊 Get Total Product Count**
		const [{ count }] = await db
			.select({ count: sql<number>`count(*)` })
			.from(products)
			.where(and(...conditions));

		// **📌 Pagination Logic**

		// **📦 Return Response**
		return new NextResponse(
			JSON.stringify({
				data: productsList,
			}),
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error fetching products:", error);
		return new NextResponse(
			JSON.stringify({ status: 500, message: error.message }),
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	const images: File[] = formData.getAll("images") as File[];
	const name: string = formData.get("name") as string;
	const description: string = formData.get("description") as string;
	const price: string = formData.get("price") as string;
	const discountPrice: string = formData.get("discountPrice") as string;
	const stock: string = formData.get("stock") as string;
	const categoryId: string = formData.get("categoryId") as string;
	const subCategoryId: string = formData.get("SubCategoryId") as string;

	try {
		// Authentication and Authorization
		const session = await getCurrentUser();
		if (!session) {
			return handlerNativeResponse(
				{ status: 401, errors: { message: "Unauthorized user" } },
				401
			);
		}
		const isAdmin = await checkIsAdmin();
		if (!isAdmin) {
			return handlerNativeResponse(
				{
					status: 403,
					errors: { message: "Not authorized to make this request" },
				},
				403
			);
		}

		// Validate Required Fields
		if (!name || !categoryId || !subCategoryId) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: { message: "Name, category, and sub-category are required" },
				},
				400
			);
		}

		// Check if Category and Sub-Category Exist
		const [existingCategory, existingSubCategory] = await Promise.all([
			db.query.categories.findFirst({ where: eq(categories.id, categoryId) }),
			db.query.subCategories.findFirst({
				where: eq(subCategories.id, subCategoryId),
			}),
		]);

		if (!existingCategory || !existingSubCategory) {
			return handlerNativeResponse(
				{
					status: 404,
					errors: { message: "Category or Sub-category not found" },
				},
				404
			);
		}

		// Generate Product Slug and SKU
		const formattedName = trimAndLowercase(name);
		let productName = formattedName;
		const existingName = await db.query.products.findFirst({
			where: eq(products.name, productName),
		});
		if (existingName) {
			productName = `${generateRandomNumbers(7)}-${productName}`;
		}
		let productSlug = slugify(formattedName, { lower: true });
		const existingProduct = await db.query.products.findFirst({
			where: eq(products.slug, productSlug),
		});
		if (existingProduct) {
			productSlug += `-${generateRandomString()}`;
		}
		const sku = await generateProductSKU(formattedName);

		// Upload Images to S3 in Parallel
		const uploadPromises = images.map(async (image) => {
			const buffer = Buffer.from(await image.arrayBuffer());
			const uniqueName = Date.now() + "_" + getRandomNumber(1, 999999);
			const imgExt = image.name.split(".").pop();
			const filename = `${uniqueName}.${imgExt}`;

			const fileParams = {
				Bucket,
				Key: `medias/${filename}`,
				Body: buffer,
				ContentType: image.type,
			};
			const command = new PutObjectCommand(fileParams);
			await s3.send(command);

			return {
				url: `${process.env.NEXT_PUBLIC_TEBI_URL}/medias/${filename}`,
				altText: `${formattedName}`,
			};
		});

		const uploadedImages = await Promise.all(uploadPromises);

		// Use Drizzle Transaction for Atomic Operations
		const result = await db.transaction(async (tx) => {
			// Insert Product into Database
			const [newProduct] = await tx
				.insert(products)
				.values({
					// @ts-ignore
					name: productName,
					slug: productSlug,
					description,
					basePrice: Number(price),
					baseDiscountPrice: Number(discountPrice),
					stockQuantity: Number(stock),
					categoryId: existingCategory.id,
					subCategoryId: existingSubCategory.id,
					sku,
					isActive: true,
					totalSales: 0,
					totalViews: 0,
					averageRating: 0,
				})
				.returning();

			if (!newProduct) {
				throw new Error("Failed to create product");
			}

			// Insert Media Records into Database
			if (uploadedImages.length > 0) {
				const mediaRecords = uploadedImages.map((image) => ({
					...image,
					productId: newProduct.id,
				}));
				await tx.insert(medias).values(mediaRecords);
			}

			return newProduct;
		});

		logger.info("Product and media records created successfully");
		return NextResponse.json({ status: "success", slug: result.slug });
	} catch (error: any) {
		logger.error("PRODUCT CREATION ERROR:", error);

		if (error instanceof ZodError) {
			return handlerNativeResponse(
				{
					status: 422,
					errors: { message: error.errors[0]?.message || "Validation failed" },
				},
				422
			);
		}

		return handlerNativeResponse(
			{
				status: 500,
				errors: { message: error.message || "Something went wrong" },
			},
			500
		);
	}
}
