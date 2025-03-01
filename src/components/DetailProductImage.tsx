"use client";
import { Button } from "@/src/components/ui/button";
import { ZoomIn } from "lucide-react";
import React, { useState } from "react";
import ReactImageMagnifier from "simple-image-magnifier/react";
import { useMediaQuery } from "usehooks-ts";
import { Lightbox } from "react-modal-image";
import ImageMagnifier from "./common/ImageMagnifier";

type Props = {
	image: string;
};

const DetailProductImage = ({ image }: Props) => {
	const [open, setOpen] = useState<boolean>(false);
	const matches = useMediaQuery("(max-width: 400px)");

	const closeLightbox = () => {
		setOpen(false);
	};

	return (
		<div className="relative">
			<ImageMagnifier
				src={image}
				width={matches ? 300 : 410}
				height={matches ? 335 : 435}
				magnifierHeight={200}
				magnifierWidth={200}
				zoomLevel={3}
				alt="Sample Image"
			/>

			<div className="absolute top-2 right-10 z-20">
				<Button
					variant="default"
					size="icon"
					onClick={() => setOpen(true)}
					className="bg-black/40 rounded-none hover:bg-black/30"
				>
					<ZoomIn className="h-4 w-4" />
				</Button>
			</div>
			{open && (
				<Lightbox
					medium={image}
					large={image}
					alt="product image"
					hideZoom={false}
					hideDownload={true}
					// @ts-ignore
					onClose={closeLightbox}
				/>
			)}
		</div>
	);
};

export default DetailProductImage;
