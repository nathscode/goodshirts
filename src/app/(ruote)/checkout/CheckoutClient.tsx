"use client";

import PaymentTypeSection from "@/src/components/PaymentTypeSection";
import ShippingAddress from "@/src/components/ShippingAddress";
import ReviewCartCard from "@/src/components/card/ReviewCartCard";
import GuestForm from "@/src/components/form/GuestForm";
import { Button } from "@/src/components/ui/button";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import useCartStore from "@/src/hooks/use-cart";
import { useGuestUserInfoStore } from "@/src/hooks/use-guest-user";
import { formatCurrency, roundNumber } from "@/src/lib/utils";
import { CustomUser } from "@/src/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
	session: CustomUser | null;
};

const CheckoutClient = ({ session }: Props) => {
	const {
		cartItems,
		total,
		totalPrice,
		shippingFee,
		paymentType,
		selectedAddress,
	} = useCartStore();
	const { guestUserInfo } = useGuestUserInfoStore();
	const router = useRouter();

	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		// Simulate hydration delay or use a persisted store hook
		const timer = setTimeout(() => {
			setIsHydrated(true);
		}, 100); // small delay to simulate hydration completion

		return () => clearTimeout(timer);
	}, []);

	// Prevent accessing checkout if cart is empty (after hydration)
	useEffect(() => {
		if (!isHydrated) return;

		if (!cartItems || cartItems.length === 0) {
			router.replace("/products");
		}
	}, [cartItems, router, isHydrated]);

	let subTotal = roundNumber(total);
	let grandTotal = roundNumber(totalPrice);

	const handlePayNow = () => {
		if (!paymentType) {
			toast.error("Select a payment option");
			return;
		}

		if (!guestUserInfo && !session) {
			toast.error("Please fill in your shipping details.");
			return;
		}

		if (session && !selectedAddress) {
			toast.error("Select a delivery address");
			return;
		}

		router.push("/checkout/pay");
	};

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-wrap justify-between w-full mt-4">
				<div className="w-full md:w-1/2 px-2">
					<PaymentTypeSection />
					{session ? (
						<>
							{/* <ShippingSection /> */}
							<ShippingAddress />
						</>
					) : (
						<GuestForm />
					)}
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
