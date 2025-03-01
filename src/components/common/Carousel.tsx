"use client";

import { cn } from "@/src/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

type SectionProps = {
	className?: string;
	title?: string;
	href?: string;
	children?: React.ReactNode;
	imageLength: number;
};

const Carousel: React.FC<SectionProps> = ({
	className,
	title,
	href,
	children,
	imageLength,
}) => {
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [showArrows, setShowArrows] = useState<boolean>(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const isMobile = useMediaQuery("(max-width: 764px)");

	useEffect(() => {
		const checkOverflow = () => {
			if (scrollContainerRef.current) {
				const { scrollWidth, clientWidth } = scrollContainerRef.current;
				setShowArrows(scrollWidth > clientWidth);
			}
		};

		checkOverflow();
		window.addEventListener("resize", checkOverflow);
		return () => window.removeEventListener("resize", checkOverflow);
	}, [children]);

	const scrollTo = useCallback((index: number) => {
		if (scrollContainerRef.current) {
			const children = scrollContainerRef.current.children;
			if (children[index]) {
				children[index].scrollIntoView({
					behavior: "smooth",
					block: "nearest",
					inline: "start",
				});
			}
		}
		setCurrentIndex(index);
	}, []);

	const navigateImage = useCallback(
		(direction: "next" | "previous") => {
			const newIndex =
				direction === "next"
					? Math.min(currentIndex + 1, imageLength - 1)
					: Math.max(currentIndex - 1, 0);
			scrollTo(newIndex);
		},
		[currentIndex, imageLength, scrollTo]
	);

	const isFirstImage = currentIndex === 0;
	const isLastImage = currentIndex === imageLength - 1;

	return (
		<div className={cn("relative w-full flex my-5 flex-col", className)}>
			{title && (
				<div className="flex items-center justify-between mb-5">
					<h1 className="font-semibold text-lg sm:text-2xl text-foreground font-Orelega">
						{title}
					</h1>
					<div className="flex items-center">
						{href && (
							<Link
								href={href}
								className="mr-4 text-base font-medium capitalize transition-colors hover:text-brand/60"
							>
								{isMobile ? <ChevronRight className="h-5 w-5" /> : "See all"}
							</Link>
						)}
						{showArrows && !isMobile && (
							<div className="flex items-center gap-x-3">
								<button
									onClick={() => navigateImage("previous")}
									className={cn(
										"p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white",
										isFirstImage && "opacity-50 cursor-not-allowed"
									)}
									disabled={isFirstImage}
								>
									<ChevronLeft className="h-5 w-5" />
								</button>
								<button
									onClick={() => navigateImage("next")}
									className={cn(
										"p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white",
										isLastImage && "opacity-50 cursor-not-allowed"
									)}
									disabled={isLastImage}
								>
									<ChevronRight className="h-5 w-5" />
								</button>
							</div>
						)}
					</div>
				</div>
			)}
			<div
				ref={scrollContainerRef}
				className="flex space-x-4 items-center w-full overflow-x-auto scrollbar-none snap-x snap-mandatory"
			>
				{children}
			</div>
		</div>
	);
};

export default Carousel;
