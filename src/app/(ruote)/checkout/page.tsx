import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import React from "react";
import CheckoutClient from "./CheckoutClient";
import { getAllUserAddressById } from "@/src/actions/address.action";
import getCurrentUser from "@/src/actions/getCurrentUser";
import { redirect } from "next/navigation";
import BackButton from "@/src/components/common/BackButton";

type Props = {};

const CheckoutPage = async (props: Props) => {
	const session = await getCurrentUser();
	if (!session) return redirect("/login");
	const addresses = await getAllUserAddressById();
	return (
		<MaxWidthWrapper>
			<div className="relative px-2 md:px-10 py-5">
				<div className="flex flex-col items-start justify-start my-4">
					<div className="flex justify-start items-center">
						<BackButton href="/products" />
						<h1 className="text-xl font-bold">Checkout</h1>
					</div>
					<CheckoutClient addresses={addresses} />
				</div>
			</div>
		</MaxWidthWrapper>
	);
};

export default CheckoutPage;
