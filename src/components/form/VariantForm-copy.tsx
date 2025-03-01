"use client";
import LoadingButton from "@/src/components/common/LoadingButton";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";

import { Textarea } from "@/src/components/ui/textarea";
import { addressesTypes } from "@/src/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import {
	variantSchema,
	variantSchemaInfer,
} from "@/src/lib/validators/variant";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

interface VariantFormProps {
	initialData?: null | undefined;
	slug?: string;
}

const VariantForm = ({ slug, initialData }: VariantFormProps) => {
	const router = useRouter();

	const form = useForm<variantSchemaInfer>({
		resolver: zodResolver(variantSchema),
		defaultValues: {
			productSlug: slug,
			color: "",
			productPriceVariants: [
				{
					size: "",
					price: "",
					discountPrice: "",
					stockQuantity: 0,
					available: true,
				},
			],
		},
	});
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "productPriceVariants",
	});

	const { mutate, isPending } = useMutation({
		mutationFn: async (values: variantSchemaInfer) => {
			const { data } = await axios.post("/api/variant", values);
			return data;
		},
		onSuccess: (data) => {
			if (data && data.status === "success") {
				window.location.reload();
				form.reset();
				toast.success("Address created successfully");
			} else {
				console.error("Unexpected response structure:", data);
				toast.error("Unexpected response from server");
			}
		},
		onError: (err: any) => {
			console.error("Mutation failed. Error:", err);
			const errorMessage =
				err.response?.data?.errors?.message || "Server error";
			toast.error("An error occurred", { description: errorMessage });
		},
	});

	function onSubmit(values: variantSchemaInfer) {
		// mutate(values);
		console.log(values);
		form.reset();
	}

	return (
		<>
			<div className="flex items-start flex-col  w-full justify-start">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 w-full"
					>
						{/* Main Color Input */}
						<div className="w-full">
							<FormField
								control={form.control}
								name="color"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Color </FormLabel>
										<FormControl>
											<Input type="text" placeholder="e.g Purple" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Dynamic Price Variants */}
						{fields.map((item, index) => (
							<div
								key={item.id}
								className="flex flex-col space-y-2 p-3 border rounded-lg"
							>
								<div className="flex justify-between flex-col space-y-2 md:flex-row w-full md:space-x-2 md:space-y-0">
									<div className="w-full md:w-1/2">
										<FormField
											control={form.control}
											name={`productPriceVariants.${index}.size`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Size</FormLabel>
													<FormControl>
														<Input
															type="text"
															placeholder="e.g Medium"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="w-full md:w-1/2">
										{/* Stock Quantity Field */}
										<FormField
											control={form.control}
											name={`productPriceVariants.${index}.stockQuantity`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Stock Quantity</FormLabel>
													<FormControl>
														<Input
															type="number"
															placeholder="e.g 50"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="w-full md:w-1/2">
										{/* Price Field */}
										<FormField
											control={form.control}
											name={`productPriceVariants.${index}.price`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Price</FormLabel>
													<FormControl>
														<Input
															type="number"
															placeholder="e.g 1999"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="w-full md:w-1/2">
										{/* Discount Price Field */}
										<FormField
											control={form.control}
											name={`productPriceVariants.${index}.discountPrice`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Discount Price</FormLabel>
													<FormControl>
														<Input
															type="number"
															placeholder="e.g 1799"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								{/* Remove Button */}
								<Button
									type="button"
									variant={"secondary"}
									onClick={() => remove(index)}
									className="text-red-500 bg-red-50"
								>
									<Trash className="size-4" />
									<span>Remove Variant</span>
								</Button>
							</div>
						))}

						{/* Add Another Variant Button */}
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
							className="bg-slate-200"
						>
							Add Another Variant
						</Button>

						{/* Submit Button */}
						<LoadingButton
							type="submit"
							loading={isPending}
							className="mt-6 w-full"
						>
							Submit
						</LoadingButton>
					</form>
				</Form>
			</div>
		</>
	);
};
export default VariantForm;
