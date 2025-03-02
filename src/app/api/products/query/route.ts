import { NextResponse } from "next/server";
import {
	products,
	productVariants,
	productVariantPrices,
	medias,
	categories,
	reviews,
	subCategories,
} from "@/src/db/schema";
import {
	and,
	eq,
	gte,
	lte,
	sql,
	ilike,
	or,
	desc,
	asc,
	count,
	avg,
	inArray,
} from "drizzle-orm";
import db from "@/src/db";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);

		// Extract query parameters
		const category = searchParams.get("category");
		const minPrice = searchParams.get("minPrice");
		const maxPrice = searchParams.get("maxPrice");
		const searchKey = searchParams.get("q");
		const sort = searchParams.get("sort");
		const size = searchParams.get("size");
		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 18; // Fixed limit

		// Validate pagination parameters
		if (isNaN(page) || page < 1) {
			return NextResponse.json(
				{ error: "Invalid page number" },
				{ status: 400 }
			);
		}
		if (isNaN(limit) || limit < 1 || limit > 100) {
			return NextResponse.json(
				{ error: "Invalid limit (1-100)" },
				{ status: 400 }
			);
		}

		// Define filter conditions
		const conditions = [];

		if (category) {
			const existingCategory = await db.query.categories.findFirst({
				where: eq(categories.name, category),
			});
			if (existingCategory) {
				conditions.push(eq(products.categoryId, existingCategory.id));
			}
		}

		if (minPrice && maxPrice) {
			conditions.push(
				and(
					gte(productVariantPrices.price, sql`${minPrice}::decimal`),
					lte(productVariantPrices.price, sql`${maxPrice}::decimal`)
				)
			);
		}

		if (size) {
			conditions.push(eq(productVariantPrices.size, size));
		}

		// Search in product name, description, category, and subCategory
		if (searchKey) {
			const searchTerm = `%${searchKey}%`;
			conditions.push(
				or(
					ilike(products.name, searchTerm),
					ilike(products.description || "", searchTerm),
					ilike(categories.name, searchTerm),
					ilike(subCategories.name, searchTerm)
				)
			);
		}

		// Get product IDs first
		let productIdQuery = db
			.select({ id: products.id })
			.from(products)
			.leftJoin(productVariants, eq(products.id, productVariants.productId))
			.leftJoin(
				productVariantPrices,
				eq(productVariants.id, productVariantPrices.variantId)
			)
			.leftJoin(categories, eq(products.categoryId, categories.id))
			.leftJoin(subCategories, eq(products.subCategoryId, subCategories.id));

		if (conditions.length > 0) {
			//@ts-ignore
			productIdQuery.where(and(...conditions));
		}

		// Apply pagination
		const productIdResults = await productIdQuery
			.limit(limit)
			.offset((page - 1) * limit);

		// Extract product IDs
		const productIds = productIdResults.map((p) => p.id);

		if (productIds.length === 0) {
			return NextResponse.json(
				{
					products: [],
					pagination: {
						totalCount: 0,
						page,
						pageSize: limit,
						totalPages: 0,
					},
				},
				{ status: 200 }
			);
		}

		// Fetch full product details for these IDs
		let baseQuery = db
			.select({
				product: products,
				variant: productVariants,
				variantPrice: productVariantPrices,
				media: medias,
			})
			.from(products)
			.leftJoin(productVariants, eq(products.id, productVariants.productId))
			.leftJoin(
				productVariantPrices,
				eq(productVariants.id, productVariantPrices.variantId)
			)
			.leftJoin(medias, eq(products.id, medias.productId))
			.leftJoin(reviews, eq(products.id, reviews.productId))
			.where(inArray(products.id, productIds));

		// Apply sorting **AFTER** fetching the full products
		switch (sort) {
			case "popularity":
				baseQuery = baseQuery.orderBy(desc(products.totalSales));
				break;
			case "newest":
				baseQuery = baseQuery.orderBy(desc(products.createdAt));
				break;
			case "lowest-price":
				baseQuery = baseQuery.orderBy(
					asc(
						sql`COALESCE(${productVariantPrices.discountPrice}, ${productVariantPrices.price})`
					)
				);
				break;
			case "highest-price":
				baseQuery = baseQuery.orderBy(
					desc(
						sql`COALESCE(${productVariantPrices.discountPrice}, ${productVariantPrices.price})`
					)
				);
				break;
			case "rating":
				baseQuery = baseQuery
					.groupBy(products.id)
					.orderBy(desc(sql`COALESCE(AVG(${reviews.rating}), 0)`));
				break;
			default:
				break;
		}

		// Execute the final query
		const result = await baseQuery;

		// Process results into distinct products
		const productMap = new Map();

		for (const row of result) {
			if (!row.product) continue;

			const productId = row.product.id;

			if (!productMap.has(productId)) {
				productMap.set(productId, {
					...row.product,
					variants: [],
					medias: [],
				});
			}

			const product = productMap.get(productId);

			// Add variant if it exists
			if (row.variant) {
				const existingVariant = product.variants.find(
					(v: any) => v.id === row.variant?.id
				);

				if (!existingVariant) {
					product.variants.push({
						...row.variant,
						variantPrices: row.variantPrice ? [row.variantPrice] : [],
					});
				} else if (row.variantPrice) {
					const priceExists = existingVariant.variantPrices.some(
						(p: any) => p.id === row.variantPrice?.id
					);

					if (!priceExists) {
						existingVariant.variantPrices.push(row.variantPrice);
					}
				}
			}

			// Add media if it exists
			if (row.media) {
				const mediaExists = product.medias.some(
					(m: any) => m.id === row.media?.id
				);

				if (!mediaExists) {
					product.medias.push(row.media);
				}
			}
		}

		// Convert the map to an array of distinct products
		const distinctProducts = Array.from(productMap.values());

		// Get total count
		const totalCountQuery = await db
			.select({ count: count(products.id) })
			.from(products)
			.leftJoin(categories, eq(products.categoryId, categories.id))
			.leftJoin(subCategories, eq(products.subCategoryId, subCategories.id))
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const totalCount = totalCountQuery[0]?.count || 0;
		const totalPages = Math.ceil(totalCount / limit);

		// Build response
		return NextResponse.json(
			{
				products: distinctProducts,
				pagination: {
					totalCount,
					page,
					pageSize: limit,
					totalPages,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching products:", error);
		return NextResponse.json(
			{ error: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}
