import {
	MediaType,
	PriceVariantType,
	ProductType,
	ProductWithSaved,
	SavedType,
	SavedWithExtra,
	VariantType,
} from "../db/schema";

// Define ISODateString as a type alias for string
type ISODateString = string;

export const OrderStatus: { id: number; text: string }[] = [
	{ id: 1, text: "pending" },
	{ id: 2, text: "processing" },
	{ id: 3, text: "confirmed" },
	{ id: 4, text: "shipped" },
	{ id: 5, text: "delivered" },
];

export type CustomUser = {
	id?: string;
	firstName?: string | null;
	lastName?: string | null;
	type: "ADMIN" | "EMPLOYEE" | "SALES" | "CUSTOMER";
	isAdmin: boolean;
	email?: string | null;
	phone?: string | null;
	image?: string | null;
};

export type CustomSession = {
	user?: CustomUser;
	expires: ISODateString;
};

export type UserResponse = {
	id: string;
	email: string;
	firstName: string;
	lastName?: string;
	isAdmin: boolean;
};

export interface LGA {
	name: string;
}

export interface StateData {
	code: string;
	name: string;
	lgas: string[];
	cities: string[];
}

export interface LocationState<T> {
	state: "idle" | "loading" | "success" | "error";
	data?: T;
	error?: string;
}
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

export interface ActionResponse<T = any> {
	message?: string;
	status: "success" | "error";
	data?: T;
}
export interface SavedInfo {
	isSavedByUser: boolean;
}

export type CartProduct = ProductWithSaved & {
	variants: Array<
		VariantType & {
			variantPrices: PriceVariantType[];
		}
	>;
	media: MediaType[];
	saved: SavedWithExtra[];
};

export type BreadcrumbTypes = {
	name: string;
	href?: string;
	hasLink?: boolean;
};

export interface SidebarItemProps {
	icon: React.JSX.Element;
	label: string;
	active: boolean;
	href: string;
	notification?: number;
}

export type statusType =
	| "CANCELLED"
	| "CONFIRM"
	| "DELIVERED"
	| "SHIPPING"
	| "PROCESSING"
	| "PENDING";

export type UserType = "ADMIN" | "EMPLOYEE" | "CUSTOMER" | "SALES";
