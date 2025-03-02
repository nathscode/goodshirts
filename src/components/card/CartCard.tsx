"use client";
import { PriceVariantType, VariantType } from "@/src/db/schema";
import useCartStore from "@/src/hooks/use-cart";
import { formatCurrency } from "@/src/lib/utils";
import { CartProduct } from "@/src/types";
import { Minus, Plus, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
import SaveProductSection from "../SaveProductSection";
import { ChangeEvent, useState } from "react";

type Props = {
	item: CartProduct;
	variant: VariantType;
	size: PriceVariantType;
	quantity: number;
};

const CartCard = ({ item, variant, size, quantity }: Props) => {
	const { data: session } = useSession();
	const [newQuantity, setNewQuantity] = useState<number>(quantity);

	const cart = useCartStore();

	const updateCartQuantity = (newQuantity: number) => {
		if (newQuantity < 1) return;
		setNewQuantity(newQuantity);
		if (variant.id && size.id) {
			cart.updateQuantity(item.id, variant.id, size.id, newQuantity);
		}
	};
	const removeItemFromCart = (
		item: CartProduct,
		variant: VariantType,
		size: PriceVariantType
	) => {
		cart.removeItem(item.id, variant.id, size.id);
		toast.success("Item removed from cart!");
	};

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

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-row mb-2 min-h-[100px] p-2 rounded-lg">
				<div className="relative shrink-0 w-[70px] sm:w-[100px] h-[100px] overflow-hidden bg-slate-300 rounded-md">
					<Image
						className="object-cover w-full h-full rounded-md"
						src={item.media[0].url ?? "/images/placeholder-image.png"}
						alt={"food"}
						fill
					/>
				</div>
				<div className="flex flex-col ml-5 w-full">
					<div className="flex flex-col justify-start w-full">
						<h4 className="text-sm font-bold capitalize">{item.name}</h4>
					</div>
					<h4 className="font-bold text-sm mt-1">
						{size.discountPrice
							? formatCurrency(size.discountPrice)
							: formatCurrency(size.price)}{" "}
					</h4>
					<div className="flex justify-start items-center space-x-4 text-gray-500">
						<span>
							Size: <small className="uppercase">{size.size}</small>
						</span>
						<span>
							Color: <small className="uppercase">{variant.color}</small>
						</span>
					</div>
					<div className="flex flex-col text-gray-500">
						<span>
							Qty: <small className="uppercase">{quantity}</small>
						</span>
					</div>
					<div className="flex flex-wrap gap-3 justify-between w-full mt-4">
						<div className="flex space-x-4 justify-start">
							<button
								onClick={() => removeItemFromCart(item, variant, size)}
								className="flex flex-col items-center justify-center h-8 w-8 bg-slate-100 rounded-full hover:cursor-pointer hover:text-red-800"
							>
								<Trash className="h-4 w-4" />
							</button>
							<SaveProductSection
								productId={item.id}
								variantId={item.variants[0].id}
								sizeId={item.variants[0].variantPrices[0].id}
								initialState={{
									isSavedByUser: item.saved.some(
										(save) => save.userId === session?.user.id
									),
								}}
							/>
						</div>
						<div className="justify-end">
							<form className="max-w-xs mx-auto">
								<div className="relative flex items-center max-w-[8rem]">
									<button
										onClick={decreaseQuantity}
										type="button"
										data-input-counter-decrement="quantity-input"
										className="bg-gray-100  hover:bg-gray-200 border border-gray-300 p-2 rounded-full h-8 w-8 focus:ring-gray-100  focus:ring-2 focus:outline-none"
									>
										<Minus className="h-4 w-4" />
									</button>
									<input
										onChange={handleQuantityChange}
										type="text"
										className="bg-gray-50 border-x-0 border-gray-300 h-8 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 "
										placeholder="1"
										value={newQuantity}
									/>
									<button
										onClick={increaseQuantity}
										type="button"
										data-input-counter-increment="quantity-input"
										className="bg-gray-100  hover:bg-gray-200 border border-gray-300 p-2 rounded-full h-8 w-8 focus:ring-gray-100  focus:ring-2 focus:outline-none"
									>
										<Plus className="h-4 w-4" />
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartCard;
