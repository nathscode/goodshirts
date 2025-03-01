import db from "@/src/db";
import { products } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";

interface SKUConfig {
	prefix?: string;
	paddingLength?: number;
	separator?: string;
}

class SKUGenerationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SKUGenerationError";
	}
}

export class SKUGenerator {
	private static instance: SKUGenerator | null = null;

	private defaultConfig: SKUConfig = {
		prefix: "PRD",
		paddingLength: 3,
		separator: "-",
	};

	private constructor() {}

	public static async getInstance(): Promise<SKUGenerator> {
		if (!SKUGenerator.instance) {
			SKUGenerator.instance = new SKUGenerator();
		}
		return SKUGenerator.instance;
	}

	// 🔹 Function to generate SKU from product name
	private formatSKU(name: string): string {
		const words = name.split(" ").filter((word) => word.length > 2);

		if (words.length < 2)
			throw new SKUGenerationError(
				"Product name is too short for SKU generation"
			);

		const firstPart = words[0].substring(0, 3).toUpperCase(); // First three letters of first word
		const lastPart = words[words.length - 1].substring(0, 3).toUpperCase(); // First three letters of last word

		return `${lastPart}-${firstPart}`;
	}

	// 🔹 Generate SKU using Drizzle ORM
	public async generateSKU(
		name: string,
		config?: Partial<SKUConfig>
	): Promise<string> {
		try {
			const finalConfig = { ...this.defaultConfig, ...config };
			const baseSKU = this.formatSKU(name);

			// Get product count to generate sequence
			const count = await this.getProductCount(baseSKU);
			const sequentialNumber = (count + 1)
				.toString()
				.padStart(finalConfig.paddingLength || 3, "0");

			const sku = [baseSKU, sequentialNumber].join(
				finalConfig.separator || "-"
			);

			// Ensure SKU is unique
			const exists = await this.isSKUExists(sku);
			if (exists) {
				return this.generateSKU(name, {
					...config,
					paddingLength: finalConfig.paddingLength! + 1,
				});
			}

			return sku;
		} catch (error) {
			throw new SKUGenerationError(
				`Failed to generate SKU: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	}

	// 🔹 Check if SKU already exists using Drizzle ORM
	public async isSKUExists(sku: string): Promise<boolean> {
		const existingProduct = await db.query.products.findFirst({
			where: eq(products.sku, sku),
		});
		return !!existingProduct;
	}

	// 🔹 Get product count based on SKU prefix
	private async getProductCount(skuPrefix: string): Promise<number> {
		try {
			const result = await db
				.select({ count: sql<number>`COUNT(*)` })
				.from(products)
				.where(sql`${products.sku} LIKE ${skuPrefix + "%"}`);

			return result[0]?.count || 0;
		} catch (error) {
			console.error("Error fetching product count:", error);
			return 0;
		}
	}
	// 🔹 Validate SKU format
	public validateSKU(sku: string): boolean {
		const skuRegex = /^[A-Z]{3}-[A-Z]{3}-\d{3,4}$/;
		return skuRegex.test(sku);
	}

	// 🔹 Parse SKU into parts
	public parseSKU(
		sku: string
	): { prefix: string; category: string; sequence: string } | null {
		const parts = sku.split("-");
		if (parts.length !== 3) return null;

		return {
			prefix: parts[0],
			category: parts[1],
			sequence: parts[2],
		};
	}
}
