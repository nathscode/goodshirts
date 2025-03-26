import { clsx, type ClassValue } from "clsx";
import Compressor from "compressorjs";
import crypto from "crypto";
import { format, parseISO } from "date-fns";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";
import { ReviewType } from "../db/schema";
import { SKUGenerator } from "./backend/generate-sku";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function formatDate(dateString: string): string {
	const date = parseISO(dateString);
	return format(date, "dd/MM/yyyy");
}

export const formatDateTime = (date: Date | string | number): string => {
	const parsedDate =
		typeof date === "string" || typeof date === "number"
			? new Date(date)
			: date;
	return format(parsedDate, "MMM dd, yyyy hh:mm a");
};
export function formatDayDate(dateString: string): string {
	const date = parseISO(dateString);
	return format(date, "EEEE, dd-MM-yyyy");
}
export function formatCurrency(
	price: number | string,
	country?: string,
	currencyCode?: string,
	options: {
		currency?: "NGN" | "USD" | "EUR" | "GBP" | "BDT";
		notation?: Intl.NumberFormatOptions["notation"];
	} = {}
) {
	const {
		currency = currencyCode ? currencyCode : "NGN",
		notation = "standard",
	} = options;
	const newCountry = country ? country : "en-NG";
	const numericPrice =
		typeof price === "string" ? parseFloat(price) : Number(price);
	return new Intl.NumberFormat(newCountry, {
		style: "currency",
		currency,
		notation,
		maximumFractionDigits: 2,
	}).format(numericPrice);
}

export function constructMetadata({
	title = "AfricaGoodShirts - Where luxury speaks",
	description = "AfricaGoodShirts get affordable luxury men clothings",
	image = "/images/summary_logo.jpg",
	noIndex = false,
}: {
	title?: string;
	description?: string;
	image?: string;
	noIndex?: boolean;
} = {}): Metadata {
	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: [
				{
					url: image,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [image],
			creator: "@nathscode",
		},
		metadataBase: new URL("https://africagoodshirts.ng"),
		...(noIndex && {
			robots: {
				index: false,
				follow: false,
			},
		}),
	};
}

export function abbreviateMetrics(num: number): string | number {
	const lookup = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: "k" },
		{ value: 1e6, symbol: "M" },
		{ value: 1e9, symbol: "B" },
		{ value: 1e12, symbol: "T" },
		{ value: 1e15, symbol: "P" },
		{ value: 1e18, symbol: "E" },
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	const item = lookup
		.slice()
		.reverse()
		.find((item) => {
			return num >= item.value;
		});
	return item
		? (num / item.value).toFixed(2).replace(rx, "$1") + item.symbol
		: "0";
}

export function formatNumberWithCommas(num: number): string {
	return num.toLocaleString("en-US");
}
export function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

export function trimAndLowercase(inputString: string): string {
	return inputString.trim().toLowerCase();
}
export function trimAndUppercase(inputString: string): string {
	return inputString.trim().toUpperCase();
}
export function toTitleCase(inputString: string): string {
	return inputString
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function handlerNativeResponse(data: any, status: number) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

export function isCustomError(error: any): error is CustomError {
	return (error as CustomError).code !== undefined;
}

export class CustomError extends Error {
	constructor(
		public code: number,
		message: string
	) {
		super(message);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, CustomError);
		}
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export function generateRandomString(): string {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	const length = 5;

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}

	return result;
}

export function getRandomNumber(min: number, max: number): string {
	return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

export function generateRandomNumbers(count: number): string {
	let numbers: string[] = [];
	for (let i = 0; i < count; i++) {
		let randomNumber = Math.floor(Math.random() * (9 - 0) + 0);
		numbers.push(randomNumber.toString());
	}
	return numbers.join("");
}
export const roundNumber = (num: number) =>
	Math.round((num + Number.EPSILON) * 100) / 100;

export function deepClone(obj: any) {
	if (obj === null || typeof obj !== "object") {
		return obj;
	}

	// Create a new object with the same prototype as the original object
	const clone = Object.create(Object.getPrototypeOf(obj));

	// Copy all enumerable properties from the original object to the clone
	for (const key of Object.keys(obj)) {
		clone[key] = deepClone(obj[key]);
	}

	return clone;
}
export const compressImage = async (file: File): Promise<File> => {
	return new Promise((resolve, reject) => {
		new Compressor(file, {
			quality: 0.6,
			success(compressedBlob) {
				const compressedFile = new File([compressedBlob], file.name, {
					type: file.type,
				});
				resolve(compressedFile);
			},
			error(error) {
				reject(error);
			},
		});
	});
};

export function calculateAverageRating(reviews: ReviewType[]): number | null {
	if (!reviews?.length) {
		return 0;
	}

	const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
	return sum / reviews.length;
}

export function getInitials(fullName: string): string {
	return fullName
		.trim()
		.split(" ")
		.filter((word) => word.length > 0)
		.map((word) => word[0].toUpperCase())
		.join("");
}

export function generateCryptoString(length: number): string {
	const timestamp = Date.now().toString();
	const randomBytes = crypto.randomBytes(16).toString("hex");
	const combinedString = `${timestamp}-${randomBytes}`;
	return crypto
		.createHash("sha256")
		.update(combinedString)
		.digest("hex")
		.slice(0, length);
}
export function calculateDiscountPercentage(
	price: number,
	discountPrice: number
): number {
	// Ensure the price is greater than 0 to avoid division by zero
	if (price <= 0) {
		throw new Error("Price must be greater than 0.");
	}

	// Ensure the discount price is less than or equal to the price
	if (discountPrice > price) {
		throw new Error(
			"Discount price cannot be greater than the original price."
		);
	}

	// Calculate the discount percentage
	const discountPercentage = ((price - discountPrice) / price) * 100;

	// Round to the nearest whole number
	return Math.round(discountPercentage);
}

export const getExpirationStatus = (endDate: string | Date): string => {
	const today = new Date();
	const end = new Date(endDate);

	today.setHours(0, 0, 0, 0);
	end.setHours(0, 0, 0, 0);

	const diffInTime = end.getTime() - today.getTime();
	const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

	if (diffInDays < 0) return "Expired";
	if (diffInDays === 0) return "Expiring today";
	if (diffInDays === 2 || diffInDays === 3)
		return `${diffInDays} days remaining`;

	return "";
};
