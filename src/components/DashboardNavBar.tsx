"use client";
import { useState } from "react";
import SearchBar from "./SearchBar";
import UserAvatar from "./common/UserAvatar";
import { DashboardMobileSheet } from "./modal/DashboardMobileSheet";

type Props = {
	initials: string;
};

const DashboardNavBar = ({ initials }: Props) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	return (
		<div className="flex flex-1 w-full justify-between items-center gap-4 mb-8">
			<div className="sm:hidden">
				<DashboardMobileSheet open={isMenuOpen} onOpenChange={setIsMenuOpen} />
			</div>
			<div className="justify-start w-full">
				<SearchBar />
			</div>
			<div className="justify-end">
				<UserAvatar name={initials} />
			</div>
		</div>
	);
};

export default DashboardNavBar;
