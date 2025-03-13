import { cuid2 } from "drizzle-cuid2/postgres";
import { relations, sql } from "drizzle-orm";
import {
	boolean,
	date,
	decimal,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const rolesTypeEnum = pgEnum("role_type_enum", [
	"ADMIN",
	"EMPLOYEE",
	"SALES",
	"CUSTOMER",
]);
export const addressTypeEnum = pgEnum("address_type_enum", ["WORK", "HOME"]);
export const statusEnum = pgEnum("status_enum", [
	"PENDING",
	"PROCESSING",
	"ACTIVE",
	"NONACTIVE",
	"CONFIRMED",
	"SHIPPED",
	"DELIVERED",
	"CANCELLED",
	"REFUNDED",
	"SUCCESS",
]);

export const paymentStatusEnum = pgEnum("payment_status_enum", [
	"PENDING",
	"PROCESSING",
	"COMPLETED",
	"FAILED",
	"REFUNDED",
	"CANCELLED",
	"SUCCESS",
]);

export const processorTypeEnum = pgEnum("processor_type_enum", [
	"PAYSTACK",
	"FLUTTERWAVE",
	"BANK_TRANSFER",
]);

export const paymentMethodEnum = pgEnum("payment_method_enum", [
	"CREDIT_CARD",
	"DEBIT_CARD",
	"OPAY",
	"BANK_TRANSFER",
	"WALLET",
	"ONLINE",
]);

export interface Size {
	size: string; // e.g., "S", "M", "L"
	available: boolean; // Whether the size is available
}

export const users = pgTable("users", {
	id: cuid2("id").defaultRandom().primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	firstName: varchar("first_name", { length: 100 }),
	lastName: varchar("last_name", { length: 100 }),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 20 }),
	dateOfBirth: date("date_of_birth"),
	isEmailVerified: boolean("is_email_verified").default(false),
	isPhoneVerified: boolean("is_phone_verified").default(false),
	verificationCode: varchar("verification_code", { length: 6 }),
	verified: boolean("verified").default(false),
	emailVerified: timestamp("email_verified"),
	lastLoginAt: timestamp("last_login_at"),
	preferences: jsonb("preferences").default({}),
	role: rolesTypeEnum("role").default("CUSTOMER"),
	image: text("image"),
	status: statusEnum("status").default("ACTIVE"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const accounts = pgTable(
	"accounts",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccountType>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(table) => [
		{
			compoundKey: primaryKey({
				columns: [table.provider, table.providerAccountId],
			}),
		},
	]
);

export const sessions = pgTable("sessions", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(table) => [
		{
			compositePk: primaryKey({
				columns: [table.identifier, table.token],
			}),
		},
	]
);
export const authenticators = pgTable(
	"authenticators",
	{
		credentialID: text("credentialID").notNull().unique(),
		userId: cuid2("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		providerAccountId: text("providerAccountId").notNull(),
		credentialPublicKey: text("credentialPublicKey").notNull(),
		counter: integer("counter").notNull(),
		credentialDeviceType: text("credentialDeviceType").notNull(),
		credentialBackedUp: boolean("credentialBackedUp").notNull(),
		transports: text("transports"),
	},
	(table) => ({
		compositePK: primaryKey({
			columns: [table.credentialID, table.userId],
		}),
	})
);
// Categories table
export const categories = pgTable("categories", {
	id: cuid2("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	slug: varchar("slug", { length: 100 }).notNull().unique(),
	description: text("description"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});
export const subCategories = pgTable("sub_categories", {
	id: cuid2("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	slug: varchar("slug", { length: 100 }).notNull().unique(),
	description: text("description"),
	categoryId: cuid2("category_id").references(() => categories.id),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// Collections table
export const collections = pgTable("collections", {
	id: cuid2("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	slug: varchar("slug", { length: 100 }).notNull().unique(),
	description: text("description"),
	image: varchar("image", { length: 255 }).notNull(),
	isActive: boolean("is_active").default(true),
	startDate: timestamp("start_date"),
	endDate: timestamp("end_date"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const collectionProducts = pgTable("collection_products", {
	id: cuid2("id").defaultRandom().primaryKey(),
	collectionId: varchar("collection_id", { length: 36 })
		.notNull()
		.references(() => collections.id, { onDelete: "cascade" }),
	productId: varchar("product_id", { length: 36 })
		.notNull()
		.references(() => products.id, { onDelete: "cascade" }),
});
// Products table
export const products = pgTable("products", {
	id: cuid2("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 255 }).notNull().unique(),
	description: text("description"),
	basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
	baseDiscountPrice: decimal("base_discount_price", {
		precision: 10,
		scale: 2,
	}).notNull(),
	stockQuantity: integer("stock_quantity").default(1),
	categoryId: cuid2("category_id").references(() => categories.id),
	subCategoryId: cuid2("sub_category_id").references(() => subCategories.id),
	sku: varchar("sku", { length: 50 }).notNull().unique(),
	isActive: boolean("is_active").default(true),
	isFeatured: boolean("is_featured").default(false),
	totalSales: integer("total_sales").default(0),
	totalViews: integer("total_views").default(0),
	averageRating: decimal("average_rating", { precision: 3, scale: 2 }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// Product variants table (for different sizes and colors)
export const productVariants = pgTable("product_variants", {
	id: cuid2("id").defaultRandom().primaryKey(),
	productId: cuid2("product_id").references(() => products.id, {
		onDelete: "cascade",
	}),
	color: varchar("color", { length: 50 }).notNull(),
	sku: varchar("sku", { length: 50 }).notNull().unique(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const productVariantPrices = pgTable("product_variant_prices", {
	id: cuid2("id").defaultRandom().primaryKey(),
	variantId: cuid2("variant_id").references(() => productVariants.id, {
		onDelete: "cascade",
	}),
	size: varchar("size", { length: 20 }).notNull(),
	price: decimal("price", { precision: 10, scale: 2 }).notNull(),
	discountPrice: decimal("discount_price", { precision: 10, scale: 2 }),
	stockQuantity: integer("stock_quantity").default(1),
	available: boolean("available").default(true),
});
// Product images table
export const medias = pgTable("medias", {
	id: cuid2("id").defaultRandom().primaryKey(),
	productId: cuid2("product_id").references(() => products.id, {
		onDelete: "cascade",
	}),
	url: varchar("url", { length: 255 }).notNull(),
	altText: varchar("alt_text", { length: 255 }),
	isDefault: boolean("is_default").default(false),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

// Reviews table
export const reviews = pgTable("reviews", {
	id: cuid2("id").defaultRandom().primaryKey(),
	productId: cuid2("product_id").references(() => products.id),
	userId: cuid2("user_id").references(() => users.id),
	title: varchar("title", { length: 255 }).notNull(),
	rating: integer("rating").notNull(),
	comment: text("comment"),
	isVerifiedPurchase: boolean("is_verified_purchase").default(false),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// Orders table
export const orders = pgTable("orders", {
	id: cuid2("id").defaultRandom().primaryKey(),
	userId: cuid2("user_id").references(() => users.id),
	orderNumber: varchar("order_number", { length: 10 }).notNull().unique(),
	status: statusEnum("status").default("PENDING"),
	total: decimal("total", { precision: 10, scale: 2 }).notNull(),
	grandTotal: decimal("grand_total", { precision: 10, scale: 2 }).notNull(),
	shippingFee: decimal("shipping_fee", { precision: 10, scale: 2 }).notNull(),
	shippingAddress: cuid2("address_id").references(() => addressTable.id, {
		onDelete: "set null",
	}),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const orderItems = pgTable("order_items", {
	id: cuid2("id").defaultRandom().primaryKey(),
	orderId: cuid2("order_id").references(() => orders.id, {
		onDelete: "cascade",
	}),
	productId: cuid2("product_id").references(() => products.id),

	variantId: cuid2("variant_id").references(() => productVariants.id, {
		onDelete: "set null",
	}),
	status: statusEnum("status").default("PENDING"),
	sizeId: cuid2("size_id").references(() => productVariantPrices.id, {
		onDelete: "set null",
	}),
	quantity: integer("quantity").notNull(),
	price: decimal("price", { precision: 10, scale: 2 }).notNull(),
	discountPrice: decimal("discount_price", { precision: 10, scale: 2 }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// Payments table
export const payments = pgTable("payments", {
	id: cuid2("id").defaultRandom().primaryKey(),
	number: serial("number").unique(),
	status: paymentStatusEnum("status").notNull(),
	refId: varchar("ref_id", { length: 255 }).unique().notNull(),
	isSuccessful: boolean("is_successful").default(false),
	payable: decimal("payable", { precision: 10, scale: 2 }).notNull(),
	processor: processorTypeEnum("processor").notNull(),
	paymentMethod: paymentMethodEnum("payment_method").notNull(),
	userId: cuid2("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	orderId: cuid2("order_id")
		.notNull()
		.references(() => orders.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// Addresses table
export const addressTable = pgTable("addresses", {
	id: cuid2("id").defaultRandom().primaryKey(),
	userId: cuid2("user_id").references(() => users.id),
	addressType: addressTypeEnum("address_type").default("HOME"),
	isDefault: boolean("is_default").default(false),
	fullName: varchar("full_name", { length: 255 }).notNull(),
	addressLine1: varchar("address_line1", { length: 255 }).notNull(),
	addressLine2: varchar("address_line2", { length: 255 }),
	landmark: varchar("landmark", { length: 255 }),
	city: varchar("city", { length: 100 }).notNull(),
	state: varchar("state", { length: 100 }).notNull(),
	postalCode: varchar("postal_code", { length: 20 }),
	country: varchar("country", { length: 100 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 20 }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// Saved Products (Wishlist) table
export const savedProducts = pgTable("saved_products", {
	id: cuid2("id").defaultRandom().primaryKey(),
	userId: cuid2("user_id").references(() => users.id),
	productId: cuid2("product_id").references(() => products.id, {
		onDelete: "cascade",
	}),
	variantId: cuid2("variant_id").references(() => productVariants.id, {
		onDelete: "set null",
	}),
	sizeId: cuid2("size_id").references(() => productVariantPrices.id, {
		onDelete: "set null",
	}),
	createdAt: timestamp("created_at", { withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const addressesRelations = relations(addressTable, ({ one }) => ({
	user: one(users, {
		fields: [addressTable.userId],
		references: [users.id],
	}),
}));

export const savedProductsRelations = relations(savedProducts, ({ one }) => ({
	user: one(users, {
		fields: [savedProducts.userId],
		references: [users.id],
	}),
	product: one(products, {
		fields: [savedProducts.productId],
		references: [products.id],
	}),
	variant: one(productVariants, {
		fields: [savedProducts.variantId],
		references: [productVariants.id],
	}),
	size: one(productVariantPrices, {
		fields: [savedProducts.sizeId],
		references: [productVariantPrices.id],
	}),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
	user: one(users, {
		fields: [payments.userId],
		references: [users.id],
	}),
	order: one(orders, {
		fields: [payments.orderId],
		references: [orders.id],
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	addresses: many(addressTable),
	savedProducts: many(savedProducts),
	orders: many(orders),
	reviews: many(reviews),
}));

// Define relations
export const categoriesRelations = relations(categories, ({ many }) => ({
	products: many(products),
	subCategories: many(subCategories),
}));

export const subCategoriesRelations = relations(subCategories, ({ one }) => ({
	category: one(categories, {
		fields: [subCategories.categoryId],
		references: [categories.id],
	}),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
	}),
	subCategory: one(subCategories, {
		fields: [products.subCategoryId],
		references: [subCategories.id],
	}),
	saved: many(savedProducts),
	variants: many(productVariants),
	medias: many(medias),
	reviews: many(reviews),
}));

export const productVariantsRelations = relations(
	productVariants,
	({ one, many }) => ({
		product: one(products, {
			fields: [productVariants.productId],
			references: [products.id],
		}),
		orderItems: many(orderItems),
		variantPrices: many(productVariantPrices),
	})
);
export const productVariantPricesRelations = relations(
	productVariantPrices,
	({ one }) => ({
		variant: one(productVariants, {
			fields: [productVariantPrices.variantId],
			references: [productVariants.id],
		}),
	})
);

export const orderRelations = relations(orders, ({ many, one }) => ({
	user: one(users, { fields: [orders.userId], references: [users.id] }),
	address: one(addressTable, {
		fields: [orders.shippingAddress],
		references: [addressTable.id],
	}),
	items: many(orderItems),
	payment: one(payments, {
		fields: [orders.id],
		references: [payments.orderId],
	}),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
	collectionProducts: many(collectionProducts),
}));
export const collectionProductsRelations = relations(
	collectionProducts,
	({ one }) => ({
		product: one(products, {
			fields: [collectionProducts.productId],
			references: [products.id],
		}),
		collection: one(collections, {
			fields: [collectionProducts.collectionId],
			references: [collections.id],
		}),
	})
);
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id],
	}),
	variant: one(productVariants, {
		fields: [orderItems.variantId],
		references: [productVariants.id],
	}),
	size: one(productVariantPrices, {
		fields: [orderItems.sizeId],
		references: [productVariantPrices.id],
	}),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
	product: one(products, {
		fields: [reviews.productId],
		references: [products.id],
	}),
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id],
	}),
}));
export const mediasRelations = relations(medias, ({ one }) => ({
	product: one(products, {
		fields: [medias.productId],
		references: [products.id],
	}),
}));

export type Users = typeof users.$inferSelect;
export type SafeUser = Omit<Users, "passwordHash">;
export type AddressType = typeof addressTable.$inferSelect;
export type ProductType = typeof products.$inferSelect;
export type CategoryType = typeof categories.$inferSelect;
export type SubCategoryType = typeof subCategories.$inferSelect;
export type VariantType = typeof productVariants.$inferSelect;
export type PriceVariantType = typeof productVariantPrices.$inferSelect;
export type MediaType = typeof medias.$inferSelect;
export type SavedType = typeof savedProducts.$inferInsert;
export type CollectionType = typeof collections.$inferSelect;
export type ReviewType = typeof reviews.$inferSelect;
export type OrderType = typeof orders.$inferSelect;
export type OrderItemType = typeof orderItems.$inferSelect;
export type PaymentType = typeof payments.$inferSelect;
export type MediasType = typeof medias.$inferSelect;
export type CollectionProductType = typeof collectionProducts.$inferSelect;

export type CategoriesWithExtra = CategoryType & {
	subCategories: SubCategoryType[];
};
export type VariantsWithExtra = VariantType & {
	variantPrices: PriceVariantType[];
};
export type ReviewWithExtra = ReviewType & {
	user: SafeUser;
};
export type SavedWithExtra = SavedType & {
	user: SafeUser;
	product: ProductType & {
		medias: MediaType[];
	};
	variant: VariantType;
	size: PriceVariantType;
};
export type ProductWithExtra = ProductType & {
	category: CategoryType;
	subCategory: SubCategoryType;
	variants: Array<
		VariantType & {
			variantPrices: PriceVariantType[];
		}
	>;
	medias: MediaType[];
	reviews: ReviewWithExtra[];
	saved: SavedWithExtra[];
};
export type ProductWithCategory = ProductType & {
	category: CategoryType;
	subCategory: SubCategoryType;
};

export type ProductWithSaved = ProductType & {
	saved: SavedWithExtra[];
};
// export type OrderWithExtra = OrderType & {
// 	orderItems: OrderItemType[];
// };

export type OrderItemWithExtra = OrderItemType & {
	product: ProductType & {
		medias: MediaType[];
	};
	order: OrderType;
	variant: VariantType;
	size: PriceVariantType;
};

export type OrderWithExtra = OrderType & {
	user: SafeUser;
	address: AddressType;
	items: OrderItemWithExtra[];
};
export type ProductWithMedia = ProductType & {
	medias: MediaType[];
};
export type CollectionWithExtra = CollectionType & {
	collectionProducts: {
		product: ProductWithExtra;
	}[];
};
