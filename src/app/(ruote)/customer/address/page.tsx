import AddressCard from "@/components/card/AddressCard";
import BackButton from "@/components/common/BackButton";
import React from "react";

type Props = {};

const CustomerAddressPage = (props: Props) => {
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
					<div className="flex justify-between flex-col space-y-2 md:flex-row w-full md:space-x-2 md:space-y-0">
						<div className="w-full md:w-1/2">
							<AddressCard />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomerAddressPage;
