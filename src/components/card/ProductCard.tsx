"use client";
import { ProductWithExtra } from "@/src/db/schema";
import Image from "next/image";
import Link from "next/link";
import SaveProductSection from "../SaveProductSection";
import ProductPrice from "../common/ProductPrice";
import AnimatedContent from "../ui/animated-content";
import { useState } from "react";

type Props = {
	product: ProductWithExtra;
	userId: string;
};

const ProductCard = ({ product, userId }: Props) => {
	const [imageLoading, setImageLoading] = useState(true);
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
			<div className="w-[300px] sm:w-[250px] h-full  snap-center flex-col flex items-center flex-none cursor-pointer group rounded-tl-lg rounded-xl">
				<div className="w-full h-[300px] relative overflow-hidden rounded-xl bg-slate-50 ">
					<Image
						fill
						className={`object-cover object-center size-full transition-all aspect-square group-hover:scale-105 ${
							imageLoading
								? "scale-110 blur-2xl grayscale"
								: "scale-100 blur-0 grayscale-0"
						}`}
						onLoadingComplete={() => setImageLoading(false)}
						src={src}
						alt="Listing"
					/>
					<div className="absolute right-2 top-2">
						<SaveProductSection
							productId={product.id}
							variantId={product.variants[0].id}
							sizeId={product.variants[0].variantPrices[0].id}
							initialState={{
								isSavedByUser: product.saved.some(
									(save) => save.userId === userId
								),
							}}
						/>
					</div>
				</div>
				<Link href={`/products/${product.slug}`}>
					<div className="flex flex-col space-y-1 w-full my-4">
						<h1 className="text-base line-clamp-2 capitalize text-pretty text-black font-bold group-hover:underline">
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
			</div>
		</AnimatedContent>
	);
};

export default ProductCard;
