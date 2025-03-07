"use client";

import React, { useState, useCallback } from "react";
import { buttonVariants } from "@/src/components/ui/button";
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
import { ProductType, ProductWithExtra } from "@/src/db/schema";
import useFetchCategories from "@/src/hooks/use-fetch-categories";
import useFetchSubCategories from "@/src/hooks/use-fetch-sub-categories";
import { baseURL } from "@/src/lib/constants";
import { compressImage } from "@/src/lib/utils";
import {
	ProductSchema,
	ProductSchemaInfer,
} from "@/src/lib/validators/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ImageIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BackButton from "../common/BackButton";
import DeleteItem from "../common/DeleteItem";
import LoadingButton from "../common/LoadingButton";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";

const ImageSchema = z.object({
	file: z.string(),
	preview: z.string().optional(),
	isNew: z.boolean().optional(),
});

type ImageSchemaInfer = z.infer<typeof ImageSchema>;

const acceptedFileTypes = ["image/png", "image/jpeg", "image/jpg", "video/mp4"];
const maxFileSize = 10 * 1024 * 1024; // 10MB

interface ProductFormProps {
	initialData?: ProductWithExtra | null | undefined;
}

const ProductForm = React.memo(({ initialData }: ProductFormProps) => {
	const initialImage = initialData
		? initialData.medias.map((media) => ({
				file: media.url,
				preview: media.url,
				isNew: false,
			}))
		: [];

	const [images, setImages] = useState<ImageSchemaInfer[]>(initialImage);
	const [selectedCategory, setSelectedCategory] = useState<string>("");

	const {
		categories,
		isLoading: isCategoriesLoading,
		error: categoriesError,
	} = useFetchCategories();
	const {
		subCategories,
		isSubCategoryLoading,
		error: subCategoriesError,
	} = useFetchSubCategories(selectedCategory);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		// @ts-ignore
		const newImages: ImageSchemaInfer[] = acceptedFiles.map((file) => ({
			file, // File object
			preview: URL.createObjectURL(file),
			isNew: true, // Mark as new image
		}));

		setImages((prevImages) => [...prevImages, ...newImages]);
	}, []);

	const removeImage = useCallback((index: number) => {
		setImages((prevImages) => {
			const updatedImages = [...prevImages];
			updatedImages.splice(index, 1);
			return updatedImages;
		});
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		// @ts-ignore
		accept: acceptedFileTypes.join(","),
		maxSize: maxFileSize,
	});
	const queryClient = useQueryClient();

	const form = useForm<ProductSchemaInfer>({
		resolver: zodResolver(ProductSchema),
		defaultValues: initialData
			? {
					name: initialData.name || "",
					description: initialData.description || "",
					category: initialData.categoryId || "",
					subCategory: initialData.subCategoryId || "",
					slug: initialData.slug || "",
				}
			: {
					name: "",
					description: "",
					category: "",
					subCategory: "",
				},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: async (formData: FormData) => {
			const { data } = initialData
				? await axios.patch(`${baseURL}/products`, formData)
				: await axios.post(`${baseURL}/products`, formData);
			return data;
		},
		onSuccess: (data: any) => {
			initialData
				? (window.location.href = `/dashboard/products`)
				: (window.location.href = `/dashboard/products/${data.slug}/variant/new`);

			queryClient.invalidateQueries({ queryKey: ["recentProducts"] });
			form.reset();
			toast.success(
				`${initialData ? "Product updated successfully" : "Product created successfully"}`
			);
		},
		onError: (err: any) => {
			const errorMessage =
				err.response?.data?.errors?.message || "Server error";
			toast.error("An error occurred", { description: errorMessage });
		},
	});

	const onSubmit = async (values: ProductSchemaInfer) => {
		if (!images.length) {
			toast.error("Please select an image");
			return;
		}

		const formData = new FormData();
		formData.append("name", values.name);
		formData.append("description", values.description);
		formData.append("categoryId", values.category);
		formData.append("SubCategoryId", values.subCategory);
		formData.append("slug", values.slug || "");

		// Process images
		const processedImages = await Promise.all(
			images.map(async (image) => {
				if (image.isNew) {
					// Compress new images (file is already a File object)
					return await compressImage(image.file);
				} else {
					// Fetch existing images from URL and convert to File object
					const response = await fetch(image.file);
					const blob = await response.blob();
					const file = new File([blob], "existing-image", { type: blob.type });
					return file;
				}
			})
		);

		// Append all images to formData
		processedImages.forEach((file) => {
			formData.append("images", file);
		});

		// Log formData for debugging
		for (const [key, value] of formData.entries()) {
			console.log(key, value);
		}

		// Submit the form data
		mutate(formData);
	};

	const handleKeyPress = (
		e:
			| React.KeyboardEvent<HTMLInputElement>
			| React.KeyboardEvent<HTMLTextAreaElement>
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
		}
	};

	const handleCategoryChange = (value: string) => {
		if (value !== selectedCategory) {
			setSelectedCategory(value);
			form.setValue("category", value);
			form.setValue("subCategory", "");
		}
	};

	if (isCategoriesLoading) {
		return (
			<div className="flex items-center justify-center p-6">
				<Loader2 className="h-6 w-6 animate-spin" />
			</div>
		);
	}

	if (categoriesError) {
		return (
			<div className="flex items-center justify-center p-6">
				<p className="text-red-500">
					Failed to load categories. Please try again.
				</p>
			</div>
		);
	}

	if (!categories.length) {
		return (
			<div className="flex flex-col">
				<p className="mb-4">
					Please add a category before you can upload a product.
				</p>
				<Link
					className={buttonVariants({
						size: "sm",
					})}
					href={`/dashboard/categories/new`}
				>
					Add category
				</Link>
			</div>
		);
	}

	return (
		<div className="flex justify-start flex-col w-full">
			<div className="flex justify-start mb-5">
				<BackButton />
			</div>
			<div className="flex justify-start gap-y-4 flex-col w-full">
				{initialData ? (
					<>
						<div className="flex items-center justify-between">
							<p className="text-xl font-bold">Edit Product</p>
							<DeleteItem slug={initialData.slug!} item="product" />
						</div>
					</>
				) : (
					<p className="text-xl font-bold">Create Product</p>
				)}
				<Separator className="bg-gray-400 mt-4 mb-7" />
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Name"
											{...field}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-between flex-col space-y-2 md:flex-row w-full md:space-x-2 md:space-y-0">
							<div className="w-full md:w-1/2">
								<FormField
									control={form.control}
									name="category"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Category</FormLabel>
											<FormControl>
												<Select
													onValueChange={handleCategoryChange}
													value={selectedCategory}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select Category" />
													</SelectTrigger>
													<SelectContent>
														{categories.map((category, index) => (
															<SelectItem
																key={index}
																value={category.id}
																className="capitalize"
															>
																{category.name.toLowerCase()}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage className="text-red-1" />
										</FormItem>
									)}
								/>
							</div>
							<div className="w-full md:w-1/2">
								<FormField
									control={form.control}
									name="subCategory"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Sub Category</FormLabel>
											<FormControl>
												<Select
													onValueChange={(value) =>
														form.setValue("subCategory", value)
													}
													value={form.getValues("subCategory")}
													disabled={!selectedCategory}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select sub category" />
													</SelectTrigger>
													<SelectContent>
														<ScrollArea className="h-[150px] w-full">
															{isSubCategoryLoading ? (
																<SelectItem value="loading" disabled>
																	Loading sub categories...
																</SelectItem>
															) : subCategories.length > 0 ? (
																subCategories
																	.sort((a, b) => a.name.localeCompare(b.name))
																	.map((sub) => (
																		<SelectItem key={sub.id} value={sub.id}>
																			{sub.name}
																		</SelectItem>
																	))
															) : (
																<SelectItem value="no-sub-categories" disabled>
																	No Sub category available
																</SelectItem>
															)}
														</ScrollArea>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="flex flex-col">
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Description"
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Properly describe your product description to convey it to
											the user.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col">
							<Label className="mb-4">Product Image</Label>
							<div
								{...getRootProps()}
								className={`border-2 border-dashed rounded-lg p-4 ${
									isDragActive ? "border-blue-500" : "border-gray-300"
								}`}
							>
								<input {...getInputProps()} />
								{isDragActive ? (
									<p>Drop the files here ...</p>
								) : (
									<div className="flex items-start justify-start">
										<div>
											<ImageIcon className="w-10 h-10" />
										</div>
										<div className="ml-4">
											<p className="text-sm">
												{isDragActive
													? "Drop the files here"
													: "Drag and drop files here or click to select"}
											</p>
											<p className="text-xs text-gray-500 mt-1">
												Accepted file types: PNG, JPEG, JPG. Max file size:
												10MB.
											</p>
										</div>
									</div>
								)}
								<div className="my-5 flex justify-start gap-4">
									{images.map((image, index) => (
										<div
											key={index}
											className="relative flex items-center mt-2"
										>
											<Image
												src={image.preview!}
												alt="Preview"
												height={80}
												width={80}
												className="w-16 h-16 object-cover rounded"
											/>
											<button
												onClick={() => removeImage(index)}
												className="absolute -top-2 -right-1 p-1 bg-red-500 text-white rounded-full"
											>
												<XIcon className="w-4 h-4" />
											</button>
										</div>
									))}
								</div>
							</div>
						</div>

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
		</div>
	);
});

ProductForm.displayName = "ProductForm";

export default ProductForm;
