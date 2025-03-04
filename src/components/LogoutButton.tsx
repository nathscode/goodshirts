"use client";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
	const onLogoutClick = async () => {
		const response = await signOut({
			redirect: true,
		});
		toast.success("Logout successful");
	};
	return (
		<li className="w-full">
			<button
				onClick={onLogoutClick}
				className="flex justify-start flex-1 space-x-4 items-center py-3 px-4 font-medium tracking-wide w-full text-gray-700transition-colors duration-200 hover:bg-slate-200"
			>
				<LogOut className="size-5" />
				<span>Log out</span>
			</button>
		</li>
	);
}
