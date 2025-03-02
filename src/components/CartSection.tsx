import Link from "next/link";
import useCartStore, { CartItem } from "../hooks/use-cart";
import { formatCurrency, roundNumber } from "../lib/utils";
import CartCard from "./card/CartCard";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
	carts: CartItem[];
};

const CartSection = ({ carts }: Props) => {
	const { clearCart, shippingFee, total, totalPrice } = useCartStore();
	let subTotal = roundNumber(total);
	let grandTotal = roundNumber(totalPrice);

	return (
		<div className="flex flex-col h-full w-full">
			{/* Scrollable Cart Items Section */}
			<div className="flex-1">
				<ScrollArea className="max-h-[450px] overflow-y-auto">
					{carts.map((cart, index) => (
						<CartCard
							key={`${cart.item.id}-${index}`}
							item={cart.item}
							variant={cart.variant}
							size={cart.size}
							quantity={cart.quantity}
						/>
					))}
				</ScrollArea>
			</div>

			{/* Bottom Fixed Section */}
			<div className="sticky bottom-0 bg-white shadow-lg border-t w-full p-4">
				<div className="flex flex-col w-full">
					<div className="flex flex-col mb-4">
						<Button
							variant="default"
							className="uppercase w-fit inline-flex text-sm rounded-none font-semibold px-8"
							onClick={() => clearCart()}
						>
							Clear Cart
						</Button>
					</div>
					<h4 className="uppercase font-bold">Cart Total</h4>
					<ul className="flex flex-col my-2">
						<li className="inline-flex items-center justify-between w-full text-base py-1">
							<strong className="text-zinc-500">Subtotal</strong>
							<span>{formatCurrency(subTotal.toString())}</span>
						</li>

						<li className="inline-flex items-center justify-between w-full text-base py-1">
							<strong className="text-zinc-500">Shipping</strong>
							<span>
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
							className="uppercase inline-flex text-sm rounded-none font-semibold px-8"
							asChild
						>
							<Link href={"/checkout"}>Proceed to checkout</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartSection;
