"use client";
import OrderReviewCard from "@/src/components/card/OrderReviewCard";
import CardSkeleton from "@/src/components/skeleton/CardSkeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ReviewClient = () => {
	const getReviewProducts = async () => {
		const response = await axios.get("/api/reviews/eligible");
		return response.data;
	};

	const { isPending, error, data } = useQuery({
		queryKey: ["delivered-review-products"],
		queryFn: getReviewProducts,
	});

	
	if (isPending) {
		return (
			<div className="flex flex-col justify-start max-w-full gap-4 my-5">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="flex flex-col w-full justify-start">
						<CardSkeleton />
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-red-500">An error has occurred: {error.message}</div>
		);
	}

	if (!data || data.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center space-y-3 max-w-3xl lg:max-w-4xl mx-auto pb-20">
				<p className="font-semibold text-sm text-neutral-400">
					No Product to review yet
				</p>
			</div>
		);
	}

	return (
		<div>
			{data.map((order: any) => (
				<OrderReviewCard key={order.id} order={order} />
			))}
		</div>
	);
};

export default ReviewClient;
