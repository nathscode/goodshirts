"use client";
import { zodResolver } from "@hookform/resolvers/zod";
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
	ResetPasswordEmailSchema,
	ResetPasswordEmailSchemaInfer,
} from "@/src/lib/validators/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import LoadingButton from "../common/LoadingButton";

const ResetPasswordEmailForm = () => {
	const router = useRouter();

	const form = useForm<ResetPasswordEmailSchemaInfer>({
		resolver: zodResolver(ResetPasswordEmailSchema),
		defaultValues: {
			email: "",
		},
	});

	const { mutate: ResetPasswordEmailFunc, isPending } = useMutation({
		mutationFn: async ({ email }: ResetPasswordEmailSchemaInfer) => {
			const { data } = await axios.post("/api/auth/password/reset", {
				email,
			});
			return data;
		},
	});

	function onSubmit(values: ResetPasswordEmailSchemaInfer) {
		ResetPasswordEmailFunc(
			{
				email: values.email,
			},
			{
				onSuccess: () => {
					router.push("/login");
					toast.success("Reset Email Sent Successfully");
				},
				onError: (err: any) => {
					const errorMessage =
						err.response?.data?.errors?.message || "Server error";
					toast.error("An error occurred", { description: errorMessage });
				},
			}
		);
		form.reset();
	}
	return (
		<div className="flex justify-center flex-col w-full">
			<div className="flex justify-center gap-y-4 flex-col md:flex-row w-full">
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
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
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
							</div>
							<LoadingButton
								type="submit"
								loading={isPending}
								className="mt-6 w-full"
							>
								Send Password Reset Link
							</LoadingButton>
						</form>
						<div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
							or
						</div>

						<p className="text-center text-sm text-gray-600 mt-2">
							Go back
							<Link className="text-brand hover:underline ml-2" href="/login">
								Log in
							</Link>
						</p>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordEmailForm;
