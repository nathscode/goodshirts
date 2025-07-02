"use client";

import { Button, buttonVariants } from "@/src/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/src/components/ui/sheet";
import Image from "next/image";
import UserAvatar from "../common/UserAvatar";
import Link from "next/link";

interface Props {
	imageSrc: string;
	slug: string;
}
export function ImageSheet({ imageSrc, slug }: Props) {
	return (
		<div className="grid grid-cols-2 gap-2">
			<Sheet>
				<SheetTrigger asChild className="hover:cursor-pointer">
					<Button variant="ghost" className="hidden md:inline-flex">
						<UserAvatar image={imageSrc} />
					</Button>
				</SheetTrigger>
				<SheetContent side="bottom">
					<SheetHeader>
						<SheetTitle>Product Image</SheetTitle>
					</SheetHeader>
					<div className="flex flex-col justify-center items-center w-full">
						<Image src={imageSrc} width={400} height={400} alt="receipt" />
						<div className="flex justify-end mt-4">
							<Link
								className={buttonVariants({
									variant: "default",
								})}
								href={`/products/${slug}`}
								target="_blank"
							>
								View Product
							</Link>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
