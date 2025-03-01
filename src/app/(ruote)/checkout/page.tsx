import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import React from "react";
import CheckoutClient from "./CheckoutClient";
import { getAllUserAddressById } from "@/src/actions/address.action";

type Props = {};

const CheckoutPage = async (props: Props) => {
	const addresses = await getAllUserAddressById();
	return (
		<MaxWidthWrapper>
			<div className="relative px-2 md:px-10 py-5">
				<div className="flex flex-col items-start justify-start my-4">
					<h1 className="text-xl font-bold">Checkout</h1>
					<CheckoutClient addresses={addresses} />
				</div>
			</div>
		</MaxWidthWrapper>
	);
};

export default CheckoutPage;
