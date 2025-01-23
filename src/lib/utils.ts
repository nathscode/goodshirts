import { clsx, type ClassValue } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
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
	image = "/images/summary_logo.png",
	icons = "/src/app/favicon.ico",
	noIndex = false,
}: {
	title?: string;
	description?: string;
	image?: string;
	icons?: string;
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
		icons,
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
