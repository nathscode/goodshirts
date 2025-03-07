"use client";
import { cn } from "@/src/lib/utils";
import { SidebarItemProps } from "@/src/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SidebarItem: React.FC<SidebarItemProps> = ({
	icon,
	label,
	href,
	onClick,
}) => {
	const pathname = usePathname();
	const active = pathname === href;

	return (
		<div className="w-full flex px-2 flex-col py-1">
			<Link href={href} onClick={onClick}>
				<button
					className={cn(
						"flex flex-row h-auto items-center w-full px-5 py-4 gap-4 text-md font-semibold cursor-pointer hover:text-white hover:bg-black group text-foreground rounded-2xl transition-all",
						active ? "bg-black text-white rounded-2xl" : ""
					)}
				>
					{icon}
					<p className={`truncate w-100 capitalize`}>{label}</p>
				</button>
			</Link>
		</div>
	);
};

export default SidebarItem;
