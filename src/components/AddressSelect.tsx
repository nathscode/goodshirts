"use client";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/src/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AddressType } from "../db/schema";
import { Button } from "./ui/button";
import useCartStore from "../hooks/use-cart";
import AddressForm from "./form/AddressForm";
import DeliveryAddress from "./DeliveryAddress";

type Props = {
	addresses: AddressType[];
};

const AddressSelect = ({ addresses }: Props) => {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<AddressType>(addresses[0]);
	const { setSelectedAddress, selectedAddress } = useCartStore();

	useEffect(() => {
		if (selected !== null) {
			setSelectedAddress(selected);
		}
	}, [selected, setSelectedAddress]);

	return (
		<div className="flex flex-wrap justify-between w-full">
			<div className="w-full md:w-1/2">
				{selected ? (
					<DeliveryAddress address={selected!} />
				) : (
					<div className="p-2">
						<p className="text-sm font-semibold">
							You don't have an address, click add address
						</p>
					</div>
				)}
			</div>
			<div className="w-full md:w-1/2">
				<div className="flex items-start flex-col w-full justify-start mt-4 sm:mt-0">
					<div className="w-full">
						<div className="flex flex-col w-full">
							<h4 className="font-semibold text-base mb-2">Select Address</h4>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className="w-full justify-between capitalize"
									>
										{selected
											? addresses.find((address) => address.id === selected.id)
													?.addressLine1
											: "Select address..."}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-[200px] p-0">
									<Command>
										<CommandInput placeholder="Search Address..." />
										<CommandList>
											<CommandEmpty>No Address found.</CommandEmpty>
											<CommandGroup>
												{addresses.map((address) => (
													<CommandItem
														key={address.id}
														value={address.id}
														onSelect={(currentValue) => {
															const selectedAddress = addresses.find(
																(cat) => cat.id === currentValue
															);
															if (selectedAddress) {
																setSelected(selectedAddress);
															}
															setOpen(false);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																selected.id === address.id
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
														<span className="capitalize">
															{address.addressLine1}
														</span>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>
						<div className="flex flex-col w-full mt-5">
							<AddressForm />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddressSelect;
