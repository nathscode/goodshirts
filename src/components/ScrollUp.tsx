"use client";
import { ChevronUp } from "lucide-react";
import React, { useState, useEffect } from "react";

const ScrollUp = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.pageYOffset > 500) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			className={`fixed bottom-8 right-8 bg-gray-800 text-white p-3 rounded-full cursor-pointer opacity-0 transition-opacity duration-300 ${
				isVisible ? "opacity-100" : ""
			}`}
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
		>
			<ChevronUp className="size-5" />
		</div>
	);
};

export default ScrollUp;
