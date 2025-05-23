"use client";

import DeliveryAddress from "@/src/components/DeliveryAddress";
import SuccessModal from "@/src/components/modal/SuccessModal";
import { Separator } from "@/src/components/ui/separator";
import useCartStore from "@/src/hooks/use-cart";
import { useGuestUserInfoStore } from "@/src/hooks/use-guest-user";
import { formatCurrency, roundNumber } from "@/src/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PaystackButton } from "react-paystack";
import { toast } from "sonner";

const PaymentClient = () => {
	const {
		cartItems,
		total,
		shippingFee,
		paymentType,
		totalPrice,
		selectedAddress,
		clearCart,
	} = useCartStore();
	const { guestUserInfo } = useGuestUserInfoStore();
	const router = useRouter();
	const { data: session } = useSession();

	const [isHydrated, setIsHydrated] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [hasCompletedOrder, setHasCompletedOrder] = useState(false);

	const subTotal = roundNumber(total);
	const grandTotal = roundNumber(totalPrice);
	const formattedSubtotal = formatCurrency(subTotal.toString());

	useEffect(() => {
		if (!isHydrated) return;

		if (!cartItems || cartItems.length === 0) {
			router.replace("/products");
		}
	}, [cartItems, router, isHydrated]);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	useEffect(() => {
		if (!isHydrated) return;

		const isGuest = !session;
		const isLoggedIn = !!session;

		if (isGuest && !guestUserInfo?.email) {
			router.push("/checkout");
		}

		if (isLoggedIn && !selectedAddress) {
			router.push("/checkout");
		}
	}, [isHydrated, guestUserInfo, selectedAddress, session, router]);

	const { mutate, isPending } = useMutation({
		mutationFn: async (formData: FormData) => {
			setIsLoading(true);
			const { data } = await axios.post("/api/orders/", formData);
			return data;
		},
		onSuccess: (data) => {
			if (data.success) {
				toast.success("Order Successful");
				setShowModal(true);
				setHasCompletedOrder(true);
				clearCart();
				router.push("/products");
			} else {
				throw new Error(data.message);
			}
		},
		onError: (error: any) => {
			toast.error(error.message);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	const handleCloseModal = () => {
		setShowModal(false);
		setHasCompletedOrder(false);
	};

	const handlePaystackSuccessAction = (reference: any) => {
		onSubmitFormData(reference.reference);
	};

	const handlePaystackCloseAction = () => {
		router.push("/checkout/pay");
		toast.error("Payment cancelled");
	};

	async function onSubmitFormData(reference: string) {
		if (!cartItems.length) {
			toast.error("Cart is empty, cannot create order.");
			return;
		}

		if (!paymentType) {
			toast.error("Please select a payment option");
			return;
		}

		if (!guestUserInfo && !selectedAddress) {
			toast.error("Please fill in your shipping");
			return;
		}

		const formData = new FormData();
		formData.append("total", total.toString());
		formData.append("payable", totalPrice.toString());
		formData.append("shippingFee", "0");
		formData.append("cartItems", JSON.stringify(cartItems));
		formData.append("reference", reference);
		formData.append("paymentType", paymentType);

		if (guestUserInfo) {
			formData.append("guestUser", JSON.stringify(guestUserInfo));
		} else if (selectedAddress) {
			formData.append("addressId", selectedAddress.id.toString());
		}

		mutate(formData);
	}

	const handleDeliveryOrder = () => {
		const randomReference = `DELI-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
		onSubmitFormData(randomReference);
	};

	const metadata = {
		custom_fields: cartItems.map((cartItem) => ({
			display_name: String(cartItem.item.name),
			variable_name: String(cartItem.item.name),
			value: cartItem.size.discountPrice
				? Number(cartItem.size.discountPrice) * cartItem.quantity
				: Number(cartItem.size.price) * cartItem.quantity,
		})),
	};
	const email = guestUserInfo?.email || session?.user?.email;

	const config = {
		email: email ?? "",
		amount: subTotal * 100,
		publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
		metadata,
	};

	const componentProps = {
		...config,
		text: "Pay Now",
		onSuccess: handlePaystackSuccessAction,
		onClose: handlePaystackCloseAction,
	};

	const paymentText =
		paymentType === "DELIVERY" ? "Payment on Delivery" : "Online Payment";

	return (
		<div className="flex flex-col justify-start w-full h-full p-4 rounded-sm border bg-slate-50">
			<div className="flex flex-col justify-center items-center text-center py-10">
				<h2 className="text-base font-medium text-gray-500">Total Amount</h2>
				<h1 className="text-2xl font-bold my-1">{formattedSubtotal}</h1>
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
			<div className="flex flex-col mb-4">
				<h2 className="text-sm capitalize font-semibold">Payment Option</h2>
				<p className="text-sm text-gray-500">{paymentText}</p>
			</div>
			{selectedAddress ? (
				<DeliveryAddress address={selectedAddress} />
			) : (
				<div className="flex flex-col mb-4">
					<h2 className="text-sm capitalize font-semibold">Shipping Address</h2>
					<p className="text-sm text-gray-500">
						{`${guestUserInfo?.firstName} ${guestUserInfo?.lastName} `}
						<br />
						{`${guestUserInfo?.streetAddress}`}, {`${guestUserInfo?.city}`},{" "}
						<br />
						{` ${guestUserInfo?.state} state`}. <br />
						{`${guestUserInfo?.phoneNumber}`}
					</p>
				</div>
			)}
			<Separator className="my-4" />
			<ul className="flex flex-col w-full my-2">
				<li className="inline-flex items-center justify-between w-full text-sm py-1">
					<span className="text-zinc-500">Subtotal</span>
					<span>{formattedSubtotal}</span>
				</li>
				<li className="inline-flex items-center justify-between w-full text-sm py-1">
					<span className="text-zinc-500">Shipping</span>
					<span>
						{shippingFee > 0 ? formatCurrency(shippingFee.toString()) : "Free"}
					</span>
				</li>
				<li className="inline-flex items-center justify-between w-full text-sm mt-4">
					<strong>Total</strong>
					<strong className="font-bold">{formattedSubtotal}</strong>
				</li>
			</ul>
			{paymentType === "ONLINE" ? (
				<PaystackButton
					disabled={isPending}
					className="disabled:bg-gray-600 uppercase inline-flex text-center items-center justify-center text-sm rounded-none font-semibold py-2 px-8 mt-4 bg-black text-white hover:bg-black/80"
					{...componentProps}
				/>
			) : (
				<button
					onClick={handleDeliveryOrder}
					disabled={isPending}
					className="disabled:bg-gray-600 uppercase inline-flex text-center items-center justify-center text-sm rounded-none font-semibold py-2 px-8 mt-4 bg-black text-white hover:bg-black/80"
				>
					{isPending ? "Processing..." : "Place Order"}
				</button>
			)}
			{showModal && <SuccessModal onClose={handleCloseModal} />}
		</div>
	);
};

export default PaymentClient;
