"use client";

import {
	BarChart,
	Box,
	Cog,
	Layout,
	LayoutDashboard,
	LibraryBig,
	LogOut,
	Tag,
	Users,
} from "lucide-react";
import * as React from "react";

import { logout } from "@/src/actions/user.action";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { SiteLogo } from "../SiteLogo";
import { SecondarySidebarItem } from "./SecondarySidebarItem";
import { SidebarNavItem } from "./SidebarNavItem";
import Link from "next/link";

const data = {
	navSecondary: [
		{
			title: "Settings",
			url: "#",
			icon: <Cog className="size-5" />,
			isActive: false,
		},
	],
};
export const navMain = [
	{
		title: "Overview",
		url: "/dashboard",
		icon: <LayoutDashboard className="size-5" />,
	},
	{
		title: "Orders",
		url: "/dashboard/orders",
		icon: <Box className="size-5" />,
	},
	{
		title: "Products",
		url: "/dashboard/products",
		icon: <Tag className="size-5" />,
	},
	{
		title: "Category",
		url: "/dashboard/categories",
		icon: <LibraryBig className="size-5" />,
	},
	{
		title: "Collections",
		url: "/dashboard/collections",
		icon: <Layout className="size-5" />,
	},
	{
		title: "customers",
		url: "/dashboard/customers",
		icon: <Users className="size-5" />,
	},
	{
		title: "analytics",
		url: "/dashboard/analytics",
		icon: <BarChart className="size-5" />,
	},
];
export function AppSidebar({ ...props }: React.ComponentProps<any>) {
	const onLogoutClick = async () => {
		const response = await logout();
		if (response.success) {
			toast.success("Logout successful");
			window.location.href = "/login";
		} else {
			toast.error(response.message);
		}
	};
	return (
		<section className="flex h-full w-full flex-col" {...props}>
			<div className="flex flex-col gap-2 p-2">
				<div className="flex flex-col justify-center items-center w-full">
					<div className="flex flex-col justify-center items-center w-full">
						<Link href="/">
							<SiteLogo className="w-20" />
						</Link>
					</div>
				</div>
			</div>
			<div
				role="content"
				className="flex min-h-0 flex-1 h-full justify-between flex-col gap-2 overflow-auto"
			>
				<SidebarNavItem items={navMain} />
				<SecondarySidebarItem items={data.navSecondary} />
			</div>
			<div className="flex flex-col gap-2 p-2 justify-end">
				<button
					onClick={onLogoutClick}
					className="
						flex flex-row h-auto items-center w-full px-5 py-4 gap-4 text-md font-semibold cursor-pointer hover:text-white hover:bg-black group text-foreground rounded-2xl transition-all"
				>
					<LogOut className="size-5" />
					<p className={`truncate w-100 capitalize`}>Log out</p>
				</button>
			</div>
		</section>
	);
}
