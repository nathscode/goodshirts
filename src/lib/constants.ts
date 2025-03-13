import axios from "axios";

export const ITEM_PER_PAGE = 12;

export const colors = ["black", "gray", "white", "navy blue"];
export const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
export const addressesTypes = ["HOME", "WORK"];
export const OrderStatusTypes = [
	"PENDING",
	"PROCESSING",
	"CONFIRMED",
	"SHIPPED",
	"DELIVERED",
	"CANCELLED",
	"REFUNDED",
];

export const LOCATION_API_URL =
	"https://plum-edythe-15.tiiny.site/nigerian-state-cites.json";

export const apiLocationClient = axios.create({
	baseURL: LOCATION_API_URL,
});

const apiUrl =
	process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://africagoodshirts.ng";

export const baseURL = `${apiUrl}/api`;
