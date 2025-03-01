import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import React from "react";
import PaymentClient from "./PaymentClient";

const PaymentPage = async () => {
	return (
		<div className="min-h-screen py-10">
			<div className="flex justify-center items-center flex-col w-full">
				<div className="flex flex-col items-center justify-center w-full max-w-lg">
					<div className="flex flex-col justify-center items-center w-full">
						<PaymentClient />
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentPage;
