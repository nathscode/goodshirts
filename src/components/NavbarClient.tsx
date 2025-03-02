"use client";
import { Search, User2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SiteLogo } from "./SiteLogo";
import { CartSheet } from "./modal/CartSheet";
import { CustomUser } from "../types";
import AccountDropdown from "./dropdown/account-dropdown";
import { Button } from "./ui/button";
import SearchSection from "./SearchSection";
import { MobileSheet } from "./modal/MobileSheet";

type Props = {
	session: CustomUser | null;
};

const NavbarClient = ({ session }: Props) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);

	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const handleOpenChange = (open: boolean) => setIsCartSheetOpen(open);
	const handleOpenMenuChange = (open: boolean) => setIsMenuOpen(open);

	return (
		<>
			<div className="py-2 mx-auto w-full md:px-24 lg:px-8">
				<div className="flex flex-1 justify-between items-center w-full">
					<ul className="md:flex flex-1 justify-start items-center hidden space-x-8 lg:flex">
						<li>
							<Link
								href="/"
								aria-label="Home"
								title="Home"
								className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:underline"
							>
								Home
							</Link>
						</li>
						<li>
							<Link
								href="/products"
								aria-label="Men"
								title="Men"
								className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:underline"
							>
								Men
							</Link>
						</li>
						<li>
							<Link
								href="/products?sort=newest"
								aria-label="New Arrival"
								title="New Arrival"
								className="font-medium tracking-wide text-gray-700 transition-colors duration-200 hover:underline"
							>
								New Arrival
							</Link>
						</li>
					</ul>
					<div className="flex-initial justify-center items-center">
						<Link
							href="/"
							aria-label="africagoodshirts"
							title="africagoodshirts"
							className="inline-flex items-center lg:mx-auto"
						>
							<SiteLogo />
						</Link>
					</div>
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
								aria-label="Search"
							>
								<Search className="size-5 text-gray-600" />
							</button>
						</li>
						<li>
							<CartSheet
								open={isCartSheetOpen}
								onOpenChange={handleOpenChange}
							/>
						</li>
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
					{/* Mobile section */}
					<div className="justify-end lg:hidden">
						<div className="absolute top-0 left-0 w-full">
							<div className="py-5  bg-white  border rounded shadow-md">
								<div className="flex items-center justify-between mb-4 px-4">
									<div className="flex justify-start items-center space-x-2">
										<MobileSheet
											open={isMenuOpen}
											onOpenChange={handleOpenMenuChange}
										/>
										<Link
											href="/"
											aria-label="africagoodshirts"
											title="africagoodshirts"
											className="inline-flex items-center lg:mx-auto"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												id="Layer_2"
												data-name="Layer 2"
												className="w-8 text-deep-purple-accent-400"
												viewBox="0 0 469.43 534.09"
											>
												<defs>
													<path
														id="reuse-0"
														strokeWidth="0"
														d="M392.37 162.02c-1.22.65-2.49 1.25-3.8 1.8.69 5.97 1.04 12.04 1.04 18.2v170.04c0 86.72-70.31 157.02-157.03 157.02-55.1 0-103.58-28.38-131.59-71.33-1.72-.28-3.52-.65-5.39-1.14 28.41 45.87 79.19 76.48 136.99 76.48 88.78 0 161.02-72.24 161.02-161.03V182.02c0-6.77-.42-13.45-1.24-20Z"
													/>
												</defs>
												<defs />
												<g id="Layer_1-2" data-name="Layer 1">
													<path
														fill="#fff"
														strokeWidth="0"
														d="M392.37 162.02c-1.22.65-2.49 1.25-3.8 1.8.69 5.97 1.04 12.04 1.04 18.2v170.04c0 86.72-70.31 157.02-157.03 157.02-55.1 0-103.58-28.38-131.59-71.33-1.72-.28-3.52-.65-5.39-1.14 28.41 45.87 79.19 76.48 136.99 76.48 88.78 0 161.02-72.24 161.02-161.03V182.02c0-6.77-.42-13.45-1.24-20Z"
													/>

													<path
														d="M443.26 168.2s-6.5-18.67-27.17-22.55c.09-.6.11-1.21.08-1.84 9.43-1.89 23.17-6.74 30.62-19.23 0 0 9.09-18.19 22.64-19.49 0 0-4.45-5.57-14.85-5.57 0 0 6.31-22.08-11.32-47.7 0 0 2.69 11.79-12.81 27.29 0 0-26.39 16.62-25.08 45.6-1.28-3.84-2.68-7.63-4.2-11.36C374 46.93 308.67 0 232.59 0 132.22 0 50.57 81.66 50.57 182.02v161.15c-7.19-9.78-9.72-16.04-10.61-31.62 0 0-19.04 12-13.52 33.68 0 0-14.86-1.2-20.88 14.06 0 0 13.93 2.32 20.2 24.18 0 0 6.63 18.64 27.32 22.37-.08.6-.11 1.22-.07 1.85-9.41 1.94-23.12 6.88-30.49 19.42 0 0-8.98 18.25-22.52 19.64 0 0 4.49 5.54 14.88 5.47 0 0-6.16 22.13 11.63 47.63 0 0-2.76-11.77 12.63-27.37 0 0 26.71-17.06 24.76-46.47 0 0-1.08-4.35-1.54-9.28h.07c1.95 5.1 4.12 10.1 6.5 14.97 29.59 60.57 91.83 102.39 163.66 102.39 100.36 0 182.02-81.66 182.02-182.03v-148.5c9.91 12.9 13.07 18.51 13.99 36.47 0 0 19.12-11.88 13.73-33.6 0 0 14.85 1.3 20.98-13.92 0 0-13.92-2.41-20.05-24.31Zm-38.65 183.86c0 94.86-77.17 172.03-172.02 172.03-67.03 0-125.21-38.53-153.59-94.6-1.58-3.12-3.07-6.29-4.45-9.52 5.72 5.01 11.68 8.23 17.31 10.27 1.88.68 3.72 1.23 5.5 1.67 11.81 2.94 20.97 1.08 20.97 1.08 37.11-2.47 37.53 8.8 37.53 8.8 2.4 9.2-.87 13.48-4.43 15.47-3.86 2.15-8.65 1.88-12.41-.45-7.18-4.45-5.69-13.2-5.36-14.77-4.32 13.96 2.39 18.62 7.78 20.2 3.94 1.14 8.24.66 11.66-1.6 7.5-4.96 6.52-14.74 6.52-14.74-.89-21.9-31.39-46.11-31.39-46.11 5.1-7.13 5.61-14.79 5.61-14.79-5.37 9.5-36.58 4.27-36.58 4.27-5.88-.4-11.47 1.17-16.36 3.53-1.24.59-2.44 1.23-3.59 1.91-3.04 1.78-5.72 3.77-7.92 5.6-.71-.71-1.54-1.31-2.44-1.77-.2-.11-.41-.2-.62-.29.1-.3.19-.6.29-.91 3.06-9.99 5.53-26.39-4.83-39.71-.39-.51-.78-1-1.17-1.49-.03-1.35-.05-2.72-.05-4.08V182.02C60.57 87.17 137.73 10 232.59 10c74.91 0 138.78 48.13 162.34 115.08 1.09 3.1 2.09 6.23 2.99 9.4-4.99-5.17-10.29-8.8-15.46-11.33-1.75-.85-3.47-1.58-5.17-2.21-.37-.14-.75-.27-1.12-.39-13.74-4.71-25.16-2.47-25.16-2.47-37.12 2.23-37.47-9.04-37.47-9.04-2.34-9.22.96-13.47 4.54-15.44 3.87-2.13 8.65-1.82 12.39.53 7.31 4.59 5.54 13.61 5.25 14.89 4.45-13.99-2.24-18.72-7.63-20.33-3.93-1.17-8.23-.72-11.66 1.51-7.54 4.92-6.62 14.71-6.62 14.71.74 21.9 31.09 46.31 31.09 46.31-5.15 7.1-5.71 14.75-5.71 14.75 5.43-9.46 36.61-4.04 36.61-4.04 5.47.42 10.71-.89 15.38-2.95.23-.1.47-.2.7-.31 1.3-.6 2.55-1.25 3.74-1.94 3.12-1.79 5.87-3.8 8.12-5.65.7.71 1.49 1.3 2.38 1.76h.01c.22.12.43.22.66.32-.14.41-.27.84-.41 1.28-2.8 9.09-5.04 23.27 2.22 35.7v161.92Z"
														className="cls-4"
													/>
													<path
														d="M379.66 116.5c-1.75-.67-3.47-1.23-5.13-1.69-7.76-16.36-18.26-31.16-30.92-43.82C315.2 42.57 275.94 25 232.58 25 145.86 25 75.56 95.3 75.56 182.02v170.04c0 12.31 1.42 24.3 4.1 35.79-1.26.57-2.48 1.19-3.65 1.84-.66-2.74-1.25-5.51-1.76-8.31-.88-4.71-1.54-9.5-1.99-14.34-.46-4.93-.69-9.93-.69-14.98V182.02C71.57 93.23 143.8 21 232.59 21c65.46 0 121.93 39.27 147.07 95.5Z"
														className="cls-4"
													/>
													<path
														d="m307.89 354.22-50-174.54c-1.58-5.08 7-7.14 7-7.14v-1.3h-68.61v1.23c9.13 2.27 11.88 5.84 11.88 5.84l2.12 7.38-23.07 81.19s-3.78 17.41 10.03 23.73c0 0-14.67 3.13-21.88 18.99l-13.91 45.34s-2.37 3.5-11.54 6.18v1.73h24.35v-1.49s-7.04-1.37-7.04-7.04l12.36-41.93s5.16-15.36 24.53-18.03h37.37l17.02 59.31c0 5.7-7.41 7.41-7.41 7.41v1.45h68.41v-1.38c-10.3-2.61-11.61-6.93-11.61-6.93Zm-97.19-65.87s-26.27 2.71-16.49-28.51l18.89-64.33 26.65 92.84H210.7Z"
														className="cls-4"
													/>
												</g>
											</svg>
										</Link>
									</div>
									<div className="flex justify-start items-center space-x-4">
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
											onOpenChange={handleOpenChange}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col sm:hidden">
					<SearchSection className="w-full" />
				</div>
			</div>
		</>
	);
};
export default NavbarClient;
