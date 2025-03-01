import ReviewCard from "@/src/components/card/ReviewCard";
import { ReviewType, ReviewWithExtra } from "@/src/db/schema";
import { abbreviateMetrics, calculateAverageRating } from "@/src/lib/utils";
import { StarIcon } from "lucide-react";
import React from "react";

type Props = {
	reviews: ReviewWithExtra[];
};

const ReviewSection = ({ reviews }: Props) => {
	return (
		<div className="flex flex-col justify-start w-full">
			{reviews.length > 0 ? (
				<>
					<div className="flex justify-start">
						<span className="inline-flex justify-center items-center">
							<StarIcon className="size-7 fill-[#F9AB04] text-[#F9AB04]" />
							<span className="text-lg md:text-2xl font-bold ms-2">
								{calculateAverageRating(reviews)}
							</span>
						</span>
					</div>
					<p className="text-base text-black font-semibold mt-1">
						Based on {`${abbreviateMetrics(reviews.length)}`} reviews
					</p>
					<div className="flex flex-col justify-start w-full space-y-8 my-5">
						{reviews.map((review) => (
							<ReviewCard key={review.id} review={review} />
						))}
					</div>
				</>
			) : (
				<div className="flex flex-col justify-start">
					<h1 className="text-lg font-bold">No Review for this product Yet</h1>
					<p className="mt-1 text-base text-gray-500">
						Login and leave a review
					</p>
				</div>
			)}
		</div>
	);
};

export default ReviewSection;
