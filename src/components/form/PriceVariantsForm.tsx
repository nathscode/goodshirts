"use client";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const PriceVariantsForm = ({ form, name }: { form: any; name: string }) => {
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name,
	});
	const formatNumberWithCommas = (value: string) => {
		return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	const handlePriceChange = (index: number, value: string) => {
		const numericValue = value.replace(/[^0-9.]/g, "");
		const formattedValue = formatNumberWithCommas(numericValue);
		form.setValue(`${name}.${index}.price`, numericValue);
		form.setValue(`${name}.${index}.formattedPrice`, formattedValue);
	};

	const handleDiscountPriceChange = (index: number, value: string) => {
		const numericValue = value.replace(/[^0-9.]/g, "");
		const formattedValue = formatNumberWithCommas(numericValue);
		form.setValue(`${name}.${index}.discountPrice`, numericValue);
		form.setValue(`${name}.${index}.formattedDiscountPrice`, formattedValue);
	};

	const handleAddVariant = () => {
		const newVariant = {
			size: "",
			price: "0",
			discountPrice: "0",
			formattedPrice: "0",
			formattedDiscountPrice: "0",
			stockQuantity: 0,
			available: true,
		};
		if (newVariant.discountPrice && newVariant.price) {
			if (parseFloat(newVariant.discountPrice) > parseFloat(newVariant.price)) {
				toast.error("Discount Price cannot be greater than Price");
				return;
			}
		}

		append(newVariant);
	};

	return (
		<div>
			{fields.map((field, index) => (
				<div key={field.id} className="flex flex-col space-x-2 mt-4">
					<div className="flex justify-between flex-col space-y-2 md:flex-row w-full md:space-x-2 md:space-y-0">
						<div className="w-full md:w-1/2">
							{/* Size */}
							<FormField
								control={form.control}
								name={`${name}.${index}.size`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Size</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="e.g M, L, XL"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="w-full md:w-1/2">
							{/* Stock */}
							<FormField
								control={form.control}
								name={`${name}.${index}.stockQuantity`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Stocks</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="Enter stock quantity"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="w-full md:w-1/2">
							{/* Price */}
							<FormField
								control={form.control}
								name={`${name}.${index}.formattedPrice`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="e.g 10,000"
												{...field}
												onChange={(e) =>
													handlePriceChange(index, e.target.value)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="w-full md:w-1/2">
							{/* Discount Price */}
							<FormField
								control={form.control}
								name={`${name}.${index}.formattedDiscountPrice`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Discount Price</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="e.g 15,000"
												{...field}
												onChange={(e) =>
													handleDiscountPriceChange(index, e.target.value)
												}
												onBlur={() => {
													const price = parseFloat(
														form.getValues(`${name}.${index}.price`)
													);
													const discountPrice = parseFloat(
														form.getValues(`${name}.${index}.discountPrice`)
													);

													if (discountPrice > price) {
														toast.error(
															"Discount Price cannot be greater than Price"
														);
														form.setError(`${name}.${index}.discountPrice`, {
															type: "manual",
															message:
																"Discount Price cannot be greater than Price",
														});
													} else {
														form.clearErrors(`${name}.${index}.discountPrice`);
													}
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/* Remove Button */}
					<div className="flex flex-col justify-end items-end my-4">
						<Button
							type="button"
							variant={"secondary"}
							onClick={() => remove(index)}
							className="text-red-500 bg-red-50"
						>
							<Trash className="size-4" />
							<span>Remove Size & Price</span>
						</Button>
					</div>
				</div>
			))}

			{/* Add Price Variant Button */}
			<div className="flex flex-col w-full my-4">
				<Button type="button" variant={"secondary"} onClick={handleAddVariant}>
					Add Another Size & Price
				</Button>
			</div>
		</div>
	);
};

export default PriceVariantsForm;
