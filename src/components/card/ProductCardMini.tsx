"use client";
import { ProductWithExtra } from "@/src/db/schema";
import { calculateDiscountPercentage } from "@/src/lib/utils";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "../common/ProductPrice";
import StarRating from "../common/StarRating";

type Props = {
	product: ProductWithExtra;
};

const ProductCardMini = ({ product }: Props) => {
	const src = product.medias
		? product.medias[0].url
		: "/images/placeholder-image.png";

	const discountPercentage = calculateDiscountPercentage(
		Number(product.variants[0].variantPrices[0].price),
		Number(product.variants[0].variantPrices[0].discountPrice)
	);
	return (
		<div className="relative flex w-[250px]  max-w-xs flex-col overflow-hidden  bg-white">
			<Link
				className="relative  flex h-60 overflow-hidden rounded-xl"
				href={`products/${product.slug}`}
			>
				<div className="w-full relative overflow-hidden rounded-xl bg-slate-50 ">
					<Image
						fill
						className="object-cover object-center size-full transition-all aspect-square group-hover:scale-105"
						src={src}
						alt="Listing"
					/>
				</div>
				{discountPercentage && discountPercentage > 0 ? (
					<span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
						{`${discountPercentage}%`} OFF
					</span>
				) : null}
			</Link>
			<div className="mt-4 pb-5">
				<Link href={`products/${product.slug}`}>
					<h5 className="text-base line-clamp-2 capitalize tracking-tight text-slate-900">
						{product.name}
					</h5>
					<p className="text-sm text-pretty text-gray-600 line-clamp-1">
						{product.description}
					</p>
				</Link>
				<div className="flex items-center">
					<span className="mr-2 text-xs font-semibold">5.0</span>
					<StarRating numberOfStars={4} />
				</div>
				<div className="mt-2 mb-5 flex items-center justify-between">
					<ProductPrice
						price={Number(product.variants[0].variantPrices[0].price)}
						discountPrice={Number(
							product.variants[0].variantPrices[0].discountPrice
						)}
						priceClassName="text-gray-500 font-normal"
					/>
				</div>
				<Link
					href={`products/${product.slug}`}
					className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
				>
					Select Option
				</Link>
			</div>
		</div>
	);
};

export default ProductCardMini;
