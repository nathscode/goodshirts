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
import { ReviewSchema, ReviewSchemaInfer } from "@/src/lib/validators/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import StarRatingButton from "../StarRatingButton";
import LoadingButton from "../common/LoadingButton";
import { Textarea } from "../ui/textarea";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
	image: string;
	productId: string;
	name: string;
	lastName: string;
};

const RatingForm = ({ image, productId, name, lastName }: Props) => {
	const router = useRouter();
	const form = useForm<ReviewSchemaInfer>({
		resolver: zodResolver(ReviewSchema),
		defaultValues: {
			productId: productId,
			rating: 0,
			title: "",
			name: lastName,
			comment: "",
		},
	});
	const rating = form.watch("rating");

	const { mutate, isPending } = useMutation({
		mutationFn: async (values: ReviewSchemaInfer) => {
			const { data } = await axios.post("/api/reviews", values);
			return data;
		},
		onSuccess: (data) => {
			if (data && data.status === "success") {
				router.push("/customer/reviews");
				form.reset();
				toast.success("Review submitted successfully");
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

	function onSubmit(values: ReviewSchemaInfer) {
		if (values.rating === 0) {
			toast.error("Please select a rating before submitting");
			return;
		}
		mutate(values);
	}
	return (
		<div className="flex flex-col w-full">
			<div className="my-4">
				<h1 className="text-base uppercase">
					Select the stars to rate the product
				</h1>
			</div>
			<div className="flex justify-start items-start w-full">
				<div className="relative shrink-0 w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] overflow-hidden bg-slate-300 rounded-md">
					<Image
						className="object-cover w-full h-full rounded-md"
						src={image ?? "/images/placeholder-image.png"}
						alt={"order"}
						fill
					/>
				</div>
				<div className="justify-start ms-5 w-full">
					<div className="flex flex-col max-w-xs mt-0">
						<h1 className="text-base font-me leading-relaxed line-clamp-2 text-foreground capitalize">
							{name}
						</h1>
						<div className="my-2">
							<StarRatingButton
								rating={rating!}
								onRating={(value: number) => form.setValue("rating", value)}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col mt-5">
				<h1 className="uppercase border-b py-2">Leave a review</h1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 w-full mt-4"
					>
						<div className="flex justify-between flex-col space-y-2 md:flex-row w-full md:space-x-2 md:space-y-0">
							<div className="w-full md:w-1/2">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl>
												<Input
													className="border-black rounded-none uppercase"
													placeholder="E.g Great, Awesome, Fantastic etc"
													disabled={form.formState.isSubmitting}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="w-full md:w-1/2">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input
													className="border-black rounded-none uppercase"
													placeholder="Enter full name"
													disabled={form.formState.isSubmitting}
													{...field}
													value={lastName}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="flex flex-col w-full">
							<FormField
								control={form.control}
								name="comment"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Comment</FormLabel>
										<FormControl>
											<Textarea
												className="border-black rounded-none uppercase"
												placeholder="Tell us about your rating"
												id="comment"
												disabled={form.formState.isSubmitting}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col w-full mt-2">
							<LoadingButton
								type="submit"
								loading={isPending}
								className="mt-6 uppercase w-auto text-xs rounded-none font-semibold px-8 py-[22px]"
							>
								Submit your review
							</LoadingButton>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default RatingForm;
