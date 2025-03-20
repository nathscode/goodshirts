import db from "@/src/db";
import { eq, sql } from "drizzle-orm";
import { PgTable, AnyPgColumn } from "drizzle-orm/pg-core";

interface SKUConfig {
	prefix?: string;
	paddingLength?: number;
	separator?: string;
}

// 🔹 Type constraint: Table must have 'sku' column
interface TableWithSKU<T extends AnyPgColumn = AnyPgColumn> extends PgTable {
	sku: T;
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

	// 🔹 Format SKU based on product name
	private formatSKU(name: string): string {
		const words = name.split(" ").filter((word) => word.length > 2);

		if (words.length < 2)
			throw new SKUGenerationError(
				"Product name is too short for SKU generation"
			);

		const firstPart = words[0].substring(0, 3).toUpperCase();
		const lastPart = words[words.length - 1].substring(0, 3).toUpperCase();

		return `${lastPart}-${firstPart}`;
	}

	// 🔹 Generate SKU
	public async generateSKU<T extends AnyPgColumn>(
		name: string,
		table: TableWithSKU<T>,
		config?: Partial<SKUConfig>
	): Promise<string> {
		try {
			const finalConfig = { ...this.defaultConfig, ...config };
			const baseSKU = this.formatSKU(name);

			// Get count of existing SKUs with same prefix
			const count = await this.getProductCount(baseSKU, table);
			const sequentialNumber = (count + 1)
				.toString()
				.padStart(finalConfig.paddingLength || 3, "0");

			const sku = [baseSKU, sequentialNumber].join(
				finalConfig.separator || "-"
			);

			// Ensure SKU is unique
			const exists = await this.isSKUExists(sku, table);
			if (exists) {
				// Recursively try with longer padding
				return this.generateSKU(name, table, {
					...config,
					paddingLength: finalConfig.paddingLength! + 1,
				});
			}

			return sku;
		} catch (error) {
			throw new SKUGenerationError(
				`Failed to generate SKU: ${
					error instanceof Error ? error.message : "Unknown error"
				}`
			);
		}
	}

	// 🔹 Check if SKU exists
	public async isSKUExists<T extends AnyPgColumn>(
		sku: string,
		table: TableWithSKU<T>
	): Promise<boolean> {
		const existingRecord = await db
			.select()
			.from(table)
			.where(eq(table.sku, sku))
			.limit(1);

		return existingRecord.length > 0;
	}

	// 🔹 Get product count based on SKU prefix
	private async getProductCount<T extends AnyPgColumn>(
		skuPrefix: string,
		table: TableWithSKU<T>
	): Promise<number> {
		try {
			const result = await db
				.select({ count: sql<number>`COUNT(*)` })
				.from(table)
				.where(sql`${table.sku} LIKE ${skuPrefix + "%"}`);

			return result[0]?.count || 0;
		} catch (error) {
			console.error("Error fetching product count:", error);
			return 0;
		}
	}

	// 🔹 Validate SKU format
	public validateSKU(sku: string): boolean {
		const skuRegex = /^[A-Z]{3}-[A-Z]{3}-\d{3,}$/;
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
