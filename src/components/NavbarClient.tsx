"use client";
import { User2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CustomUser } from "../types";
import { SiteLogo } from "./SiteLogo";
import AccountDropdown from "./dropdown/account-dropdown";
import { CartSheet } from "./modal/CartSheet";
import { MobileSheet } from "./modal/MobileSheet";
import SearchModal from "./modal/SearchModal";

type Props = {
	session: CustomUser | null;
};

const NavbarClient = ({ session }: Props) => {
	// State for cart, menu, and search
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);

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
							<SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
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
							<div className="bg-white border rounded shadow-md">
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
										<SearchModal
											open={isSearchOpen}
											onOpenChange={setIsSearchOpen}
										/>

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
			</div>
		</>
	);
};

export default NavbarClient;
