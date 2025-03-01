import React from "react";
import { cn, formatCurrency } from "@/src/lib/utils";

type PriceStyles = {
	base: string;
	discounted: string;
};

type Props = {
	price: number;
	discountPrice?: number;
	priceClassName?: string;
	discountPriceClassName?: string;
	containerClassName?: string;
};

const defaultStyles: PriceStyles = {
	base: "text-black font-semibold",
	discounted: "text-gray-500 line-through font-medium",
};

const ProductPrice = ({
	price,
	discountPrice,
	priceClassName,
	discountPriceClassName,
	containerClassName,
}: Props) => {
	const getPriceClasses = (shouldStrikeThrough: boolean) => {
		const baseClasses = shouldStrikeThrough
			? defaultStyles.discounted
			: defaultStyles.base;

		const customClasses = shouldStrikeThrough
			? discountPriceClassName
			: priceClassName;

		return cn(baseClasses, customClasses);
	};

	return (
		<div
			className={cn(
				"flex justify-start items-center space-x-3",
				containerClassName
			)}
		>
			{discountPrice && (
				<h1 className={getPriceClasses(false)}>
					{formatCurrency(discountPrice)}
				</h1>
			)}
			<h1 className={getPriceClasses(true)}>{formatCurrency(price)}</h1>
		</div>
	);
};

export default ProductPrice;
