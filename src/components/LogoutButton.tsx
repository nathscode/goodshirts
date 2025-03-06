"use client";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

type Props = {
	className?: string;
	iconClassName?: string;
};
export default function LogoutButton({ className, iconClassName }: Props) {
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
				className={`flex justify-start flex-1 space-x-4 items-center py-3 px-4 font-medium tracking-wide w-full text-gray-700transition-colors duration-200 hover:bg-slate-200 ${className}`}
			>
				<LogOut className={`size-5 ${iconClassName}`} />
				<span>Log out</span>
			</button>
		</li>
	);
}
