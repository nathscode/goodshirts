import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import ScrollUp from "@/src/components/ScrollUp";
import React from "react";

type Props = {};

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className="h-full overflow-y-auto overflow-x-hidden">
				<Navbar />
				<div className="min-h-screen flex-grow flex-1 pt-10">{children}</div>
				<ScrollUp />
				<Footer />
			</div>
		</div>
	);
}
