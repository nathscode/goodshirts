import { ReviewWithExtra } from "@/src/db/schema";
import { formatDate, getInitials } from "@/src/lib/utils";
import StarRating from "../common/StarRating";

type Props = {
	review: ReviewWithExtra;
};

const ReviewCard = ({ review }: Props) => {
	return (
		<div className="flex flex-col justify-start w-full [&:not(:last-child)]:border-b py-4">
			<div className="flex justify-between flex-1">
				<div className="flex flex-col justify-center items-center h-14 w-14 rounded-full bg-slate-100 text-black">
					<span className="text-lg font-semibold">
						{getInitials(`${review.user.firstName} ${review.user.lastName}`)}
					</span>
				</div>
				<div className="flex flex-col flex-1 ms-5">
					<div className="inline-flex space-x-2">
						<StarRating numberOfStars={review.rating} size={5} />{" "}
						<span>{formatDate(review.createdAt.toString())}</span>
					</div>
					<h2 className="text-base md:text-lg font-bold">{`${review.user.firstName} ${review.user.lastName}`}</h2>
				</div>
			</div>
			<div className="flex flex-col flex-1 w-full mt-1">
				<h2 className="text-base md:text-lg capitalize font-bold">
					{review.title}
				</h2>
				<p className="text-base text-pretty text-black/80 mt-1">
					{review.comment}
				</p>
			</div>
		</div>
	);
};

export default ReviewCard;
