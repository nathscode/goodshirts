import { statusType } from "@/types";
import React from "react";

type Props = {
	text: string;
	status: statusType;
	className?: string;
};

const Badge = ({ text, status, className }: Props) => {
	return (
		<div
			className={` ${
				status === "DELIVERED"
					? "bg-green-100 text-green-800"
					: status === "CONFIRM"
					? "bg-orange-100 text-orange-800"
					: status === "PROCESSING" || status === "CANCELLED"
					? "bg-gray-100 text-gray-800"
					: status === "PENDING"
					? "bg-orange-100 text-orange-800"
					: "bg-red-100 text-red-800"
			} text-[12px] px-3 py-0.5 capitalize font-semibold rounded-full w-fit text-center ${className}`}
		>
			{text}
		</div>
	);
};

export default Badge;
