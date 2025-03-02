export const dynamic = "force-dynamic";
import getCurrentUser from "@/src/actions/getCurrentUser";
import PaymentClient from "./PaymentClient";
import { redirect } from "next/navigation";
const PaymentPage = async () => {
	const session = await getCurrentUser();
	if (!session) return redirect("/login");
	return (
		<div className="min-h-screen py-10">
			<div className="flex justify-center items-center flex-col w-full">
				<div className="flex flex-col items-center justify-center w-full max-w-lg">
					<div className="flex flex-col justify-center items-center w-full">
						<PaymentClient email={session.email!} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentPage;
