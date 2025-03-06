import OrderReviewCard from "@/src/components/card/OrderReviewCard";
import BackButton from "@/src/components/common/BackButton";
import React from "react";
import ReviewClient from "./ReviewClient";
import { getAllDeliveredReviews } from "@/src/actions/reviews.action";
import { AlertCircle } from "lucide-react";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";

type Props = {};

const CustomerReviewPage = async (props: Props) => {
	const reviewsDelivered = await getAllDeliveredReviews();

	if (reviewsDelivered.status === "error") {
		return (
			<div className="flex flex-col items-center justify-center min-h-14 h-[40vh]">
				<AlertCircle className="w-20 h-20" />
				<p>{reviewsDelivered.message}</p>
			</div>
		);
	}
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["review-delivered-data"],
		queryFn: () => JSON.parse(JSON.stringify(reviewsDelivered.data)),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="flex  flex-col justify-start  w-full">
				<div className="flex flex-col flex-1 w-full bg-slate-50 p-3">
					<div className="flex justify-start border-b py-2">
						<div className="justify-start sm:hidden">
							<BackButton href="/customer" />
						</div>
						<h1 className="text-xl font-medium">Pending Reviews</h1>
					</div>
					<div className="flex flex-col my-4">
						{reviewsDelivered.data!.length > 0 ? (
							reviewsDelivered.data!.map((order: any) => (
								<OrderReviewCard key={order.id} order={order} />
							))
						) : (
							<div>Empty</div>
						)}
					</div>
				</div>
			</div>
		</HydrationBoundary>
	);
};

export default CustomerReviewPage;
