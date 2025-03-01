import React, { useCallback, useEffect, useRef, useState } from "react";
import "@/src/lib/styles/slider.css";
import { Button } from "../ui/button";

interface MultiRangeSliderProps {
	min: number;
	max: number;
	onChange: (value: { min: number; max: number }) => void;
}

const MultiRangeSlider: React.FC<MultiRangeSliderProps> = ({
	min,
	max,
	onChange,
}) => {
	const [minVal, setMinVal] = useState(min);
	const [maxVal, setMaxVal] = useState(max);
	const range = useRef<HTMLDivElement>(null);

	// Convert to percentage
	const getPercent = useCallback(
		(value: number) => Math.round(((value - min) / (max - min)) * 100),
		[min, max]
	);

	useEffect(() => {
		const minPercent = getPercent(minVal);
		const maxPercent = getPercent(maxVal);

		if (range.current) {
			range.current.style.left = `${minPercent}%`;
			range.current.style.width = `${maxPercent - minPercent}%`;
		}
	}, [minVal, maxVal, getPercent]);

	useEffect(() => {
		onChange({ min: minVal, max: maxVal });
	}, [minVal, maxVal, onChange]);

	return (
		<>
			<div className="flex flex-col w-full items-center justify-center px-2">
				<input
					type="range"
					min={min}
					max={max}
					value={minVal}
					onChange={(event) => {
						const value = Math.min(Number(event.target.value), maxVal - 1);
						setMinVal(value);
					}}
					className="thumb thumb--left"
					style={{ zIndex: minVal > max - 100 ? "5" : undefined }}
				/>
				<input
					type="range"
					min={min}
					max={max}
					value={maxVal}
					onChange={(event) => {
						const value = Math.max(Number(event.target.value), minVal + 1);
						setMaxVal(value);
					}}
					className="thumb thumb--right"
				/>

				<div className="slider">
					<div className="slider__track" />
					<div ref={range} className="slider__range" />
				</div>
			</div>
			<div className="flex justify-start items-center w-full p-2 bg-gray-100 mt-5">
				<div className="flex justify-between w-full prose-sm font-semibold text-gray-500">
					<div className="justify-start">Price:</div>
					<div className="justify-end">
						&#8358;{minVal} - &#8358;{maxVal}
					</div>
				</div>
			</div>
		</>
	);
};

export default MultiRangeSlider;
