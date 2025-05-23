"use client";
import { useQuery } from "@tanstack/react-query";
import { getAllUserAddressById } from "../actions/address.action";
import AddressSelect from "./AddressSelect";

const ShippingAddress = () => {
	const getAddresses = async () => {
		const response = await getAllUserAddressById();
		return response;
	};
	const { isPending, error, data } = useQuery({
		queryKey: ["customer-address"],
		queryFn: getAddresses,
	});
	if (isPending) return <div>Loading...</div>;
	if (error) {
		return (
			<div className="flex flex-col w-full mt-10">
				<h2 className="text-base uppercase font-bold mb-4">
					Select Shipping Address
				</h2>
				<div className="flex flex-col w-full">
					<div>Failed to load addresses</div>
				</div>
			</div>
		);
	}
	return (
		<div className="flex flex-col w-full mt-10">
			<h2 className="text-base uppercase font-bold mb-4">
				Select Shipping Address
			</h2>
			<div className="flex flex-col w-full">
				{data && data.length === 0 ? (
					<div> You don't have an address</div>
				) : (
					<AddressSelect addresses={data!} />
				)}
			</div>
		</div>
	);
};

export default ShippingAddress;
