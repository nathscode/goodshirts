"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const BackButton = ({ href }: { href?: string }) => {
	const router = useRouter();

	const navigateRoute = () => {
		if (href) {
			router.push(href);
		} else {
			router.back();
		}
	};

	return (
		<Button
			variant="ghost"
			className="hover:text-brand"
			onClick={navigateRoute}
		>
			<ArrowLeft className="w-5 h-5" />
		</Button>
	);
};

export default BackButton;
