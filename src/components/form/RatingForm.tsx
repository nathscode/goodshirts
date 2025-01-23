"use client";

import React, { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReviewSchema, ReviewSchemaInfer } from "@/lib/validations/review";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import StarRatingButton from "../StarRatingButton";
import { Textarea } from "../ui/textarea";
import LoadingButton from "../common/LoadingButton";
import { useRouter } from "next/navigation";

type Props = {};

const RatingForm = (props: Props) => {
	const [isLoading, startTransition] = useTransition();
	const router = useRouter();
	const form = useForm<ReviewSchemaInfer>({
		resolver: zodResolver(ReviewSchema),
		defaultValues: {
			rating: 1,
			title: "",
			name: "",
			message: "",
		},
	});
	const rating = form.watch("rating");

	function onSubmit(values: ReviewSchemaInfer) {
		console.log(values);
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
						src={"/images/placeholder-image.png"}
						alt={"order"}
						fill
					/>
				</div>
				<div className="justify-start ms-5 w-full">
					<div className="flex flex-col max-w-xs mt-0">
						<h1 className="text-base font-me leading-relaxed line-clamp-2 text-foreground">
							Sweatshirt
						</h1>
						<div className="my-2">
							<StarRatingButton
								rating={rating}
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
													placeholder="Enter Title"
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
													{...field}
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
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Message</FormLabel>
										<FormControl>
											<Textarea
												className="border-black rounded-none uppercase"
												placeholder="Tell us about your rating"
												id="message"
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
								loading={isLoading}
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
