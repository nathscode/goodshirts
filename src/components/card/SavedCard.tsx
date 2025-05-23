import { SavedWithExtra } from "@/src/db/schema";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "../common/ProductPrice";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import RemoveSaveButton from "../common/RemoveSaveButton";

type Props = {
	saved: SavedWithExtra;
};

const SavedCard = ({ saved }: Props) => {
	return (
		<Card className="overflow-hidden h-fit p-4 w-full transition-all duration-300 ease-in-out">
			<div className="flex flex-wrap justify-between items-center w-full">
				<div className="flex justify-start items-start sm:w-auto w-full">
					<div className="relative shrink-0 w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] overflow-hidden bg-slate-300 rounded-md">
						<Image
							className="object-cover w-full h-full rounded-md"
							src={
								saved.product.medias[0].url ?? "/images/placeholder-image.png"
							}
							alt={"order"}
							fill
						/>
					</div>
					<div className="justify-start ms-5 w-full">
						<div className="flex flex-col max-w-xs mt-0">
							<h1 className="text-base font-me leading-relaxed line-clamp-2 text-foreground capitalize">
								{saved.product.name}
							</h1>
							<div className="flex justify-start items-center space-x-4 text-gray-500">
								<span>
									Size: <small className="uppercase">{saved.size.size}</small>
								</span>
								<span>
									Color:{" "}
									<small className="uppercase">{saved.variant.color}</small>
								</span>
							</div>
							<ProductPrice
								price={Number(saved.size.price)}
								discountPrice={Number(saved.size.discountPrice)}
								priceClassName="text-gray-500 font-normal"
							/>
						</div>
					</div>
				</div>
				<div className="mt-5 sm:mt-0 flex sm:flex-col justify-start sm:justify-end h-full sm:w-auto w-full  items-start gap-3">
					<div className="flex flex-col justify-start">
						<RemoveSaveButton productId={saved.product.id!} />
					</div>
					<div className="flex flex-col justify-start">
						<Link href={`/products/${saved.product.slug}`} className="button">
							Add to cart
						</Link>
					</div>
				</div>
			</div>
		</Card>
	);
};

export default SavedCard;
