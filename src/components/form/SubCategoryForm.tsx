"use client";
import { useRouter } from "next/navigation";
import React from "react";

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
import { CategoryType } from "@/src/db/schema";
import useMount from "@/src/hooks/use-mount";
import { baseURL } from "@/src/lib/constants";
import {
	CategoriesSchema,
	CategoriesSchemaInfer,
	SubCategoriesSchemaInfer,
} from "@/src/lib/validators/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DeleteItem from "../common/DeleteItem";
import LoadingButton from "../common/LoadingButton";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

interface SubCategoryFormProps {
	initialData?: CategoryType | null | undefined;
	categorySlug: string;
}

const SubCategoryForm = ({
	categorySlug,
	initialData,
}: SubCategoryFormProps) => {
	const router = useRouter();
	const mount = useMount();

	const form = useForm<SubCategoriesSchemaInfer>({
		resolver: zodResolver(CategoriesSchema),
		defaultValues: initialData
			? {
					name: initialData.name || "",
					description: initialData.description || "",
					slug: initialData.slug || "",
				}
			: {
					name: "",
					description: "",
				},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: async ({ name, description }: SubCategoriesSchemaInfer) => {
			const payload: SubCategoriesSchemaInfer = {
				name,
				description,
				categorySlug,
				slug: initialData ? initialData.slug! : "",
			};
			const { data } = initialData
				? await axios.patch(
						`${baseURL}/sub-categories/${initialData.slug}`,
						payload
					)
				: await axios.post(`${baseURL}/sub-categories`, payload);
			return data;
		},
		onSuccess: (data: any) => {
			window.location.href = `/dashboard/categories/
			${categorySlug}`;
			form.reset();
			return toast.success("Sub category created successfully");
		},
		onError: (err: any) => {
			const errorMessage =
				err.response?.data?.errors?.message || "Server error";
			toast.error("An error occurred", { description: errorMessage });
		},
	});

	function onSubmit(values: SubCategoriesSchemaInfer) {
		mutate(values);
		form.reset();
	}

	const handleKeyPress = (
		e:
			| React.KeyboardEvent<HTMLInputElement>
			| React.KeyboardEvent<HTMLTextAreaElement>
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
		}
	};

	if (!mount) return;

	return (
		<div className="flex justify-start flex-col w-full">
			<div className="flex justify-start gap-y-4 flex-col w-full">
				{initialData ? (
					<div className="flex items-center justify-between">
						<p className="text-xl font-semibold">Edit Sub Categories</p>
						<DeleteItem slug={initialData.slug!} item="categories" />
					</div>
				) : (
					<p className="text-xl font-semibold">Create Sub Categories</p>
				)}
				<Separator className="bg-gray-100 mb-7" />
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Description"
											{...field}
											rows={5}
											onKeyDown={handleKeyPress}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-center items-center gap-10">
							<LoadingButton
								type="submit"
								loading={isPending}
								className=" w-full"
							>
								Submit
							</LoadingButton>
							<Button
								type="button"
								onClick={() => router.back()}
								variant="default"
							>
								Discard
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default SubCategoryForm;
