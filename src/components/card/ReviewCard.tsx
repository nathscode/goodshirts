import React from "react";
import StarRating from "../common/StarRating";

type Props = {};

const ReviewCard = (props: Props) => {
	return (
		<div className="flex flex-col justify-start w-full [&:not(:last-child)]:border-b py-4">
			<div className="flex justify-between flex-1">
				<div className="flex flex-col justify-center items-center h-14 w-14 rounded-full bg-slate-100 text-black">
					<span className="text-lg font-semibold">MN</span>
				</div>
				<div className="flex flex-col flex-1 ms-5">
					<div className="inline-flex space-x-2">
						<StarRating numberOfStars={4} size={5} /> <span>17/08/2025</span>
					</div>
					<h2 className="text-base md:text-lg font-bold">Michael Nathan</h2>
				</div>
			</div>
			<div className="flex flex-col flex-1 w-full mt-1">
				<h2 className="text-base md:text-lg font-bold">Fantastic</h2>
				<p className="text-base text-pretty text-black/80 mt-1">
					I ordered and i got what i wanted, and their service is swift and
					fast.
				</p>
			</div>
		</div>
	);
};

export default ReviewCard;
