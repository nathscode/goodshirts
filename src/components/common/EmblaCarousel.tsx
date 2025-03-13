"use client";
import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

type CarouselProps = {
	children: React.ReactNode;
};

const EmblaCarousel = ({ children }: CarouselProps) => {
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{ loop: true, dragFree: false },
		[Autoplay({ delay: 5000, stopOnInteraction: false })]
	);

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

	// Handle slide selection updates
	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	// Ensure navigation dots work correctly
	const scrollTo = (index: number) => {
		if (!emblaApi) return;
		emblaApi.scrollTo(index);
	};

	// Initialize API when it's ready
	useEffect(() => {
		if (!emblaApi) return;

		setScrollSnaps(emblaApi.scrollSnapList()); // Store slide positions
		emblaApi.on("select", onSelect);
		emblaApi.on("reInit", onSelect); // Ensure re-initialization works

		return () => {
			emblaApi.off("select", onSelect);
			emblaApi.off("reInit", onSelect);
		};
	}, [emblaApi, onSelect]);

	return (
		<div className="relative">
			{/* Carousel Container */}
			<div className="embla overflow-hidden touch-auto" ref={emblaRef}>
				<div className="embla__container flex">
					{React.Children.map(children, (child, index) => (
						<div className="embla__slide flex-[0_0_100%]" key={index}>
							{child}
						</div>
					))}
				</div>
			</div>

			{/* Navigation Dots */}
			<div className="flex justify-center gap-2 mt-4">
				{scrollSnaps.map((_, index) => (
					<button
						key={index}
						className={`w-3 h-3 rounded-full transition-colors ${
							index === selectedIndex ? "bg-black" : "bg-gray-400"
						}`}
						onClick={() => scrollTo(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default EmblaCarousel;
