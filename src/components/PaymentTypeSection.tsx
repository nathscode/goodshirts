import { RadioGroup } from "@headlessui/react";
import { CheckIcon, CreditCard, LucideIcon, Truck, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsClient } from "usehooks-ts";
import useCartStore from "../hooks/use-cart";

type Props = {};

type PaymentTypeOptionsTypes = {
	name: string;
	type: "ONLINE" | "DELIVERY";
	icon: LucideIcon;
};

const plans: PaymentTypeOptionsTypes[] = [
	{
		name: "On Delivery",
		type: "DELIVERY",
		icon: Truck,
	},
	{
		name: "Online Payment",
		type: "ONLINE",
		icon: CreditCard,
	},
];

const PaymentTypeSection = (props: Props) => {
	const [selectedOption, setSelectedOption] =
		useState<PaymentTypeOptionsTypes>();
	const { setPaymentType } = useCartStore();

	useEffect(() => {
		setPaymentType(selectedOption?.type!);
	}, [selectedOption, setPaymentType]);

	const isClient = useIsClient();

	if (!isClient) return null; // Return null instead of undefined

	const handleOptionChange = (option: PaymentTypeOptionsTypes) => {
		setSelectedOption(option);
	};

	return (
		<div className="flex flex-col w-full mt-8 mb-4">
			<h2 className="text-base uppercase font-bold mb-4">
				Select Payment Option
			</h2>
			<div className="flex flex-col w-full justify-start items-start">
				<RadioGroup value={selectedOption} onChange={handleOptionChange}>
					<RadioGroup.Label className="sr-only">
						Shipping Options
					</RadioGroup.Label>
					<div className="flex flex-wrap sm:flex-nowrap justify-start w-full gap-2">
						{plans.map((plan) => (
							<RadioGroup.Option
								key={plan.type}
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
														<plan.icon className="size-5" />
													</RadioGroup.Label>
													<RadioGroup.Description
														as="span"
														className={`inline`}
													>
														<h4 className="font-semibold whitespace-nowrap text-base my-1">
															{plan.name}
														</h4>{" "}
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

export default PaymentTypeSection;
