"use client";
import DeliveryAddress from "@/src/components/DeliveryAddress";
import { Separator } from "@/src/components/ui/separator";
import useCartStore from "@/src/hooks/use-cart";
import { formatCurrency, roundNumber } from "@/src/lib/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { PaystackButton, usePaystackPayment } from "react-paystack";
import { toast } from "sonner";

import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/src/components/modal/SuccessModal";
import { Loader2 } from "lucide-react";

type Props = {};

const PaymentClient = (props: Props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const { data: session } = useSession();

	const {
		cartItems,
		total,
		totalPrice,
		shippingFee,
		selectedAddress,
		clearCart,
	} = useCartStore();

	// if (cartItems.length === 0) return (window.location.href = "/products");

	let subTotal = roundNumber(total);
	let grandTotal = roundNumber(totalPrice);

	const { mutate, isPending } = useMutation({
		mutationFn: async (formData: FormData) => {
			setIsLoading(true);
			const { data } = await axios.post("/api/orders/", formData);
			return data;
		},
		onSuccess: (data: any) => {
			console.log("Order mutation successful:", data);
			if (data.success) {
				toast.success("Order Successful");
				setShowModal(true);
				setIsLoading(false);
				clearCart();
			} else {
				throw new Error(data.message);
			}
		},
		onError: (error) => {
			console.error("Order mutation error:", error);
			toast.error(error.message);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	const onClose = () => {
		console.log("Payment closed");
	};
	const handlePaystackSuccessAction = (reference: any) => {
		onSubmitFormData(reference);
		console.log(reference);
	};

	// you can call this function anything
	const handlePaystackCloseAction = () => {
		// implementation for  whatever you want to do when the Paystack dialog closed.
		console.log("closed");
	};

	function onSuccess(reference: any) {
		console.log("Payment successful, Paystack reference:", reference);
		onSubmitFormData(reference);
	}

	async function onSubmitFormData(reference: any) {
		console.log("onSubmit fired, reference:", reference);
		if (!cartItems || cartItems.length === 0) {
			console.error("Cart is empty, cannot create order.");
			toast.error("Cart is empty, cannot create order.");
			return;
		}

		if (!selectedAddress) {
			console.error("No delivery address selected.");
			toast.error("Please select a delivery address.");
			return;
		}

		const formData = new FormData();
		formData.append("total", total.toString());
		formData.append("payable", totalPrice.toString());
		formData.append("shippingFee", shippingFee.toString());
		formData.append("addressId", selectedAddress.id.toString());
		formData.append("cartItems", JSON.stringify(cartItems));
		formData.append("reference", String(reference.reference));
		mutate(formData);
	}

	const metadata = {
		custom_fields: cartItems.map((cartItem) => ({
			display_name: String(cartItem.item.name),
			variable_name: String(cartItem.item.name),
			value: cartItem.size.discountPrice
				? Number(cartItem.size.discountPrice) * cartItem.quantity
				: Number(cartItem.size.price) * cartItem.quantity,
		})),
	};

	const config = {
		email: session?.user.email ?? "",
		amount: grandTotal * 100,
		publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
		metadata,
	};
	const componentProps = {
		...config,
		text: "Pay Now",
		onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
		onClose: handlePaystackCloseAction,
	};
	const initializePayment = usePaystackPayment(config);

	function initPayment() {
		if (cartItems.length === 0) {
			toast.error("Your cart is empty.");
			return;
		}

		if (isLoading) return;

		console.log("Initializing payment...");
		// @ts-ignore
		initializePayment(onSuccess, onClose);
	}

	return (
		<div className="flex flex-col justify-start w-full h-full p-4 rounded-sm border bg-slate-50">
			<div className="flex flex-col justify-center items-center text-center py-10">
				<h2 className="text-base font-medium text-gray-500">Total Amount</h2>
				<h1 className="text-2xl font-bold my-1">
					{formatCurrency(grandTotal)}
				</h1>
				<p className="inline-flex items-center space-x-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						className="w-4 h-4 fill-green-500"
					>
						<path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm4 10.723V20h-2v-2.277a1.993 1.993 0 0 1 .567-3.677A2.001 2.001 0 0 1 14 16a1.99 1.99 0 0 1-1 1.723z"></path>
					</svg>
					<span className="text-xs">Secured Payment</span>
				</p>
			</div>
			<Separator className="my-4" />
			<DeliveryAddress address={selectedAddress!} />
			<Separator className="my-4" />
			<ul className="flex flex-col w-full my-2">
				<li className="inline-flex items-center justify-between w-full text-sm py-1">
					<span className="text-zinc-500">Subtotal</span>
					<span>{formatCurrency(subTotal.toString())}</span>
				</li>

				<li className="inline-flex items-center justify-between w-full text-sm py-1">
					<span className="text-zinc-500">Shipping</span>
					<span>
						{" "}
						{shippingFee > 0 ? formatCurrency(shippingFee.toString()) : "Free"}
					</span>
				</li>
				<li className="inline-flex items-center justify-between w-full text-sm mt-4">
					<strong className="">Total</strong>
					<strong className="font-bold">
						{formatCurrency(grandTotal.toString())}
					</strong>
				</li>
			</ul>
			{!isPending && (
				<PaystackButton
					disabled={isPending}
					className="disabled:bg-gray-600 uppercase inline-flex text-center items-center justify-center text-sm rounded-none font-semibold py-2 px-8 mt-4 bg-black text-white"
					{...componentProps}
				/>
			)}
			{isPending && (
				<div className=" uppercase inline-flex text-center items-center justify-center text-sm rounded-none font-semibold py-2 px-8 mt-4 bg-gray-700 text-white">
					{isPending && (
						<div className="inline-flex justify-center item-center gap-1">
							<span>Placing Order...</span>
							<Loader2 size={16} className="animate-spin" />
						</div>
					)}
				</div>
			)}
			{showModal && <SuccessModal />}
		</div>
	);
};

export default PaymentClient;
