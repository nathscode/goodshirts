import LoadingButton from "@/src/components/common/LoadingButton";
import { Button } from "@/src/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/ui/dialog";
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
import { useCities } from "@/src/hooks/use-cities";
import { useStates } from "@/src/hooks/use-states";
import { addressesTypes } from "@/src/lib/constants";
import {
	AddressSchema,
	AddressSchemaInfer,
} from "@/src/lib/validators/address";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";

const AddressForm = () => {
	const router = useRouter();
	const [selectedState, setSelectedState] = useState<string>("");
	const { states, loading: statesLoading, error: statesError } = useStates();
	const {
		cities,
		loading: citiesLoading,
		error: citiesError,
	} = useCities(selectedState);

	const form = useForm<AddressSchemaInfer>({
		resolver: zodResolver(AddressSchema),
		defaultValues: {
			addressType: "",
			phoneNumber: "",
			landmark: "",
			city: "",
			state: "",
			address: "",
			postalCode: "",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: async (values: AddressSchemaInfer) => {
			const { data } = await axios.post("/api/address", values);
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

	function onSubmit(values: AddressSchemaInfer) {
		mutate(values);
		form.reset();
	}

	const handleStateChange = (value: string) => {
		if (value !== selectedState) {
			setSelectedState(value); // Update local state
			form.setValue("state", value);
			form.setValue("city", ""); // Reset city when state changes
		}
	};

	useEffect(() => {
		if (selectedState) {
			form.setValue("state", selectedState);
		}
	}, [selectedState, form]);

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant="ghost"
						size="lg"
						className="text-red-500"
						disabled={false}
					>
						<span className="inline-flex items-center text-red-500">
							<Plus className="h-5 w-5 mr-2" />
							<span className="text-sm ">Add address</span>
						</span>
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add address</DialogTitle>
					</DialogHeader>
					<div className="flex items-start flex-col  w-full justify-start">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4 w-full"
							>
								<div className="flex justify-between flex-col space-y-2 md:flex-row w-full md:space-x-2 md:space-y-0">
									<div className="w-full md:w-1/2">
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
																			<SelectItem
																				key={state.code}
																				value={state.name}
																			>
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
									<div className="w-full md:w-1/2">
										<FormField
											control={form.control}
											name="city"
											render={({ field }) => (
												<FormItem>
													<FormLabel>City</FormLabel>
													<FormControl>
														<Select
															onValueChange={(value) =>
																form.setValue("city", value)
															}
															value={form.getValues("city")} // Use getValues instead of watch
															disabled={!selectedState}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select City" />
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
								<div className="flex justify-between flex-col space-y-2 md:flex-row w-full md:space-x-2 md:space-y-0">
									<div className="w-full md:w-1/2">
										<FormField
											control={form.control}
											name="addressType"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Address Type</FormLabel>
													<FormControl>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Address Type" />
															</SelectTrigger>
															<SelectContent>
																{Object.values(addressesTypes).map((type) => (
																	<SelectItem
																		key={type}
																		value={type}
																		className="capitalize"
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
									</div>
									<div className="w-full md:w-1/2">
										<FormField
											control={form.control}
											name="postalCode"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Postal Code (Optional)</FormLabel>
													<FormControl>
														<Input type="text" placeholder="10001" {...field} />
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
										name="phoneNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone Number </FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Phone Number"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="w-full">
									<FormField
										control={form.control}
										name="landmark"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Landmark (Popular place near you)</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Popular place near you"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="flex flex-col">
									<FormField
										control={form.control}
										name="address"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Your address"
														className="resize-none"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Properly describe your address or place for pick up.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<LoadingButton
									type="submit"
									loading={isPending}
									className="mt-6 w-full"
								>
									Add Address
								</LoadingButton>
							</form>
						</Form>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
export default AddressForm;
