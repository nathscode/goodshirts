"use client";
import { AddressType } from "../db/schema";
import AddressForm from "./form/AddressForm";

type Props = {
	address: AddressType | null;
};

const AddressBox = ({ address }: Props) => {
	if (!address || address === null) {
		return (
			<div className="flex flex-col items-center justify-center space-y-3 max-w-3xl lg:max-w-4xl mx-auto pb-20">
				<p className="font-semibold text-sm text-neutral-400">
					No Address Yet.
				</p>
				<div className="flex flex-col w-full">
					<AddressForm />
				</div>
			</div>
		);
	}
	return (
		<div className="flex flex-col w-full border rounded-sm">
			<div className="flex flex-col border-b px-4 py-2">
				<h1 className="text-sm font-medium uppercase">Address</h1>
			</div>
			<div className="flex flex-col p-4">
				<p className="text-sm capitalize font-semibold">
					Default Shipping Address
				</p>
				<p className="text-sm capitalize text-gray-500 mt-1">
					{`${address?.fullName}`}
					<br />
					{`${address?.addressLine1}, ${address?.city}`}, <br />
					{address?.state} State.
					<br />
					{address?.phoneNumber}
				</p>
			</div>
		</div>
	);
};

export default AddressBox;
