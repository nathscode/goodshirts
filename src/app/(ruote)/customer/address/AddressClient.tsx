"use client";
import { getAllUserAddressById } from "@/src/actions/address.action";
import AddressCard from "@/src/components/card/AddressCard";
import AddressForm from "@/src/components/form/AddressForm";
import CardSkeleton from "@/src/components/skeleton/CardSkeleton";
import { useQuery } from "@tanstack/react-query";

const AddressClient = () => {
	const getAddresses = async () => {
		const response = await getAllUserAddressById();
		return response;
	};
	const { isPending, error, data } = useQuery({
		queryKey: ["customer-addresses"],
		queryFn: getAddresses,
	});

	if (isPending) {
		return (
			<div className="flex flex-col justify-start max-w-full gap-4 my-5">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="flex flex-col w-full justify-start">
						<CardSkeleton />
					</div>
				))}
			</div>
		);
	}

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
		<div className="flex justify-between flex-col space-y-2 md:flex-row w-full md:space-x-2 md:space-y-0">
			{data.map((address: any) => (
				<div className="w-full md:w-1/2">
					<AddressCard address={address} />
				</div>
			))}
		</div>
	);
};

export default AddressClient;
