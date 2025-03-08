"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { loginUser } from "@/src/actions/user.action";
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
import { normalizeEmail } from "@/src/lib/utils";
import { LoginSchema, LoginSchemaInfer } from "@/src/lib/validators/auth";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import LoadingButton from "../common/LoadingButton";
type Props = {};

const LoginForm = (props: Props) => {
	const params = useSearchParams();
	const callbackUrl = params.get("callbackUrl");
	const router = useRouter();
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const form = useForm<LoginSchemaInfer>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { mutate: login, isPending } = useMutation({
		mutationFn: async (values: LoginSchemaInfer) => {
			const data = await loginUser({
				email: normalizeEmail(values.email),
				password: values.password,
			});
			return data;
		},
		onSuccess: async (data) => {
			if (data.success) {
				router.push("/customer/account");
				toast.success("Login successful");
			} else {
				toast.error("An error occurred", { description: data.message });
			}
		},
	});
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const onSubmit = (values: LoginSchemaInfer) => login(values);
	return (
		<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
			<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4">
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="font-semibold">Email</FormLabel>
										<FormControl>
											<Input
												disabled={form.formState.isSubmitting}
												placeholder="mail@example.com"
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
										<FormLabel className="font-semibold">Password</FormLabel>
										<div className="relative">
											<FormControl>
												<Input
													type={showPassword ? "text" : "password"}
													placeholder="Enter your password"
													disabled={form.formState.isSubmitting}
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
						<div className="mt-5 flex justify-end w-full">
							<Button variant="link" className="hover:underline" asChild>
								<Link href="/account/forgot-password">Forget Password</Link>
							</Button>
						</div>
						<LoadingButton
							type="submit"
							loading={isPending}
							className="mt-6 w-full"
						>
							Log in
						</LoadingButton>
					</form>
					<div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
						or
					</div>

					<p className="text-center text-sm text-gray-600 mt-2">
						If you don&apos;t have an account, please&nbsp;
						<Link
							className="text-black font-semibold hover:underline"
							href="/register"
						>
							Sign up
						</Link>
					</p>
				</Form>
			</div>
		</div>
	);
};

export default LoginForm;
