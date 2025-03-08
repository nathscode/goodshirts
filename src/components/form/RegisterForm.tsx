"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { RegisterSchema, RegisterSchemaInfer } from "@/src/lib/validators/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import LoadingButton from "../common/LoadingButton";
type Props = {};

const RegisterForm = (props: Props) => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const form = useForm<RegisterSchemaInfer>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			phone: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const { mutate: register, isPending } = useMutation({
		mutationFn: async (values: RegisterSchemaInfer) => {
			const { data } = await axios.post("/api/auth/register", values);
			return data;
		},
		onSuccess: (data) => {
			if (data && data.email) {
				router.push(`/verify?email=${encodeURIComponent(data.email)}`);
				form.reset();
				toast.success("Account created successfully");
			} else {
				toast.error("Unexpected response from server");
			}
		},
		onError: (err: any) => {
			const errorMessage =
				err.response?.data?.errors?.message || "Server error";
			toast.error("An error occurred", { description: errorMessage });
		},
	});
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const onSubmit = (values: RegisterSchemaInfer) => {
		register(values);
	};

	return (
		<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
			<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4">
						<div className="space-y-4">
							<div className="flex justify-between flex-col space-y-2 md:flex-row w-full md:space-x-2 md:space-y-0">
								<div className="w-full md:w-1/2">
									<FormField
										control={form.control}
										name="firstName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>First Name</FormLabel>
												<FormControl>
													<Input
														type="text"
														disabled={form.formState.isSubmitting}
														placeholder="John Doe"
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
										name="lastName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Last Name</FormLabel>
												<FormControl>
													<Input
														type="text"
														disabled={form.formState.isSubmitting}
														placeholder="..."
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<Input
												type="text"
												disabled={form.formState.isSubmitting}
												placeholder="..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												disabled={form.formState.isSubmitting}
												placeholder="..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<div className="relative">
											<FormControl>
												<Input
													type={showPassword ? "text" : "password"}
													disabled={form.formState.isSubmitting}
													placeholder="Enter your password"
													{...field}
												/>
											</FormControl>
											<span className="absolute top-[10px] right-3">
												<button
													type="button"
													onClick={togglePasswordVisibility}
												>
													{showPassword ? (
														<Eye className="h-5 w-5" />
													) : (
														<EyeOff className="w-5 h-5" />
													)}{" "}
												</button>
											</span>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<div className="relative">
											<FormControl>
												<Input
													type={showPassword ? "text" : "password"}
													disabled={form.formState.isSubmitting}
													placeholder="Confirm password"
													{...field}
												/>
											</FormControl>
											<span className="absolute top-[10px] right-3">
												<button
													type="button"
													onClick={togglePasswordVisibility}
												>
													{showPassword ? (
														<Eye className="h-5 w-5" />
													) : (
														<EyeOff className="w-5 h-5" />
													)}{" "}
												</button>
											</span>
										</div>
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
							Register Now
						</LoadingButton>
						<p className="text-xs mt-2">
							By registering you accept our{" "}
							<Link href="/" className="text-brand hover:underline">
								Terms of Use &nbsp;
							</Link>
							and &nbsp;
							<Link href="/" className="text-brand hover:underline">
								Privacy &nbsp;
							</Link>
							and agree that we and our selected partners may contact you with
							relevant offers and services.
						</p>
					</form>
					<div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
						or
					</div>

					<p className="text-center text-sm text-gray-600 mt-2">
						Already have an account,&nbsp;
						<Link className="text-blue-500 hover:underline" href="/login">
							Login
						</Link>
					</p>
				</Form>
			</div>
		</div>
	);
};

export default RegisterForm;
