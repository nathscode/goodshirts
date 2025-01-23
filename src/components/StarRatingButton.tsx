"use client";
import { useState } from "react";

type Props = {
	rating: number;
	onRating?: (value: number) => void;
	onHover?: false;
};
const StarRatingButton = ({ rating, onRating, onHover }: Props) => {
	const [hover, setHover] = useState<number | null>(null);
	return (
		<div className="inline-flex justify-start items-center">
			{[...Array(5)].map((_, i) => {
				const ratingValue = i + 1;

				return (
					<label key={i}>
						<input
							type="radio"
							name="rating"
							value={ratingValue}
							onClick={() => onRating && onRating(ratingValue)}
							className="sr-only"
						/>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0  0  24  24"
							fill="currentColor"
							className={`h-4 w-4 hover:cursor-pointer ${
								ratingValue <= (hover || rating)
									? "fill-[#F9AB04] text-[#F9AB04]"
									: "fill-gray-400 text-gray-400"
							}`}
							onMouseEnter={() => setHover(ratingValue)}
							onMouseLeave={() => setHover(null)}
						>
							<path d="M11.9998  17L6.12197  20.5902L7.72007  13.8906L2.48926  9.40983L9.35479  8.85942L11.9998  2.5L14.6449  8.85942L21.5104  9.40983L16.2796  13.8906L17.8777  20.5902L11.9998  17Z"></path>
						</svg>
					</label>
				);
			})}
		</div>
	);
};

export default StarRatingButton;
