export type ProductTypes = {
	id: number;
	name: string;
	slug: string;
	price: number;
	src: string;
	description: string;
	collection: string;
	category: string;
};

export type CartProduct = {
	id: string;
	name: string;
	price: number;
	image?: string;
	productId?: string;
	newId?: string;
	quantity?: number;
};
export type BreadcrumbTypes = {
	name: string;
	href?: string;
	hasLink?: boolean;
};

export type statusType =
	| "CANCELLED"
	| "CONFIRM"
	| "DELIVERED"
	| "SHIPPING"
	| "PROCESSING"
	| "PENDING";
