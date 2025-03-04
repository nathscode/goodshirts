"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { AddressType } from "@/src/db/schema";
import AddressActionItem from "../common/AddressActionItem";
import AddressForm from "../form/AddressForm";

type Props = {
	address: AddressType;
};

const AddressCard = ({ address }: Props) => {
	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col w-full border rounded-sm">
				<div className="flex flex-col border-b px-4 py-2">
					<h1 className="text-sm font-medium uppercase">Address</h1>
				</div>
				<div className="flex flex-col p-4">
					<p className="text-sm capitalize font-semibold">
						{address.isDefault
							? "Default Shipping Address"
							: "Shipping Address"}
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
				<div className="flex flex-col border-t p-2">
					<div className="flex justify-between items-center w-full">
						{/* Toggle Default Button */}
						<AddressActionItem
							option="toggleDefault"
							id={address.id}
							isDefault={address.isDefault!}
						/>

						{/* Edit & Delete Buttons */}
						<div className="flex space-x-1">
							<div>
								<AddressForm initialData={address} />
							</div>
							<AddressActionItem option="delete" id={address.id} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddressCard;
