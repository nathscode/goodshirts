"use client";
import React, { startTransition, useTransition } from "react";
import { Button } from "@/src/components/ui/button";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { useRouter } from "next/navigation";
import LoadingButton from "../common/LoadingButton";
import { OrderStatusTypes } from "@/src/lib/constants";
import {
	orderUpdateSchema,
	orderUpdateSchemaInfer,
} from "@/src/lib/validators/order";
import { toast } from "sonner";
import { dashboardOrdersUpdate } from "@/src/actions/dashboardOrdersUpdate";

type Props = {
	orderId: string;
	orderNumber: string;
};

const OrderUpdate = ({ orderId, orderNumber }: Props) => {
	const [isLoading, startTransition] = useTransition();
	const router = useRouter();
	const form = useForm<orderUpdateSchemaInfer>({
		resolver: zodResolver(orderUpdateSchema),
		defaultValues: {
			status: "",
			orderId: orderId,
		},
	});
	function onSubmit(values: orderUpdateSchemaInfer) {
		startTransition(async () => {
			const result = await dashboardOrdersUpdate(values);
			if (result?.status! === "success") {
				toast.success(`${result?.message}`);
			} else {
				toast.error("An error occurred", { description: result?.message });
			}
			router.refresh();
			window.location.reload();
		});
		form.reset();
	}
	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="default" size="sm" disabled={false}>
						<span className="inline-flex items-center text-brand">
							<span className="text-sm ">Update status</span>
						</span>
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Your about to Update this order:{" "}
							<span className="uppercase"> {orderNumber}</span>
						</DialogTitle>
					</DialogHeader>
					<div className="flex items-start flex-col  w-full justify-start">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4 w-full"
							>
								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Status </FormLabel>
											<FormControl>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select Status" />
													</SelectTrigger>
													<SelectContent>
														{OrderStatusTypes.map((type) => (
															<SelectItem
																key={type}
																value={type}
																className="uppercase"
															>
																{type}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<LoadingButton
									variant={"default"}
									type="submit"
									loading={isLoading}
									className="mt-6 w-full"
								>
									Submit
								</LoadingButton>
							</form>
						</Form>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default OrderUpdate;
