import { formatCurrency } from "@/lib/utils";
import React from "react";

type Props = {
	price: number;
	discountPrice?: number;
};

const ProductPrice = ({ price, discountPrice }: Props) => {
	return (
		<div className="flex justify-start items-center space-x-3 my-4">
			{discountPrice && (
				<h1 className="text-lg sm:text-xl  font-semibold">
					{formatCurrency(discountPrice)}
				</h1>
			)}
			<h1
				className={`   ${
					discountPrice
						? "text-gray-500 line-through text-sm sm:text-lg font-medium "
						: "text-black font-semibold text-lg sm:text-xl"
				}`}
			>
				{formatCurrency(price)}
			</h1>
		</div>
	);
};

export default ProductPrice;
