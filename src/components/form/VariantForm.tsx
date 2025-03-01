"use client";
import LoadingButton from "@/src/components/common/LoadingButton";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";

import {
	variantSchema,
	variantSchemaInfer,
} from "@/src/lib/validators/variant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PriceVariantsForm from "./PriceVariantsForm";
import { Button } from "../ui/button";

interface VariantFormProps {
	initialData?: null | undefined;
	slug?: string;
}

const VariantForm = ({ slug, initialData }: VariantFormProps) => {
	const form = useForm<variantSchemaInfer>({
		resolver: zodResolver(variantSchema),
		defaultValues: {
			productSlug: slug,
			variants: [
				{
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
			],
		},
	});

	// ✅ Set up useFieldArray for "variants" only (not productSlug)
	const {
		fields: variantFields,
		append: addVariant,
		remove: removeVariant,
	} = useFieldArray({
		control: form.control,
		name: "variants",
	});

	const { mutate, isPending } = useMutation({
		mutationFn: async (values: variantSchemaInfer) => {
			const { data } = await axios.post("/api/variant", values);
			return data;
		},
		onSuccess: (data) => {
			if (data && data.status === "success") {
				window.location.href = `/dashboard/products/${slug}`;
				form.reset();
				toast.success("Variants added successfully");
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
		mutate(values);
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
						{/* Map through variants */}
						{variantFields.map((variant, variantIndex) => (
							<div key={variant.id} className="border p-4 rounded-md">
								<FormField
									control={form.control}
									name={`variants.${variantIndex}.color`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Color</FormLabel>
											<FormControl>
												<Input
													type="text"
													placeholder="e.g Purple"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Price Variants for each Color */}
								<PriceVariantsForm
									form={form}
									name={`variants.${variantIndex}.productPriceVariants`}
								/>

								<div className="flex flex-col w-full my-4">
									<Button
										type="button"
										variant={"secondary"}
										onClick={() => removeVariant(variantIndex)}
										className="bg-red-50 text-red-500"
									>
										Remove Variant
									</Button>
								</div>
							</div>
						))}

						{/* Add Variant Button */}
						<Button
							type="button"
							variant={"secondary"}
							onClick={() =>
								addVariant({
									color: "",
									productPriceVariants: [
										{
											size: "",
											price: "",
											discountPrice: "",
											stockQuantity: 1,
											available: true,
										},
									],
								})
							}
							className="bg-neutral-200"
						>
							Add Another Variant
						</Button>

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
