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

const PriceVariantsForm = ({ form, name }: { form: any; name: string }) => {
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name,
	});

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
								name={`${name}.${index}.price`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="e.g 19.99"
												{...field}
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
								name={`${name}.${index}.discountPrice`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Discount Price</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="e.g 15.99"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
								rules={{
									validate: (discountPrice, formValues) => {
										const price = formValues[name][index]?.price;
										if (parseFloat(discountPrice) > parseFloat(price)) {
											return "Discount Price can't be bigger than Price";
										}
										return true;
									},
								}}
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
				<Button
					type="button"
					variant={"secondary"}
					onClick={() =>
						append({
							size: "",
							price: "",
							discountPrice: "",
							stockQuantity: 0,
							available: true,
						})
					}
				>
					Add Another Size & Price
				</Button>
			</div>
		</div>
	);
};
export default PriceVariantsForm;
