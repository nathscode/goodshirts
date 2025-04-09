"use client";

import PaymentTypeSection from "@/src/components/PaymentTypeSection";
import ShippingAddress from "@/src/components/ShippingAddress";
import ShippingSection from "@/src/components/ShippingSection";
import ReviewCartCard from "@/src/components/card/ReviewCartCard";
import { Button } from "@/src/components/ui/button";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { AddressType } from "@/src/db/schema";
import useCartStore from "@/src/hooks/use-cart";
import { formatCurrency, roundNumber } from "@/src/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
	addresses: AddressType[];
};

const CheckoutClient = ({ addresses }: Props) => {
	const {
		cartItems,
		total,
		totalPrice,
		shippingFee,
		paymentType,
		selectedAddress,
	} = useCartStore();
	const router = useRouter();

	useEffect(() => {
		if (!cartItems || cartItems.length === 0) {
			router.replace("/products");
		}
	}, [cartItems, router]);

	let subTotal = roundNumber(total);
	let grandTotal = roundNumber(totalPrice);

	const handlePayNow = () => {
		// if (!shippingFee) {
		// 	toast.error("Select a Shipping fee");
		// 	return;
		// }
		if (!paymentType) {
			toast.error("Select a payment option");
			return;
		}
		if (!selectedAddress) {
			toast.error("Select a delivery address ");
			return;
		}

		router.push("/checkout/pay");
	};

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-wrap justify-between w-full mt-4">
				<div className="w-full md:w-1/2 px-2">
					{/* <ShippingSection /> */}
					<PaymentTypeSection />
					<ShippingAddress addresses={addresses} />
				</div>
				<div className="w-full md:w-1/2 px-2">
					<div className="flex flex-col h-full w-full relative">
						<h2 className="text-lg font-bold">Review your Cart</h2>
						<div className="flex flex-col w-full my-2">
							<ScrollArea className="max-h-[250px] overflow-y-auto">
								{cartItems.map((cartItem, index) => (
									<ReviewCartCard
										key={index}
										item={cartItem.item}
										variant={cartItem.variant}
										size={cartItem.size}
										quantity={cartItem.quantity}
									/>
								))}
							</ScrollArea>
						</div>
						{/* Bottom Fixed Section */}
						<div className="sticky bottom-0 bg-white shadow-lg border-t w-full p-4">
							<div className="flex flex-col w-full">
								<h4 className="uppercase font-bold">Cart Total</h4>
								<ul className="flex flex-col my-2">
									<li className="inline-flex items-center justify-between w-full text-base py-1">
										<strong className="text-zinc-500">Subtotal</strong>
										<span>{formatCurrency(subTotal.toString())}</span>
									</li>

									<li className="inline-flex items-center justify-between w-full text-base py-1">
										<strong className="text-zinc-500">Shipping</strong>
										<span>
											{shippingFee
												? formatCurrency(shippingFee.toString())
												: "Free Shipping"}
										</span>
									</li>
									<li className="inline-flex items-center justify-between w-full text-base mt-4">
										<strong className="">Grand Total</strong>
										<strong className="font-bold">
											{formatCurrency(total.toString())}
										</strong>
									</li>
								</ul>

								<div className="flex flex-col mt-5">
									<Button
										className="uppercase inline-flex text-sm rounded-none font-semibold px-8"
										onClick={handlePayNow}
									>
										Pay Now
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutClient;
