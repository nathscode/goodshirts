"use client";
import { cn } from "@/lib/utils";
import {
	BoxIcon,
	Edit2,
	Heart,
	Mail,
	MapPinIcon,
	User,
	User2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {};

const CustomerSidebar = (props: Props) => {
	const pathname = usePathname();
	return (
		<div className="flex flex-col h-full w-full sm:w-[300px]">
			<ul className="w-full h-screen bg-slate-100 shadow-sm flex flex-col justify-start items-center rounded-sm text-sm">
				<li className="w-full">
					<Link
						href="/customer/account"
						aria-label="cart"
						className={cn(
							"flex justify-start flex-1 space-x-4 items-center py-3 px-4 font-medium tracking-wide w-full text-gray-700 transition-colors duration-200 hover:bg-slate-200 rounded-tr-sm rounded-tl-sm",
							pathname === "/customer/account" ? "bg-slate-300" : ""
						)}
					>
						<User2 className="size-5" />
						<span className="font-medium">My Account</span>
					</Link>
				</li>
				<li className="w-full">
					<Link
						href="/customer/orders"
						aria-label="orders"
						className={cn(
							"flex justify-start flex-1 space-x-4 items-center py-3 px-4 font-medium tracking-wide w-full text-gray-700 transition-colors duration-200 hover:bg-slate-200",
							pathname === "/customer/orders" ? "bg-slate-300" : ""
						)}
					>
						<BoxIcon className="size-5" />
						<span className="font-medium">Orders</span>
					</Link>
				</li>

				<li className="w-full">
					<Link
						href="/customer/reviews"
						aria-label="reviews"
						className={cn(
							"flex justify-start flex-1 space-x-4 items-center py-3 px-4 font-medium tracking-wide w-full text-gray-700 transition-colors duration-200 hover:bg-slate-200",
							pathname === "/customer/reviews" ? "bg-slate-300" : ""
						)}
					>
						<Edit2 className="size-5" />
						<span className="font-medium">Reviews</span>
					</Link>
				</li>
				<li className="w-full">
					<Link
						href="/customer/saved"
						aria-label="saved"
						className={cn(
							"flex justify-start flex-1 space-x-4 items-center py-3 px-4 font-medium tracking-wide w-full text-gray-700 transition-colors duration-200 hover:bg-slate-200",
							pathname === "/customer/saved" ? "bg-slate-300" : ""
						)}
					>
						<Heart className="size-5" />
						<span className="font-medium">Saved</span>
					</Link>
				</li>
				<li className="w-full">
					<Link
						href="/customer/address"
						aria-label="saved"
						className={cn(
							"flex justify-start flex-1 space-x-4 items-center py-3 px-4 font-medium tracking-wide w-full text-gray-700 transition-colors duration-200 hover:bg-slate-200",
							pathname === "/customer/address" ? "bg-slate-300" : ""
						)}
					>
						<MapPinIcon className="size-5" />
						<span className="font-medium">Address</span>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default CustomerSidebar;
