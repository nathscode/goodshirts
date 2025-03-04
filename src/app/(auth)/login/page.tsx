import getCurrentUser from "@/src/actions/getCurrentUser";
import { SiteLogo } from "@/src/components/SiteLogo";
import LoginForm from "@/src/components/form/LoginForm";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Login",
};

const LoginPage = async () => {
	return (
		<div className="bg-slate-100 min-h-screen py-10">
			<div className="flex justify-center items-center flex-col w-full">
				<div className="flex flex-col items-center justify-center w-full max-w-lg">
					<div className="flex flex-col justify-center items-center w-full">
						<div className="flex-initial justify-center items-center">
							<Link
								href="/"
								aria-label="africagoodshirts"
								title="africagoodshirts"
								className="inline-flex items-center lg:mx-auto"
							>
								<SiteLogo className="w-20" />
							</Link>
						</div>
						<h2 className="text-center text-xl leading-9 font-semibold text-gray-900">
							Welcome to Africagoodshirts
						</h2>
						<p className="mt-2 text-center text-base leading-5">
							Sign in to your account
						</p>
					</div>
					<LoginForm />
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
