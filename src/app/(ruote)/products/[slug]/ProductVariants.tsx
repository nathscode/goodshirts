import ProductPrice from "@/src/components/common/ProductPrice";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import {
	PriceVariantType,
	ProductWithExtra,
	VariantType,
} from "@/src/db/schema";
import React from "react";

type Props = {
	product: ProductWithExtra;
	selectedVariant: VariantType & { variantPrices: PriceVariantType[] };
	selectedSize: PriceVariantType;
	onVariantChange: (
		variant: VariantType & { variantPrices: PriceVariantType[] }
	) => void;
	onSizeChange: (size: PriceVariantType) => void;
};

const ProductVariants = ({
	product,
	selectedVariant,
	selectedSize,
	onVariantChange,
	onSizeChange,
}: Props) => {
	// Function to handle color change
	const handleColorChange = (color: string) => {
		const newVariant = product.variants.find(
			(variant) => variant.color === color
		);
		if (newVariant) {
			onVariantChange(newVariant);
			// Automatically select the first available size of the new variant
			const availableSize = newVariant.variantPrices.find(
				(size) => size.stockQuantity! > 0
			);
			if (availableSize) {
				onSizeChange(availableSize);
			}
		}
	};

	// Function to handle size change
	const handleSizeChange = (sizeValue: string) => {
		const newSize = selectedVariant.variantPrices.find(
			(s) => s.size === sizeValue
		);
		if (newSize && newSize.stockQuantity! > 0) {
			onSizeChange(newSize);
		}
	};

	return (
		<div>
			<ProductPrice
				price={Number(selectedSize?.price)}
				discountPrice={Number(selectedSize?.discountPrice)}
				priceClassName="text-lg"
				discountPriceClassName="text-lg"
			/>
			{/* Color Selection */}
			<div className="flex justify-start flex-col w-full mt-4">
				<h2 className="text-base text-black font-semibold mb-2">Colors:</h2>
				<RadioGroup
					className="flex justify-start items-center flex-wrap space-x-1"
					value={selectedVariant.color}
					onValueChange={handleColorChange}
				>
					<div className="flex flex-wrap items-center gap-4">
						{product.variants.map((variant) => {
							const isOutOfStock = variant.variantPrices.every(
								(size) => size.stockQuantity === 0
							);
							return (
								<div key={variant.id}>
									<RadioGroupItem
										className="peer sr-only"
										value={variant.color}
										id={variant.color}
										disabled={isOutOfStock} // ✅ Disable if all sizes are out of stock
										aria-disabled={isOutOfStock}
									/>
									<Label
										htmlFor={variant.color}
										className={`flex items-center justify-between capitalize rounded-md border-2 border-gray-200 bg-popover p-4 hover:border-gray-200 hover:cursor-pointer hover:text-black peer-data-[state=checked]:border-black [&:has([data-state=checked])]:border-primary ${
											isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
										}`}
									>
										{variant.color}
									</Label>
								</div>
							);
						})}
					</div>
				</RadioGroup>
			</div>
			{/* Size Selection */}
			<div className="flex justify-start flex-col mt-4">
				<h2 className="text-base text-black font-semibold mb-2">Sizes:</h2>
				<RadioGroup
					className="flex justify-start items-center flex-wrap space-x-1"
					value={selectedSize?.size}
					onValueChange={handleSizeChange}
				>
					<div className="flex items-center flex-wrap gap-4">
						{selectedVariant.variantPrices.length > 0 ? (
							selectedVariant.variantPrices.map((size) => {
								const isOutOfStock = size.stockQuantity === 0;
								return (
									<div key={size.id}>
										<RadioGroupItem
											className="peer sr-only"
											value={size.size}
											id={size.size}
											disabled={isOutOfStock}
											aria-disabled={isOutOfStock}
										/>
										<Label
											htmlFor={size.size}
											className={`flex items-center justify-between capitalize rounded-md border-2 border-gray-200 bg-popover p-4 hover:border-gray-200 hover:cursor-pointer hover:text-black peer-data-[state=checked]:border-black [&:has([data-state=checked])]:border-primary ${
												isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
											}`}
										>
											{size.size}
										</Label>
									</div>
								);
							})
						) : (
							<div>No sizes available for this color</div>
						)}
					</div>
				</RadioGroup>
			</div>
		</div>
	);
};

export default ProductVariants;
