"use client";
import { Search, User2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteLogo } from "./SiteLogo";
import { CartSheet } from "./modal/CartSheet";
import { CustomUser } from "../types";
import AccountDropdown from "./dropdown/account-dropdown";
import SearchSection from "./SearchSection";
import { MobileSheet } from "./modal/MobileSheet";

type Props = {
	session: CustomUser | null;
};

const NavbarClient = ({ session }: Props) => {
	// State for cart, menu, and search
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [showMobileSearch, setShowMobileSearch] = useState(false);

	return (
		<>
			{/* Desktop Navbar */}
			<div className="mx-auto w-full md:px-24 lg:px-8">
				<div className="flex flex-1 justify-between items-center w-full">
					{/* Navigation Links (Desktop) */}
					<ul className="md:flex flex-1 justify-start items-center hidden space-x-8 lg:flex">
						<li>
							<Link
								href="/"
								className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:underline"
							>
								Home
							</Link>
						</li>
						<li>
							<Link
								href="/products"
								className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:underline"
							>
								Men
							</Link>
						</li>
						<li>
							<Link
								href="/products?sort=newest"
								className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:underline"
							>
								New Arrival
							</Link>
						</li>
					</ul>

					{/* Logo */}
					<div className="flex-initial justify-center items-center">
						<Link href="/" className="inline-flex items-center lg:mx-auto">
							<SiteLogo />
						</Link>
					</div>

					{/* Right Section (Desktop) */}
					<ul className="md:flex flex-1 items-center justify-end hidden ml-auto space-x-6 lg:flex">
						{/* Search Icon */}
						<li className="inline-flex">
							<div
								className={`overflow-hidden transition-all duration-300 ${
									isSearchOpen
										? "max-h-[100px] opacity-100"
										: "max-h-0 opacity-0"
								}`}
							>
								<SearchSection />
							</div>
							<button
								onClick={() => setIsSearchOpen(!isSearchOpen)}
								className="transition ml-2"
							>
								<Search className="size-5 text-gray-600" />
							</button>
						</li>

						{/* Cart */}
						<li>
							<CartSheet
								open={isCartSheetOpen}
								onOpenChange={setIsCartSheetOpen}
							/>
						</li>

						{/* Account/Login */}
						<li>
							{session ? (
								<AccountDropdown user={session} />
							) : (
								<Link
									href={"/login"}
									className="bg-black text-white text-xs font-semibold rounded-sm px-3 py-2 hover:bg-black/80 transition-all"
								>
									Login
								</Link>
							)}
						</li>
					</ul>

					{/* Mobile Navbar */}
					<div className="justify-end lg:hidden">
						<div className="absolute top-0 left-0 w-full">
							<div
								className={`${
									showMobileSearch ? "pb-14" : "pb-0"
								}  bg-white border rounded shadow-md`}
							>
								<div className="flex items-center justify-between px-4">
									{/* Mobile Menu & Logo */}
									<div className="flex justify-start items-center space-x-2">
										<MobileSheet
											open={isMenuOpen}
											onOpenChange={setIsMenuOpen}
										/>
										<Link
											href="/"
											className="inline-flex items-center lg:mx-auto"
										>
											<SiteLogo />
										</Link>
									</div>

									{/* Mobile Right Section */}
									<div className="flex justify-start items-center space-x-4">
										{/* Search Button */}
										<button
											onClick={() => setShowMobileSearch(!showMobileSearch)}
											className="p-1 rounded-md transition hover:bg-gray-100"
										>
											<Search className="size-5 text-gray-600" />
										</button>
										{session ? (
											<Link href={"/customer/account"}>
												<User2 className="size-5" />
											</Link>
										) : (
											<Link
												href={"/login"}
												className="bg-black text-white text-xs font-semibold rounded-sm px-3 py-2 hover:bg-black/80 transition-all"
											>
												Login
											</Link>
										)}
										<CartSheet
											open={isCartSheetOpen}
											onOpenChange={setIsCartSheetOpen}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile Search Section (Toggles when clicking search icon) */}
				<div
					className={`transition-all duration-300 ${
						showMobileSearch ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
					} overflow-hidden flex sm:hidden`}
				>
					<SearchSection className="w-full" />
				</div>
			</div>
		</>
	);
};

export default NavbarClient;
