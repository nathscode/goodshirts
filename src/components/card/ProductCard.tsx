"use client";
import { ProductWithExtra } from "@/src/db/schema";
import { formatCurrency } from "@/src/lib/utils";
import Image from "next/image";
import Link from "next/link";
import AnimatedContent from "../ui/animated-content";
import ProductPrice from "../common/ProductPrice";

type Props = {
	product: ProductWithExtra;
};

const ProductCard = ({ product }: Props) => {
	const src = product.medias
		? product.medias[0].url
		: "/images/placeholder-image.png";
	return (
		<AnimatedContent
			distance={150}
			direction="vertical"
			reverse={false}
			config={{ tension: 80, friction: 20 }}
			initialOpacity={0.2}
			animateOpacity
			scale={1.1}
			threshold={0.2}
		>
			<Link
				href={`/products/${product.slug}`}
				className="w-[300px] sm:w-[250px] h-full  snap-center flex-col flex items-center flex-none cursor-pointer group rounded-tl-lg rounded-xl "
			>
				<div className="w-full h-[300px] relative overflow-hidden rounded-xl bg-slate-50 ">
					<Image
						fill
						className="object-cover object-center size-full transition-all aspect-square group-hover:scale-105"
						src={src}
						alt="Listing"
					/>
				</div>

				<div className="flex flex-col space-y-1 w-full my-4">
					<h1 className="text-base line-clamp-2 capitalize text-pretty text-black font-bold">
						{product.name}
					</h1>
					<p className="text-sm text-pretty text-gray-600 line-clamp-1">
						{product.description}
					</p>
					<ProductPrice
						price={Number(product.variants[0].variantPrices[0].price)}
						discountPrice={Number(
							product.variants[0].variantPrices[0].discountPrice
						)}
						priceClassName="font-bold"
						containerClassName="font-bold"
					/>
				</div>
			</Link>
		</AnimatedContent>
	);
};

export default ProductCard;
