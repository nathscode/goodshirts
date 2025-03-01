import { PriceVariantType, VariantType } from "@/src/db/schema";
import { formatCurrency } from "@/src/lib/utils";
import { CartProduct } from "@/src/types";
import Image from "next/image";
import React from "react";

type Props = {
	item: CartProduct;
	variant: VariantType;
	size: PriceVariantType;
	quantity: number;
};
const ReviewCartCard = ({ item, variant, size, quantity }: Props) => {
	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-row mb-2 min-h-[100px] p-2 rounded-lg">
				<div className="relative shrink-0 w-[50px] sm:w-[80px] h-[80px] overflow-hidden bg-slate-300 rounded-md">
					<Image
						className="object-cover w-full h-full rounded-md"
						src={item.media[0].url ?? "/images/placeholder-image.png"}
						alt={"food"}
						fill
					/>
				</div>
				<div className="flex flex-col ml-5 w-full">
					<div className="flex flex-col justify-start w-full">
						<h4 className="text-xs font-bold capitalize">{item.name}</h4>
					</div>

					<div className="flex justify-start items-center space-x-4 text-sm text-gray-500">
						<span>
							Size: <small className="uppercase">{size.size}</small>
						</span>
						<span>
							Color: <small className="uppercase">{variant.color}</small>
						</span>
					</div>
					<div className="flex flex-col text-gray-500 text-sm">
						<span>
							Qty: <small className="uppercase">{quantity}</small>
						</span>
					</div>
					<h4 className="font-bold text-xs mt-1">
						{size.discountPrice
							? formatCurrency(size.discountPrice)
							: formatCurrency(size.price)}{" "}
					</h4>
				</div>
			</div>
		</div>
	);
};

export default ReviewCartCard;
