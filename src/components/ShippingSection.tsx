import React, { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "lucide-react";
import { useIsClient } from "usehooks-ts";
import useCartStore from "../hooks/use-cart";
import { formatCurrency } from "../lib/utils";

type Props = {};

type ShippingOptionsTypes = {
	name: string;
	amount: number;
	description: string;
};

const plans: ShippingOptionsTypes[] = [
	{
		name: "Pick up",
		amount: 0,
		description: "Pick your order at the shop",
	},
	{
		name: "Delivery",
		amount: 4000,
		description: "Will delivered to your default address",
	},
];

const ShippingSection = (props: Props) => {
	const [selectedOption, setSelectedOption] = useState<ShippingOptionsTypes>(
		plans[0]
	);
	const { setShippingFee } = useCartStore();

	useEffect(() => {
		setShippingFee(selectedOption.amount);
	}, [selectedOption, setShippingFee]);

	const isClient = useIsClient();

	if (!isClient) return null; // Return null instead of undefined

	const handleOptionChange = (option: ShippingOptionsTypes) => {
		setSelectedOption(option);
	};

	return (
		<div className="flex flex-col w-full my-4">
			<h2 className="text-base uppercase font-bold mb-4">
				Select Shipping Information
			</h2>
			<div className="flex flex-col w-full justify-start items-start">
				<RadioGroup value={selectedOption} onChange={handleOptionChange}>
					<RadioGroup.Label className="sr-only">
						Shipping Options
					</RadioGroup.Label>
					<div className="flex flex-col w-full gap-2">
						{plans.map((plan) => (
							<RadioGroup.Option
								key={plan.name}
								value={plan}
								className={({ active, checked }) =>
									`${
										active
											? "ring-1 ring-white/60 ring-offset-1 ring-offset-black"
											: ""
									} ${checked ? "border-2 border-black" : "border border-gray-300"} relative flex cursor-pointer w-full px-5 py-4 focus:outline-none`
								}
							>
								{({ active, checked }) => (
									<>
										<div className="flex w-full items-center justify-between">
											<div className="flex items-center">
												<div className="text-sm">
													<RadioGroup.Label as="p" className={`font-medium`}>
														{plan.name}
													</RadioGroup.Label>
													<RadioGroup.Description
														as="span"
														className={`inline`}
													>
														<h4 className="font-semibold text-base my-1">
															{plan.amount === 0
																? "Free"
																: formatCurrency(plan.amount)}
														</h4>{" "}
														<p>{plan.description}</p>
													</RadioGroup.Description>
												</div>
											</div>
											{checked && (
												<div className="shrink-0 text-brand">
													<CheckIcon className="h-6 w-6" />
												</div>
											)}
										</div>
									</>
								)}
							</RadioGroup.Option>
						))}
					</div>
				</RadioGroup>
			</div>
		</div>
	);
};

export default ShippingSection;
