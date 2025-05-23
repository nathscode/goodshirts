"use client";
import { Button } from "@/src/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { Input } from "@/src/components/ui/input";
import useCartStore from "@/src/hooks/use-cart";
import { useCities } from "@/src/hooks/use-cities";
import { useGuestUserInfoStore } from "@/src/hooks/use-guest-user";
import { useLgas } from "@/src/hooks/use-lgas";
import { useStates } from "@/src/hooks/use-states";
import {
	GuestUserSchema,
	GuestUserSchemaInfer,
} from "@/src/lib/validators/order";
import { E164Number } from "libphonenumber-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CustomPhoneInput } from "../ui/phone-input";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

type Props = {};

const GuestForm = (props: Props) => {
	const [selectedState, setSelectedState] = useState<string>("");
	const { states, loading: statesLoading, error: statesError } = useStates();
	const [phoneNumber, setPhoneNumber] = useState<E164Number>();
	const { setGuestUserInfo, guestUserInfo } = useGuestUserInfoStore();
	const router = useRouter();
	const {
		cities,
		loading: citiesLoading,
		error: citiesError,
	} = useCities(selectedState);
	const {
		lgas,
		loading: lgasLoading,
		error: lgasError,
	} = useLgas(selectedState);
	const form = useForm<GuestUserSchemaInfer>({
		resolver: zodResolver(GuestUserSchema),
		defaultValues: {
			email: "",
			phoneNumber: "",
			whatsappNumber: "",
			firstName: "",
			lastName: "",
			state: "",
			lga: "",
			city: "",
			streetAddress: "",
		},
	});

	useEffect(() => {
		form.setValue("phoneNumber", phoneNumber ?? "");
	}, [phoneNumber, form]);

	const handleStateChange = (value: string) => {
		if (value !== selectedState) {
			setSelectedState(value);
			form.setValue("state", value);
			form.setValue("city", "");
			form.setValue("lga", "");
		}
	};
	const onSubmit = async (values: GuestUserSchemaInfer) => {
		try {
			setGuestUserInfo({
				email: values.email,
				phoneNumber: values.phoneNumber,
				whatsappNumber: values.whatsappNumber,
				firstName: values.firstName,
				lastName: values.lastName,
				state: values.state,
				lga: values.lga,
				city: values.city,
				streetAddress: values.streetAddress,
			});
			const paymentType = useCartStore.getState().paymentType;
			if (!paymentType) {
				toast.error("Please select a payment option");
				return;
			}
			setTimeout(() => {
				router.push("/checkout/pay");
			}, 50);
		} catch (error) {
			console.error("Error saving guest info:", error);
			toast.error("Failed to save shipping information. Please try again.");
		}
	};
	const onFormError: SubmitErrorHandler<GuestUserSchemaInfer> = (e: any) => {
		console.log(e);
	};
	return (
		<div className="flex justify-start flex-col w-full">
			<div className="flex justify-start gap-y-4 flex-col w-full">
				<div className="flex justify-between items-center w-full">
					<div className="justify-start">
						<p className="text-xl font-bold">Shipping Address</p>
					</div>
					<div className="justify-end">
						<Link href="/login" className="hover:underline">
							Log in
						</Link>
					</div>
				</div>

				<Separator className="bg-gray-400 mt-4 mb-7" />
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, onFormError)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-between flex-col space-y-2 md:flex-row w-full md:space-x-2 md:space-y-0">
							<div className="w-full md:w-1/2">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="w-full md:w-1/2">
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="w-full">
							<FormField
								control={form.control}
								name="state"
								render={({ field }) => (
									<FormItem>
										<FormLabel>State</FormLabel>
										<FormControl>
											<Select
												onValueChange={handleStateChange}
												value={selectedState} // Use local state instead of form.watch
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select State" />
												</SelectTrigger>
												<SelectContent>
													<ScrollArea className="h-[150px] w-full">
														{statesLoading ? (
															<SelectItem value="loading" disabled>
																Loading states...
															</SelectItem>
														) : states.length > 0 ? (
															states.map((state) => (
																<SelectItem key={state.code} value={state.name}>
																	{state.name}
																</SelectItem>
															))
														) : (
															<SelectItem value="no-states" disabled>
																No states available
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
						<div className="flex justify-between flex-col space-y-2 md:flex-row w-full md:space-x-2 md:space-y-0">
							<div className="w-full md:w-1/2">
								<FormField
									control={form.control}
									name="lga"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City</FormLabel>
											<FormControl>
												<Select
													onValueChange={(value) => form.setValue("lga", value)}
													value={form.getValues("lga")} // Use getValues instead of watch
													disabled={!selectedState}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select City" />
													</SelectTrigger>
													<SelectContent>
														<ScrollArea className="h-[150px] w-full">
															{lgasLoading ? (
																<SelectItem value="loading" disabled>
																	Loading cities...
																</SelectItem>
															) : lgas.length > 0 ? (
																lgas
																	.sort((a, b) => a.localeCompare(b))
																	.map((lga) => (
																		<SelectItem key={lga} value={lga}>
																			{lga}
																		</SelectItem>
																	))
															) : (
																<SelectItem value="no-cities" disabled>
																	No cities available
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
							<div className="w-full md:w-1/2">
								<FormField
									control={form.control}
									name="city"
									render={({ field }) => (
										<FormItem>
											<FormLabel>District</FormLabel>
											<FormControl>
												<Select
													onValueChange={(value) =>
														form.setValue("city", value)
													}
													value={form.getValues("city")} // Use getValues instead of watch
													disabled={!selectedState}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select District" />
													</SelectTrigger>
													<SelectContent>
														<ScrollArea className="h-[150px] w-full">
															{citiesLoading ? (
																<SelectItem value="loading" disabled>
																	Loading cities...
																</SelectItem>
															) : cities.length > 0 ? (
																cities
																	.sort((a, b) => a.localeCompare(b))
																	.map((city) => (
																		<SelectItem key={city} value={city}>
																			{city}
																		</SelectItem>
																	))
															) : (
																<SelectItem value="no-cities" disabled>
																	No cities available
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
								name="streetAddress"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Street Address</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Your address"
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Properly describe your street address or place for pick
											up.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col w-full">
							<FormField
								control={form.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<CustomPhoneInput
												phoneNumber={phoneNumber}
												onPhoneNumberChange={setPhoneNumber}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col w-full">
							<FormField
								control={form.control}
								name="whatsappNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>WhatsApp Number</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="For backup contact number in logistics delivery"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col w-full my-5">
							<Button>Continue</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default GuestForm;
