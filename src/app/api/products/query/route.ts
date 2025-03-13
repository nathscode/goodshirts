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
import { getLogger } from "@/src/lib/backend/logger";
const logger = getLogger();
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
		if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
			return NextResponse.json(
				{ error: "Invalid pagination values" },
				{ status: 400 }
			);
		}

		const conditions = [eq(products.isActive, true)]; // Always fetch active products

		// Filter by category
		if (category) {
			const decodedCategory = decodeURIComponent(category.trim());
			const existingCategory = await db.query.categories.findFirst({
				where: ilike(categories.name, decodedCategory),
			});

			if (existingCategory) {
				conditions.push(eq(products.categoryId, existingCategory.id));
			}
		}

		// Filter by price range
		if (minPrice && maxPrice) {
			conditions.push(
				and(
					gte(productVariantPrices.price, sql`${minPrice}::decimal`),
					lte(productVariantPrices.price, sql`${maxPrice}::decimal`)
				)
			);
		}

		// Filter by size
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

		// Determine if we should fetch all active products
		const shouldFetchAll =
			!category && !minPrice && !maxPrice && !searchKey && !sort && !size;

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

		// Apply filtering if necessary
		if (!shouldFetchAll && conditions.length > 0) {
			productIdQuery = productIdQuery.where(and(...conditions));
		}

		// Fetch matching product IDs
		const productIdResults = await productIdQuery;
		const productIds = productIdResults.map((p) => p.id);

		console.log("🔎 Product IDs found:", productIds.length);

		// If no matching products, return empty response
		if (productIds.length === 0) {
			return NextResponse.json(
				{
					products: [],
					pagination: { totalCount: 0, page, pageSize: limit, totalPages: 0 },
				},
				{ status: 200 }
			);
		}

		// Fetch full product details for the matched product IDs
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

		// Apply sorting
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
				productMap.set(productId, { ...row.product, variants: [], medias: [] });
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

		// **Filter out products without variants BEFORE pagination**
		const filteredProducts = distinctProducts.filter(
			(product: any) => product.variants.length > 0
		);
		const totalCount = filteredProducts.length;
		const totalPages = Math.ceil(totalCount / limit);

		// Apply pagination **after filtering**
		const paginatedProducts = filteredProducts.slice(
			(page - 1) * limit,
			page * limit
		);

		// Return the final response
		return NextResponse.json(
			{
				products: paginatedProducts,
				pagination: { totalCount, page, pageSize: limit, totalPages },
			},
			{ status: 200 }
		);
	} catch (error) {
		logger.error("❌ Error fetching products:", error);
		return NextResponse.json(
			{ error: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}
