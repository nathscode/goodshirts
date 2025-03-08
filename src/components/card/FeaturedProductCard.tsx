"use client";
import { ProductWithExtra } from "@/src/db/schema";
import { calculateDiscountPercentage } from "@/src/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AnimatedContent from "../ui/animated-content";

type Props = {
	product: ProductWithExtra;
};

const FeaturedProductCard = ({ product }: Props) => {
	const src = product.medias
		? product.medias[0].url
		: "/images/placeholder-image.png";

	const discountPercentage = calculateDiscountPercentage(
		Number(product.variants[0].variantPrices[0].price),
		Number(product.variants[0].variantPrices[0].discountPrice)
	);
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
			<div className="relative flex w-[300px] sm:w-[250px] h-full  max-w-xs flex-col overflow-hidden  bg-white group">
				<Link
					className="relative  flex h-[300px] rounded-lg overflow-hidden"
					href={`products/${product.slug}`}
				>
					<div className="w-full relative overflow-hidden bg-slate-50 ">
						<Image
							fill
							className="object-cover object-center size-full transition-all aspect-square group-hover:scale-105"
							src={src}
							alt="Listing"
						/>
						<div className="absolute inset-0 size-full bg-black/50">
							{discountPercentage && discountPercentage > 0 ? (
								<span className="absolute top-0 left-0 m-2 rounded-full bg-slate-50 px-2  py-0.5 text-center text-sm font-bold text-black">
									{`${discountPercentage}%`} OFF
								</span>
							) : null}
							<div className="bottom-0 flex flex-col justify-end h-full p-5 z-10">
								<h5 className="text-base line-clamp-2 font-semibold capitalize tracking-tight text-white">
									{product.name}
								</h5>
								<div className="flex flex-col w-fit mt-4">
									<Link
										href={`products/${product.slug}`}
										className="flex items-center justify-center space-x-1 rounded-md border px-5 py-2.5 text-center text-xs font-semibold text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
									>
										<span>Buy Now</span>
										<ArrowRight className="size-4" />
									</Link>
								</div>
							</div>
						</div>
					</div>
				</Link>
			</div>
		</AnimatedContent>
	);
};

export default FeaturedProductCard;
