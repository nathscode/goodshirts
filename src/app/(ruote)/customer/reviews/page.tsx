import OrderReviewCard from "@/src/components/card/OrderReviewCard";
import BackButton from "@/src/components/common/BackButton";
import React from "react";
import ReviewClient from "./ReviewClient";

type Props = {};

const CustomerReviewPage = (props: Props) => {
	return (
		<div className="flex h-screen flex-col justify-start  w-full">
			<div className="flex flex-col flex-1 w-full bg-slate-50 p-3">
				<div className="flex justify-start border-b py-2">
					<div className="justify-start sm:hidden">
						<BackButton href="/customer" />
					</div>
					<h1 className="text-xl font-medium">Pending Reviews</h1>
				</div>
				<div className="flex flex-col my-4">
					<ReviewClient />
				</div>
			</div>
		</div>
	);
};

export default CustomerReviewPage;
