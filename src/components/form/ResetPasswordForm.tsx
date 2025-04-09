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
import {
	ResetPasswordSchema,
	ResetPasswordSchemaInfer,
} from "@/src/lib/validators/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import LoadingButton from "../common/LoadingButton";

type Props = {
	token: string;
};
const ResetPasswordForm = ({ token }: Props) => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const form = useForm<ResetPasswordSchemaInfer>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
			token: token,
		},
	});

	const { mutate: ResetPasswordFunc, isPending } = useMutation({
		mutationFn: async ({
			password,
			confirmPassword,
			token,
		}: ResetPasswordSchemaInfer) => {
			const { data } = await axios.post("/api/auth/password/complete", {
				password,
				confirmPassword,
				token,
			});
			return data;
		},
	});

	function onSubmit(values: ResetPasswordSchemaInfer) {
		ResetPasswordFunc(
			{
				password: values.password,
				confirmPassword: values.confirmPassword,
				token: values.token,
			},
			{
				onSuccess: () => {
					router.push("/login");
					toast.success("Password Reset Successfully");
				},
				onError: (err: any) => {
					const errorMessage =
						err.response?.data?.errors?.message || "Server error";
					toast.error("An error occurred", { description: errorMessage });
				},
			}
		);
	}
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	return (
		<div className="flex justify-start flex-col w-full">
			<div className="flex justify-start gap-y-4 flex-col md:flex-row w-full">
				<div className="flex flex-col flex-1 shadow-sm rounded-lg px-5 py-8 border bg-white w-full">
					<h2 className="text-2xl font-semibold leading-tight text-foreground sm:text-2xl">
						Reset Password
					</h2>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="w-full mt-4"
						>
							<div className="space-y-4">
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
								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirm password</FormLabel>
											<div className="relative">
												<FormControl>
													<Input
														type={showPassword ? "text" : "password"}
														placeholder="Confirm password"
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
							<LoadingButton
								type="submit"
								loading={isPending}
								className="mt-6 w-full"
							>
								Reset Password
							</LoadingButton>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordForm;
