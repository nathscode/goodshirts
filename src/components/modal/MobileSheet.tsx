"use client";

import getAllCategories from "@/src/actions/getAllCategories";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from "@/src/components/ui/sheet";
import { cn } from "@/src/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
	ArrowBigRightDash,
	BoxIcon,
	Edit2,
	Heart,
	MapPinIcon,
	Menu,
	User2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SiteLogo } from "../SiteLogo";
import { Separator } from "../ui/separator";
import CategoryMobileSkeleton from "../skeleton/CategoryMobileSkeleton";
import LogoutButton from "../LogoutButton";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function MobileSheet({ open, onOpenChange }: Props) {
	const pathname = usePathname();
	const router = useRouter();
	const handleLinkClick = (href: string) => {
		onOpenChange(false);
		router.push(href);
	};

	// Fet

	// Fetch categories using React Query
	const { isPending, error, data } = useQuery({
		queryKey: ["mobile-categories"],
		queryFn: getAllCategories,
	});

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetTrigger>
				<Menu className="size-5" />
			</SheetTrigger>
			<SheetContent side="left" className="p-0 w-[300px] sm:max-w-[450px]">
				<SheetHeader>
					<div className="absolute left-1">
						<Link
							href="/"
							aria-label="africagoodshirts"
							title="africagoodshirts"
							className="inline-flex items-center lg:mx-auto"
							onClick={() => handleLinkClick("/")}
						>
							<SiteLogo />
						</Link>
					</div>
				</SheetHeader>

				<div className="flex flex-col w-full mt-16">
					{/* My Account Section */}
					<div className="flex flex-col w-full px-4">
						<h4 className="uppercase text-sm font-semibold">My account</h4>
					</div>
					<ul className="size-full flex flex-col text-[13px]">
						{[
							{ href: "/customer/account", label: "Account", icon: User2 },
							{ href: "/customer/orders", label: "Orders", icon: BoxIcon },
							{ href: "/customer/reviews", label: "Reviews", icon: Edit2 },
							{ href: "/customer/saved", label: "Saved", icon: Heart },
							{
								href: "/customer/address",
								label: "Address",
								icon: MapPinIcon,
							},
						].map(({ href, label, icon: Icon }) => (
							<li key={href} className="w-full">
								<Link
									href={href}
									className={cn(
										"flex space-x-4 items-center py-3 px-4 font-medium w-full text-gray-700 transition-colors duration-200 hover:bg-slate-200",
										pathname === href && "bg-slate-300"
									)}
									onClick={() => handleLinkClick(href)}
								>
									<Icon className="size-5" />
									<span className="font-medium">{label}</span>
								</Link>
							</li>
						))}
					</ul>

					<Separator className="bg-gray-200 my-4" />

					{/* Categories Section */}
					<div className="flex justify-between items-center w-full px-4">
						<h4 className="uppercase text-sm font-semibold">Our categories</h4>
						<Link
							href="/products"
							className="text-xs font-medium hover:underline"
						>
							See All
						</Link>
					</div>
					<ul className="size-full flex flex-col text-[13px]">
						<ScrollArea className="h-[300px] w-full">
							{isPending ? (
								// Loading skeleton wrapped in a flex container
								<div className="flex flex-col space-y-4">
									{[...Array(4)].map((_, i) => (
										<li key={i} className="w-full px-4">
											<CategoryMobileSkeleton />
										</li>
									))}
								</div>
							) : error ? (
								<li className="text-red-500 px-4">Failed to load categories</li>
							) : data?.length > 0 ? (
								data
									.sort((a, b) => a.name.localeCompare(b.name))
									.map((category) => (
										<li key={category.id} className="w-full">
											<Link
												href={`/products?category=${category.name}`}
												className={cn(
													"flex space-x-4 items-center py-3 px-4 font-medium w-full text-gray-700 transition-colors duration-200 hover:bg-slate-200",
													pathname === `/product?category=${category.name}` &&
														"bg-slate-300"
												)}
												onClick={() =>
													handleLinkClick(`/products?category=${category.name}`)
												}
											>
												<ArrowBigRightDash className="size-5" />
												<span className="font-medium capitalize">
													{category.name}
												</span>
											</Link>
										</li>
									))
							) : (
								<li className="px-4">No categories available</li>
							)}
						</ScrollArea>
					</ul>
					<LogoutButton
						iconClassName="size-3"
						className="text-gray-700 text-sm"
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
}
