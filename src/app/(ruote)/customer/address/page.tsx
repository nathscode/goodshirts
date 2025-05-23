import AddressCard from "@/src/components/card/AddressCard";
import BackButton from "@/src/components/common/BackButton";
import React from "react";
import AddressClient from "./AddressClient";
import { getAllUserAddressById } from "@/src/actions/address.action";

type Props = {};

const CustomerAddressPage = async (props: Props) => {
	const addresses = await getAllUserAddressById();
	return (
		<div className="flex min-h-screen flex-col w-full">
			<div className="flex flex-col flex-1 w-full bg-slate-50 p-3">
				<div className="flex justify-start border-b py-2">
					<div className="justify-start sm:hidden">
						<BackButton href="/customer" />
					</div>
					<h1 className="text-xl font-medium">Address</h1>
				</div>

				<div className="flex flex-col my-4">
					{addresses && addresses.length > 0 ? (
						<div className="flex flex-wrap justify-center md:justify-start w-full">
							{addresses.map((address: any) => (
								<div key={address.id} className="w-full md:w-1/2 p-2">
									<AddressCard address={address} />
								</div>
							))}
						</div>
					) : (
						<div>No Address Yet</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CustomerAddressPage;
