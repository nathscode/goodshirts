import AddressCard from "@/src/components/card/AddressCard";
import BackButton from "@/src/components/common/BackButton";
import React from "react";
import AddressClient from "./AddressClient";

type Props = {};

const CustomerAddressPage = async (props: Props) => {
	return (
		<div className="flex h-screen flex-col justify-start  w-full">
			<div className="flex flex-col flex-1 w-full bg-slate-50 p-3">
				<div className="flex justify-start border-b py-2">
					<div className="justify-start sm:hidden">
						<BackButton href="/customer" />
					</div>
					<h1 className="text-xl font-medium">Address</h1>
				</div>
				<div className="flex flex-col my-4">
					<AddressClient />
				</div>
			</div>
		</div>
	);
};

export default CustomerAddressPage;
