"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import AddressForm from "./form/AddressForm";
import { getUserAddressById } from "../actions/address.action";

type Props = {
	id: string;
};

const AddressBox = ({ id }: Props) => {
	const getAddresses = async () => {
		const response = await getUserAddressById(id);
		return response;
	};
	const { isPending, error, data } = useQuery({
		queryKey: ["addresses"],
		queryFn: getAddresses,
	});

	if (isPending) return <p>Loading...</p>;

	if (error) return "An error has occurred: " + error.message;

	if (!data) {
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
					{`${data?.fullName}`}
					<br />
					{`${data?.addressLine1}, ${data?.city}`}, <br />
					{data?.state} State.
					<br />
					{data?.phoneNumber}
				</p>
			</div>
		</div>
	);
};

export default AddressBox;
