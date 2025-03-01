import { SiteLogo } from "@/src/components/SiteLogo";
import VerifyForm from "@/src/components/form/VerifyForm";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Verify your Email",
};

const VerificationPage = async () => {
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
							Verify your account
						</h2>
						<p className="mt-2 text-center text-base leading-5">
							Go to your mail inbox and enter the verification code sent to you.
						</p>
					</div>
					<VerifyForm />
				</div>
			</div>
		</div>
	);
};

export default VerificationPage;
