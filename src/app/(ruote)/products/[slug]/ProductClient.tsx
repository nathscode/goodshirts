"use client";
import DetailProductImage from "@/src/components/DetailProductImage";
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
} from "@headlessui/react";

import { Button } from "@/src/components/ui/button";
import {
	PriceVariantType,
	ProductWithExtra,
	VariantType,
} from "@/src/db/schema";
import { abbreviateMetrics, calculateAverageRating } from "@/src/lib/utils";
import { ChevronDownIcon, Minus, Plus, Star } from "lucide-react";
import ProductVariants from "./ProductVariants";
import RecommendedProduct from "./RecommendedProduct";
import ReviewSection from "./ReviewSection";
import { ChangeEvent, useState } from "react";
import useCartStore from "@/src/hooks/use-cart";
import { CartProduct } from "@/src/types";
import { toast } from "sonner";
import SaveProductSection from "@/src/components/SaveProductSection";
import { useSession } from "next-auth/react";

type Props = {
	product: ProductWithExtra;
};

const ProductClient = ({ product }: Props) => {
	const { data: session } = useSession();
	const [quantity, setQuantity] = useState<number>(1);
	const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
	const [selectedSize, setSelectedSize] = useState(
		product.variants[0]?.variantPrices[0]
	);
	const cart = useCartStore();
	const handleVariantChange = (
		variant: VariantType & { variantPrices: PriceVariantType[] }
	) => {
		setSelectedVariant(variant);
	};

	// Handler for size change
	const handleSizeChange = (size: PriceVariantType) => {
		setSelectedSize(size);
	};
	const updateCartQuantity = (newQuantity: number) => {
		if (newQuantity < 1) return; // Prevent setting quantity below 1
		setQuantity(newQuantity);
		if (selectedVariant && selectedSize) {
			cart.updateQuantity(
				product.id,
				selectedVariant.id,
				selectedSize.id,
				newQuantity
			);
		}
	};

	// Function for manual input update
	const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		if (!isNaN(value)) {
			updateCartQuantity(value);
		}
	};

	// Decrease quantity button
	const decreaseQuantity = () => {
		if (quantity > 1) {
			updateCartQuantity(quantity - 1);
		}
	};

	// Increase quantity button
	const increaseQuantity = () => {
		updateCartQuantity(quantity + 1);
	};

	const addItemToCart = () => {
		if (!selectedVariant || !selectedSize) {
			return toast.error("Please select a variant and size.");
		}
		cart.addItem(product, selectedVariant, selectedSize, quantity);
		toast.success("Cart updated successfully!");
	};

	return (
		<>
			<div className="flex flex-wrap justify-center md:justify-start w-full">
				<div className="w-full sm:w-1/2 md:px-3">
					<DetailProductImage
						image={product.medias[0]?.url}
						alt={product.name}
					/>
				</div>
				<div className="w-full sm:w-1/2 sm:px-3 mt-8 sm:mt-0">
					<div className="flex flex-col w-full relative">
						<div className="flex justify-between">
							<h1 className="text-xl sm:text-2xl capitalize font-semibold max-w-md pr-5">
								{product.name}
							</h1>
							<SaveProductSection
								productId={product.id}
								variantId={product.variants[0].id}
								sizeId={product.variants[0].variantPrices[0].id}
								initialState={{
									isSavedByUser: product.saved.some(
										(save) => save.userId === session?.user.id
									),
								}}
							/>
						</div>
						<ul className="flex flex-wrap justify-start items-center gap-4 my-3 w-full">
							<li className="inline-flex space-x-2 items-center">
								<Star className="size-4 fill-black" />
								<span className="text-sm font-semibold">{`(${calculateAverageRating(product.reviews)})`}</span>
							</li>
							<span className="text-gray-300">|</span>
							<li className="inline-flex space-x-2 items-center">
								<span className="text-sm font-semibold">
									({`${abbreviateMetrics(product.reviews.length)}`})
								</span>
								<span className="text-sm font-semibold">Reviews</span>
							</li>
							<span className="text-gray-300">|</span>
							{Number(product.totalSales!) > 0 && (
								<li className="inline-flex space-x-2 items-center">
									<span className=" text-sm font-semibold">
										{abbreviateMetrics(Number(product.totalSales || 0))}
									</span>
									<span className="text-sm font-semibold whitespace-nowrap">
										Sold Out
									</span>
								</li>
							)}
						</ul>

						<div className="flex flex-col justify-start items-start space-y-4 w-full">
							<ProductVariants
								product={product}
								selectedVariant={selectedVariant}
								selectedSize={selectedSize}
								onVariantChange={handleVariantChange}
								onSizeChange={handleSizeChange}
							/>
							<div className="flex flex-col">
								<label htmlFor="quantity" className="mb-2 font-semibold">
									Quantity
								</label>
								<form className="max-w-xs mx-auto">
									<div className="relative flex items-center max-w-[8rem] border rounded-full p-2">
										<button
											type="button"
											onClick={decreaseQuantity}
											className="bg-gray-100 hover:bg-gray-200 border border-gray-300 p-2 rounded-full h-8 w-8 focus:ring-gray-100 focus:ring-2 focus:outline-none"
										>
											<Minus className="h-4 w-4" />
										</button>
										<input
											type="text"
											className="bg-gray-50 border-x-0 border-gray-300 h-8 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5"
											value={quantity}
											onChange={handleQuantityChange}
										/>
										<button
											type="button"
											onClick={increaseQuantity}
											className="bg-gray-100 hover:bg-gray-200 border border-gray-300 p-2 rounded-full h-8 w-8 focus:ring-gray-100 focus:ring-2 focus:outline-none"
										>
											<Plus className="h-4 w-4" />
										</button>
									</div>
								</form>
							</div>
							<div className="flex flex-col w-full pt-5">
								<Button
									onClick={() => addItemToCart()}
									className="rounded-full h-12 font-semibold text-base"
								>
									Add to cart
								</Button>
							</div>
						</div>
						<div className="flex flex-col w-full my-5">
							<div className="mx-auto w-full max-w-lg divide-y divide-black/5 rounded-xl">
								<Disclosure as="div" className="" defaultOpen={false}>
									<DisclosureButton className="group flex w-full items-center justify-between py-4 border-b-2  border-black">
										<span className="text-lg font-semibold text-black group-data-[hover]:text-black/80">
											Description
										</span>
										<ChevronDownIcon className="size-5 text-black group-data-[hover]:text-black group-data-[open]:rotate-180" />
									</DisclosureButton>
									<DisclosurePanel className="mt-2 text-sm/5 text-black/50">
										{product.description}
									</DisclosurePanel>
								</Disclosure>
								<Disclosure as="div" className="" defaultOpen={false}>
									<DisclosureButton className="group flex w-full items-center justify-between py-4 border-b-2  border-black">
										<span className="text-lg font-semibold text-black group-data-[hover]:text-black/80">
											Shipping information
										</span>
										<ChevronDownIcon className="size-5 text-black group-data-[hover]:text-black group-data-[open]:rotate-180" />
									</DisclosureButton>
									<DisclosurePanel className="mt-2 text-sm/5 text-black/50">
										Processes in 24-72 Hours, shipping times may vary
									</DisclosurePanel>
								</Disclosure>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col justify-center text-center w-full mt-10">
				<h1 className="text-xl sm:text-3xl capitalize font-dela font-semibold mb-5">
					why choose us?
				</h1>
				<div className="flex flex-wrap justify-center w-full my-5">
					<div className="w-full sm:w-1/3 md:px-3 mb-10 sm:mb-0">
						<div className="flex flex-col justify-center items-center text-center">
							<div className="flex flex-col justify-center items-center h-24 w-24 rounded-full text-white bg-black">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									stroke="currentColor"
									strokeWidth="3"
									viewBox="0 0 64 64"
									className="size-14 text-white"
								>
									<path d="m45.41 11.16.86 2.61a3.75 3.75 0 0 0 1.5 2L50 17.21a3.85 3.85 0 0 1 1.43 4.62l-.84 2.09a3.83 3.83 0 0 0 0 2.88l.83 2a3.83 3.83 0 0 1-1.32 4.58l-1.97 1.42a3.86 3.86 0 0 0-1.46 2.08L46 39.32a3.84 3.84 0 0 1-4 2.78l-2.1-.18a3.88 3.88 0 0 0-2.74.84l-2 1.63a3.83 3.83 0 0 1-4.85 0L28.54 43a3.85 3.85 0 0 0-2.45-.88H23a3.83 3.83 0 0 1-3.74-3l-.55-2.35a3.82 3.82 0 0 0-1.58-2.31l-1.83-1.27a3.84 3.84 0 0 1-1.45-4.48l.86-2.36a3.86 3.86 0 0 0 0-2.66l-.77-2.06a3.86 3.86 0 0 1 1.51-4.58l2-1.31a3.87 3.87 0 0 0 1.61-2.19l.61-2.18a3.85 3.85 0 0 1 4-2.79l1.93.17a3.88 3.88 0 0 0 2.74-.84l1.83-1.48a3.84 3.84 0 0 1 4.87 0l1.66 1.38a3.82 3.82 0 0 0 2.75.88l2-.15a3.84 3.84 0 0 1 3.96 2.62Z" />
									<path
										strokeLinecap="round"
										d="m44.59 41.57 7 12.21c.18.31 0 .64-.23.55l-8.61-3.5a.24.24 0 0 0-.31.19l-1.06 9c-.06.29-.42.25-.6-.06l-8.13-14.71M32.65 45.25 25.14 60c-.19.31-.53.35-.6.07l-1.27-9.2a.24.24 0 0 0-.31-.18l-8.37 3.61c-.28.08-.43-.24-.24-.56l7-12.17M32.74 16.89l2.7 5.49a.1.1 0 0 0 .08.05l6 .88c.08 0 .12.12.06.17l-4.38 4.27a.09.09 0 0 0 0 .09l1 6a.1.1 0 0 1-.14.11l-5.42-2.85a.07.07 0 0 0-.09 0L27.19 34a.11.11 0 0 1-.15-.11l1-6a.1.1 0 0 0 0-.09l-4.39-4.27a.11.11 0 0 1 .06-.17l6.05-.88a.09.09 0 0 0 .08-.05l2.71-5.49a.1.1 0 0 1 .19-.05Z"
									/>
								</svg>
							</div>
							<h2 className="text-xl sm:text-2xl font-semibold mt-4">
								100% Guaranty
							</h2>
						</div>
					</div>
					<div className="w-full sm:w-1/3 md:px-3 mb-10 sm:mb-0">
						<div className="flex flex-col justify-center items-center text-center">
							<div className="flex flex-col justify-center items-center h-24 w-24 rounded-full text-white bg-black">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									stroke="currentColor"
									strokeWidth="3"
									viewBox="0 0 64 64"
									className="size-14 text-white"
								>
									<path d="M21.68 42.22h15.49a1.68 1.68 0 0 0 1.68-1.68l5.85-21.42a1.68 1.68 0 0 0-1.7-1.68H17.61a1.69 1.69 0 0 0-1.69 1.68l-5 21.42a1.68 1.68 0 0 0 1.68 1.68h2.18" />
									<path d="M41.66 42.22h-3.47l5-17.29h8.22a.85.85 0 0 1 .65.3l3.58 6.3a.81.81 0 0 1 .2.53l-3.33 10.16h-3.6" />
									<ellipse cx="18.31" cy="43.31" rx="3.71" ry="3.76" />
									<ellipse cx="45.35" cy="43.31" rx="3.71" ry="3.76" />
									<path
										strokeLinecap="round"
										d="M23.25 22.36H6.87M20.02 27.6H8.45M21.19 33.5H3.21"
									/>
								</svg>
							</div>
							<h2 className="text-xl sm:text-2xl font-semibold mt-4">
								Nationwide Delivery
							</h2>
						</div>
					</div>
					<div className="w-full sm:w-1/3 md:px-3 mb-10 sm:mb-0">
						<div className="flex flex-col justify-center items-center text-center">
							<div className="flex flex-col justify-center items-center h-24 w-24 rounded-full bg-black">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									className="size-14 text-gray-200"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1.5"
										d="M12 8v4l2.5 2.5"
									/>
									<path
										fill="currentColor"
										d="m5.60414 5.60414-.53033-.53033.53033.53033ZM4.33776 6.87052l-.74999.00377c.00207.41127.33495.74415.74622.74622l.00377-.74999Zm2.54178.76278c.41421.00209.75168-.33201.75376-.74622.00208-.41421-.33201-.75168-.74622-.75376L6.87954 7.6333ZM5.07496 4.3212c-.00208-.41421-.33955-.7483-.75376-.74622-.41421.00208-.7483.33955-.74622.75376l1.49998-.00754Zm-1.24835 6.4637c.05625-.4104-.23083-.78863-.64121-.84488-.41037-.05625-.78865.23078-.8449.64118l1.48611.2037ZM18.8622 5.13777C15.042 1.31758 8.86873 1.27889 5.07381 5.07381l1.06066 1.06066c3.19911-3.19911 8.42263-3.18052 11.66713.06396l1.0606-1.06066ZM5.13777 18.8622c3.82019 3.8202 9.99353 3.8589 13.78843.064l-1.0607-1.0607c-3.1991 3.1991-8.42259 3.1806-11.66707-.0639l-1.06066 1.0606Zm13.78843.064c3.7949-3.7949 3.7562-9.96824-.064-13.78843l-1.0606 1.06066c3.2445 3.24448 3.263 8.46797.0639 11.66707l1.0607 1.0607ZM5.07381 5.07381 3.80743 6.34019l1.06066 1.06066 1.26638-1.26638-1.06066-1.06066Zm-.73982 2.5467 2.54555.01279.00754-1.49998-2.54555-.01279-.00754 1.49998Zm.75376-.75376L5.07496 4.3212l-1.49998.00754.01279 2.54555 1.49998-.00754ZM2.3405 10.5812c-.40143 2.9287.53342 6.0172 2.79727 8.281l1.06066-1.0606c-1.92058-1.9206-2.7118-4.5364-2.37182-7.0167l-1.48611-.2037Z"
									/>
								</svg>
							</div>
							<h2 className="text-xl sm:text-2xl font-semibold mt-4">
								Refund Policy
							</h2>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col justify-center items-center w-full mt-10">
				<h1 className="text-xl sm:text-3xl capitalize font-dela font-semibold mb-5">
					You may also like
				</h1>
				<RecommendedProduct
					categoryId={product.subCategory.id}
					productId={product.id}
				/>
			</div>
			<div className="flex flex-col justify-start w-full border p-4">
				<h1 className="text-xl sm:text-3xl capitalize font-dela font-semibold mb-5">
					Customer Reviews
				</h1>
				<ReviewSection reviews={product.reviews} />
			</div>
		</>
	);
};

export default ProductClient;
