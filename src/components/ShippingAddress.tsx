"use client";
import { AddressType } from "../db/schema";
import AddressSelect from "./AddressSelect";

type Props = {
	addresses: AddressType[];
};

const ShippingAddress = ({ addresses }: Props) => {
	return (
		<div className="flex flex-col w-full mt-10">
			<h2 className="text-base uppercase font-bold mb-4">
				Select Shipping Address
			</h2>
			<div className="flex flex-col w-full">
				<AddressSelect addresses={addresses} />
			</div>
		</div>
	);
};

export default ShippingAddress;
