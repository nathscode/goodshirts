"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Import a loading spinner
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { productVariantPriceSchema } from "@/src/lib/validators/variant";
import { getVariantById } from "@/src/actions/variant.action";
import { useRouter } from "next/navigation";

interface VariantEditFormProps {
	id: string;
}

const VariantEditForm = ({ id }: VariantEditFormProps) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(productVariantPriceSchema),
		defaultValues: {
			size: "",
			price: "",
			discountPrice: "",
			stockQuantity: 0,
			sizeId: "",
		},
	});

	const { setValue } = form;

	// Fetch variant data when the dialog is opened
	const fetchVariantData = async () => {
		setIsLoading(true);
		setFetchError(null);

		try {
			const variant = await getVariantById(id);
			if (variant) {
				setValue("size", variant.size || "");
				setValue("price", variant.price || "");
				setValue("discountPrice", variant.discountPrice || "");
				setValue("stockQuantity", variant.stockQuantity || 0);
				setValue("sizeId", variant.id || "");
			} else {
				setFetchError("Variant not found");
			}
		} catch (error) {
			console.error("Failed to fetch variant:", error);
			setFetchError("Failed to load variant data");
		} finally {
			setIsLoading(false);
		}
	};

	const { mutate, isPending } = useMutation({
		mutationFn: async (values: any) => {
			const { data } = await axios.patch(`/api/variant/${id}`, values);
			return data;
		},
		onSuccess: (data) => {
			if (data && data.status === "success") {
				toast.success(`Variant updated successfully`);
				setIsDialogOpen(false);
				router.refresh();
				form.reset();
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

	const onSubmit = (values: any) => {
		mutate(values);
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					onClick={async () => {
						setIsDialogOpen(true);
						await fetchVariantData(); // Fetch data when the dialog is opened
					}}
				>
					Edit
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Variant</DialogTitle>
				</DialogHeader>
				<ScrollArea className="max-h-[500px]">
					{isLoading ? (
						<div className="flex items-center justify-center p-6">
							<Loader2 className="h-6 w-6 animate-spin" />
						</div>
					) : fetchError ? (
						<div className="flex items-center justify-center p-6">
							<p className="text-red-500">{fetchError}</p>
						</div>
					) : (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4 w-full"
							>
								<FormField
									control={form.control}
									name="size"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Size</FormLabel>
											<FormControl>
												<Input type="text" placeholder="Size" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price</FormLabel>
											<FormControl>
												<Input type="text" placeholder="Price" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="discountPrice"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Discount Price</FormLabel>
											<FormControl>
												<Input
													type="text"
													placeholder="Discount Price"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="stockQuantity"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Stock Quantity</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Stock Quantity"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" disabled={isPending} className="w-full">
									{isPending ? "Updating..." : "Update"}
								</Button>
							</form>
						</Form>
					)}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default VariantEditForm;
