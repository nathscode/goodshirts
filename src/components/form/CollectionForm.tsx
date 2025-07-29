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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/src/components/ui/popover";
import { Textarea } from "@/src/components/ui/textarea";
import {
	CollectionType,
	ProductWithExtra,
	ProductWithMedia,
} from "@/src/db/schema";
import { baseURL } from "@/src/lib/constants";
import { cn, compressImage } from "@/src/lib/utils";
import {
	collectionSchema,
	collectionSchemaInfer,
} from "@/src/lib/validators/collection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CalendarIcon, ImageIcon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import BackButton from "../common/BackButton";
import LoadingButton from "../common/LoadingButton";
import { Button } from "../ui/button";
import { MultiSelectCombobox } from "../ui/mult-select-combo";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from "../ui/label";

interface CollectionFormProps {
	initialData?: CollectionType | null;
	products: ProductWithExtra[];
	existingProductIds?: string[];
}

const CollectionForm = ({
	initialData,
	products,
	existingProductIds = [],
}: CollectionFormProps) => {
	const router = useRouter();
	const [image, setImage] = useState<File>();

	const {
		getRootProps: getRootProps,
		getInputProps: getInputProps,
		isDragActive: isDragActive,
		acceptedFiles: acceptedFiles,
	} = useDropzone({
		accept: {
			"image/png": [".png"],
			"image/jpeg": [".jpg", ".jpeg"],
			"image/webp": [".webp"],
		},
		maxSize: 10 * 1024 * 1024, // 10MB
		onDrop: (acceptedFiles) => {
			setImage(acceptedFiles[0]);
		},
	});

	const form = useForm<collectionSchemaInfer>({
		resolver: zodResolver(collectionSchema),
		defaultValues: initialData
			? {
					name: initialData.name || "",
					slug: initialData.slug || "",
					description: initialData.description || "",
					isActive: initialData.isActive ?? true,
					startDate: initialData.startDate
						? new Date(initialData.startDate).toISOString().split("T")[0]
						: "",
					endDate: initialData.endDate
						? new Date(initialData.endDate).toISOString().split("T")[0]
						: "",
					productIds: existingProductIds,
				}
			: {
					name: "",
					description: "",
					startDate: "",
					endDate: "",
					productIds: [],
				},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: async (formData: FormData) => {
			const response = initialData
				? await axios.patch(
						`${baseURL}/collections/${initialData.slug}`,
						formData
					)
				: await axios.post(`${baseURL}/collections`, formData);
			return response.data;
		},
		onSuccess: (data) => {
			if (data && data.status === "success") {
				router.push(`/dashboard/collections`);
				form.reset();
				toast.success(
					initialData?.slug
						? "Collection created successfully"
						: "Collection updated successfully"
				);
			} else {
				console.error("Unexpected response structure:", data);
				toast.error("Unexpected response from server");
				window.location.reload();
			}
		},
		onError: (err: any) => {
			const errorMessage =
				err.response?.data?.errors?.message || "Server error";
			toast.error("An error occurred", { description: errorMessage });
		},
	});

	const onSubmit = async (values: collectionSchemaInfer) => {
		if (values.productIds?.length === 0) {
			toast.error("Please select at least a product");
			return;
		}
		if (!image) {
			toast.error("Please select an image");
			return;
		}
		const formData = new FormData();
		formData.append("name", values.name);
		formData.append("description", values.description!);
		formData.append("startDate", values.startDate!.toString());
		formData.append("endDate", values.endDate!.toString());
		formData.append("slug", values.slug || "");
		formData.append("productIds", JSON.stringify(values.productIds));
		try {
			const compressImaged = (await compressImage(image)) as File;
			formData.append("image", compressImaged);
		} catch (error) {
			console.error("Error compressing image:", error);
			toast.error("Failed to compress image");
			return;
		}
		mutate(formData);
		form.reset();
	};

	// Convert products to the expected format
	const productOptions = products.map((product) => ({
		value: product.id,
		label: product.name,
		imageUrl: product.medias?.[0]?.url ?? "/images/placeholder-image.png",
	}));

	const renderProduct = (option: (typeof productOptions)[0]) => (
		<div className="flex items-center gap-2">
			<div className="relative w-10 h-10 overflow-hidden bg-slate-300 rounded-md">
				<Image
					className="object-cover w-full h-full rounded-md"
					src={option.imageUrl}
					alt={"Product image"}
					fill
				/>
			</div>
			<span>{option.label}</span>
		</div>
	);

	const renderSelectedProducts = (value: string[]) => (
		<div className="flex -space-x-2">
			{value.map((id) => {
				const product = productOptions.find((p) => p.value === id);
				if (!product) return null;
				return (
					<div
						key={id}
						className="relative w-8 h-8 overflow-hidden rounded-full border-2 border-background"
					>
						<Image
							className="object-cover w-full h-full rounded-full"
							src={product.imageUrl}
							alt={product.label}
							fill
						/>
					</div>
				);
			})}
		</div>
	);

	return (
		<div className="flex flex-col w-full">
			<div className="mb-5">
				<BackButton />
			</div>
			<p className="text-xl font-bold">
				{initialData ? "Edit Collection" : "Create Collection"}
			</p>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="Collection Name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea placeholder="Collection Description" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-between flex-col space-y-2 md:flex-row w-full md:space-x-2 md:space-y-0">
						<div className="w-full md:w-1/2">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Start Date</FormLabel>
										<FormControl>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{field.value
															? moment(field.value).format(
																	"MMM DD, YYYY hh:mm A"
																) // Show Local Time
															: "Pick a date and time"}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Datetime
														value={field.value ? moment(field.value) : ""}
														onChange={(value) => {
															if (moment.isMoment(value)) {
																const localDateTime = value.format(
																	"YYYY-MM-DD HH:mm:ss"
																);
																field.onChange(localDateTime);
															}
														}}
														dateFormat="YYYY-MM-DD"
														timeFormat="HH:mm"
														isValidDate={(current) =>
															current.isSameOrAfter(moment().startOf("day"))
														}
													/>
												</PopoverContent>
											</Popover>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="w-full md:w-1/2">
							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>End Date</FormLabel>
										<FormControl>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{field.value
															? moment(field.value).format(
																	"MMM DD, YYYY hh:mm A"
																) // Show Local Time
															: "Pick a date and time"}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Datetime
														value={field.value ? moment(field.value) : ""}
														onChange={(value) => {
															if (moment.isMoment(value)) {
																const localDateTime = value.format(
																	"YYYY-MM-DD HH:mm:ss"
																);
																field.onChange(localDateTime);
															}
														}}
														dateFormat="YYYY-MM-DD"
														timeFormat="HH:mm"
														isValidDate={(current) =>
															current.isSameOrAfter(moment().startOf("day"))
														}
													/>
												</PopoverContent>
											</Popover>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-col">
						<Label className="mb-4">Product Image</Label>
						{initialData?.image && (
							<div className="relative shrink-0 w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] overflow-hidden bg-slate-300 rounded-md my-4">
								<Image
									className="object-cover w-full h-full rounded-md"
									src={initialData.image}
									alt="order"
									fill
								/>
							</div>
						)}
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
											Accepted file types: PNG, JPEG, JPG. Max file size: 10MB.
										</p>
									</div>
								</div>
							)}
							{acceptedFiles.length > 0 && (
								<Image
									src={URL.createObjectURL(acceptedFiles[0])}
									alt="Preview"
									height={14}
									width={14}
									className="h-14 w-14 object-cover"
								/>
							)}
						</div>
					</div>
					<FormField
						control={form.control}
						name="productIds"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Products</FormLabel>
								<FormControl>
									<MultiSelectCombobox
										label="Select Products"
										options={productOptions}
										value={field.value || []}
										onChange={(value) => form.setValue("productIds", value)}
										renderItem={renderProduct}
										renderSelectedItem={renderSelectedProducts}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<LoadingButton
						type="submit"
						loading={isPending}
						className="mt-6 w-full"
					>
						{initialData ? "Update Collection" : "Create Collection"}
					</LoadingButton>
				</form>
			</Form>
		</div>
	);
};

export default CollectionForm;
