"use client";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from "@/src/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LogoutButton from "../LogoutButton";
import { SiteLogo } from "../SiteLogo";
import { navMain } from "../sidebar";
import SidebarItem from "../sidebar/sidebarItem";
import { Separator } from "../ui/separator";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DashboardMobileSheet({ open, onOpenChange }: Props) {
	const router = useRouter();
	const handleLinkClick = (href: string) => {
		onOpenChange(false);
		router.push(href);
	};

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
					<div className="size-full flex flex-col text-[13px]">
						{navMain.map((item) => (
							<SidebarItem
								key={item.title}
								icon={item.icon}
								label={item.title}
								href={item.url}
								onClick={() => handleLinkClick(item.url)}
							/>
						))}
					</div>

					<Separator className="bg-gray-200 my-4" />
					<LogoutButton
						iconClassName="size-3"
						className="text-gray-700 text-sm"
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
}
