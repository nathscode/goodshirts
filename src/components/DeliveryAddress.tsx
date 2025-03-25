import React from "react";
import { AddressType } from "../db/schema";

type Props = {
	address: AddressType;
};

const DeliveryAddress = ({ address }: Props) => {
	return (
		<div className="flex flex-col">
			<p className="text-sm capitalize font-semibold">
				Selected Shipping Address
			</p>
			<p className="text-sm text-gray-500 mt-1">
				{`${address?.fullName}`}
				<br />
				{`${address?.addressLine1}, ${address?.city}`}, <br />
				{address?.state} State.
				<br />
				{address?.phoneNumber}
			</p>
		</div>
	);
};

export default DeliveryAddress;
