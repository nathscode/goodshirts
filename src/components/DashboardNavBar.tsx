import React from "react";
import SearchBar from "./SearchBar";
import UserAvatar from "./common/UserAvatar";

type Props = {};

const DashboardNavBar = (props: Props) => {
	return (
		<div className="flex flex-1 w-full justify-between mb-8">
			<div className="justify-start w-1/2">
				<SearchBar />
			</div>
			<div className="justify-end">
				<UserAvatar name="MN" />
			</div>
		</div>
	);
};

export default DashboardNavBar;
