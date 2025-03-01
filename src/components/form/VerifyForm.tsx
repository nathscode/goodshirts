"use client";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
	VerifyEmailSchema,
	VerifyEmailSchemaInfer,
} from "@/src/lib/validators/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import LoadingButton from "../common/LoadingButton";
import { useEffect, useState } from "react";
type Props = {};

const VerifyForm = (props: Props) => {
	const [countdown, setCountdown] = useState(60); // 60 seconds
	const [canResend, setCanResend] = useState(false); // Whether resend is allowed

	const router = useRouter();
	const searchParam = useSearchParams();
	const userEmail = searchParam.get("email");

	const form = useForm<VerifyEmailSchemaInfer>({
		resolver: zodResolver(VerifyEmailSchema),
		defaultValues: {
			verificationCode: "",
			email: userEmail!,
		},
	});

	const { mutate: verify, isPending } = useMutation({
		mutationFn: async (values: VerifyEmailSchemaInfer) => {
			const { data } = await axios.post("/api/auth/verify", values);
			return data;
		},
		onSuccess: (data) => {
			if (data.verified) {
				router.push("/login");
				toast.success("Account verified successfully");
			}
		},
		onError: (err: any) => {
			const errorMessage =
				err.response?.data?.errors?.message || "Server error";
			toast.error("An error occurred", { description: errorMessage });
		},
	});
	const onSubmit = (values: VerifyEmailSchemaInfer) => verify(values);
	function resendCode() {
		if (!userEmail) {
			toast.error("userEmail not found");
			return;
		}

		axios
			.post("/api/auth/resend", { email: userEmail })
			.then((response) => {
				if (response.data.success) {
					toast.success("Verification code resent successfully");
				} else {
					toast.error("Failed to resend verification code");
				}
			})
			.catch((err) => {
				const errorMessage =
					err.response?.data?.errors?.message || "Server error";
				toast.error("An error occurred", { description: errorMessage });
			});
	}
	useEffect(() => {
		if (countdown > 0 && !canResend) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer); // Cleanup the timer on unmount
		} else if (countdown === 0) {
			setCanResend(true); // Enable the resend button
		}
	}, [countdown, canResend]);

	return (
		<div className="flex justify-start flex-col w-full mt-5">
			<div className="flex justify-start gap-y-4 flex-col md:flex-row w-full">
				<div className="flex flex-col flex-1 shadow-sm rounded-lg px-5 py-8 border bg-white w-full">
					<h2 className="text-2xl font-semibold leading-tight text-foreground sm:text-2xl">
						Confirm your Email address
					</h2>
					<p className="prose-sm my-2">
						We have sent email to <strong>{userEmail}</strong>
					</p>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="w-full mt-4"
						>
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="verificationCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Verification Code</FormLabel>
											<FormControl>
												<Input placeholder="" {...field} />
											</FormControl>
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
								Verify
							</LoadingButton>
						</form>

						<p className="text-center text-sm text-gray-600 mt-2">
							If you did not receive the code?
							{canResend ? (
								<Button
									variant="link"
									className="text-brand hover:underline"
									onClick={resendCode}
								>
									Resend code
								</Button>
							) : (
								<span className="text-red-500 font-semibold">
									Resend code in {countdown}s
								</span>
							)}
						</p>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default VerifyForm;
