import React from "react";

type Props = {
	numberOfStars: number | 0;
	size?: number;
};

const StarRating = ({ numberOfStars, size }: Props) => {
	let sizeNumber = size ? size : 4;
	return (
		<div className="flex justify-start my-1">
			{numberOfStars > 0 &&
				Array.from({ length: numberOfStars }).map((_, index) => (
					<div key={index} className="inline-flex text-[#F9AB04]">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0  0  24  24"
							fill="currentColor"
							className={`size-${sizeNumber}`}
						>
							<path d="M11.9998  17L6.12197  20.5902L7.72007  13.8906L2.48926  9.40983L9.35479  8.85942L11.9998  2.5L14.6449  8.85942L21.5104  9.40983L16.2796  13.8906L17.8777  20.5902L11.9998  17Z"></path>
						</svg>
					</div>
				))}
		</div>
	);
};

export default StarRating;
