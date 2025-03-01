import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Box, ChevronDown, Heart, User2 } from "lucide-react";
import { CustomUser } from "@/src/types";
import Link from "next/link";
import { Button } from "../ui/button";
import { logout } from "@/src/actions/user.action";
import { toast } from "sonner";

type Props = {
	user: CustomUser;
};

const AccountDropdown = ({ user }: Props) => {
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
		<>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Button variant={"ghost"}>
						<div className="flex justify-start items-center space-x-2">
							<User2 className="size-4" />
							<span className="text-xs capitalize">
								Hi, {`${user.firstName}`}{" "}
							</span>
							<ChevronDown className="size-4" />
						</div>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="max-w-64 py-2 px-0 space-y-2">
					<DropdownMenuItem className="flex flex-col text-left justify-start items-start pr-20">
						<Link
							href={"/customer/account"}
							className="inline-flex justify-start text-left items-center space-x-4"
						>
							<User2 className="size-5" />
							<span className="text-[13px]">My Account</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="flex flex-col text-left justify-start items-start pr-20">
						<Link
							href={"/customer/orders"}
							className="inline-flex justify-start text-left items-center space-x-4"
						>
							<Box className="size-5" />
							<span className="text-[13px]">Orders</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="flex flex-col text-left justify-start items-start pr-20">
						<Link
							href={"/customer/saved"}
							className="inline-flex justify-start text-left items-center space-x-4"
						>
							<Heart className="size-5" />
							<span className="text-[13px]">Wishlist</span>
						</Link>
					</DropdownMenuItem>

					<DropdownMenuSeparator />
					<DropdownMenuItem className="flex flex-col justify-center items-center py-0">
						<Button
							variant={"ghost"}
							className="text-red-500 hover:text-red-500 py-2"
							onClick={onLogoutClick}
						>
							Logout
						</Button>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

export default AccountDropdown;
