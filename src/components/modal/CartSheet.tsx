import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import useCartStore from "@/hooks/use-cart";
import Image from "next/image";
import CartSection from "../CartSection";
import { ShoppingCart } from "lucide-react";
interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
export function CartSheet({ open, onOpenChange }: Props) {
	const openChangeWrapper = (open: boolean) => {
		onOpenChange(open);
	};
	const { cartItems } = useCartStore();

	return (
		<Sheet open={open} onOpenChange={openChangeWrapper}>
			<SheetTrigger>
				<ShoppingCart className="size-5 text-gray-700 relative top-[2px]" />
			</SheetTrigger>
			<SheetContent className="w-full sm:max-w-[450px]">
				<SheetHeader>
					<SheetTitle>My Cart {`(1)`}</SheetTitle>
				</SheetHeader>
				<div className="flex flex-col w-full mt-5">
					{cartItems.length === 0 ? (
						<div className="flex flex-col text-center justify-center items-center size-full">
							<div className="relative shrink-0 w-[100px] h-[100px] overflow-hidden ">
								<Image
									className="object-cover w-full h-full"
									src={"/images/shopping-bag.png"}
									alt={"food"}
									fill
								/>
							</div>
							<div className="flex flex-col mt-5">
								<h4 className="font-bold text-2xl">Oops! You must be hungry</h4>
								<p className="text-gray-500 text-base leading-6 mt-2">
									Place your favorite meal now and get it delivered to you in no
									time.{" "}
								</p>
								<div className="flex flex-col w-auto mt-7">
									<SheetClose asChild>
										<Button type="submit" className="rounded-full">
											Place Order
										</Button>
									</SheetClose>
								</div>
							</div>
						</div>
					) : (
						<div className="flex flex-col">
							<CartSection />
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
