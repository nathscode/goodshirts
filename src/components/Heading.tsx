"use client";
import { cn } from "@/src/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { HTMLAttributes } from "react";
interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
	title: string;
	subtitle?: string;
}

export const Heading = ({
	title,
	subtitle,
	className,
	...props
}: HeadingProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3 }}
			className="flex flex-col justify-center items-center w-full"
		>
			<h1
				className={cn(
					"mb-2 text-xl sm:text-3xl text-pretty font-bold tracking-tight text-foreground font-dela",
					className
				)}
				{...props}
			>
				{title}
			</h1>
			<AnimatePresence>
				<div className="flex flex-col justify-center text-center mx-auto max-w-md">
					<motion.p
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="text-[15px] leading-relaxed text-muted-foreground"
					>
						{subtitle}
					</motion.p>
				</div>
			</AnimatePresence>
		</motion.div>
	);
};
