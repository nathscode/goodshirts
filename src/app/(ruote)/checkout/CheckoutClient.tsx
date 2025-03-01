"use client";
import ShippingAddress from "@/src/components/ShippingAddress";
import ShippingSection from "@/src/components/ShippingSection";
import ReviewCartCard from "@/src/components/card/ReviewCartCard";
import { Button } from "@/src/components/ui/button";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { AddressType } from "@/src/db/schema";
import useCartStore from "@/src/hooks/use-cart";
import { formatCurrency, roundNumber } from "@/src/lib/utils";
import Link from "next/link";

type Props = {
	addresses: AddressType[];
};

const CheckoutClient = ({ addresses }: Props) => {
	const { cartItems, total, totalPrice, shippingFee } = useCartStore();
	let subTotal = roundNumber(total);
	let grandTotal = roundNumber(totalPrice);
	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-wrap justify-between w-full mt-4">
				<div className="w-full md:w-1/2 px-2">
					<ShippingSection />
					<ShippingAddress addresses={addresses} />
				</div>
				<div className="w-full md:w-1/2 px-2">
					<div className="flex flex-col h-full w-full relative">
						<h2 className="text-lg font-bold">Review your Cart</h2>
						<div className="flex flex-col w-full my-2">
							<ScrollArea className="h-[200px]">
								{cartItems && cartItems.length > 0 ? (
									cartItems.map((cartItem, index) => (
										<ReviewCartCard
											key={index}
											item={cartItem.item}
											variant={cartItem.variant}
											size={cartItem.size}
											quantity={cartItem.quantity}
										/>
									))
								) : (
									<div>Add Product</div>
								)}
							</ScrollArea>
						</div>
						<div className="absolute bottom-1 w-full justify-end">
							<div className="flex flex-col w-full my-4">
								<h4 className="uppercase font-bold">Cart Total</h4>
								<ul className="flex flex-col w-full my-2">
									<li className="inline-flex items-center justify-between w-full text-base py-1">
										<span className="text-zinc-500">Subtotal</span>
										<span>{formatCurrency(subTotal.toString())}</span>
									</li>

									<li className="inline-flex items-center justify-between w-full text-base py-1">
										<span className="text-zinc-500">Shipping</span>
										<span>
											{" "}
											{shippingFee > 0
												? formatCurrency(shippingFee.toString())
												: "Free"}
										</span>
									</li>
									<li className="inline-flex items-center justify-between w-full text-base mt-4">
										<strong className="">Grand Total</strong>
										<strong className="font-bold">
											{formatCurrency(grandTotal.toString())}
										</strong>
									</li>
								</ul>
								<div className="flex flex-col mt-5">
									<Button
										className="uppercase inline-flex text-sm rounded-none font-semibold px-8 "
										asChild
									>
										<Link href={"/checkout/pay"}>Pay Now</Link>
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
