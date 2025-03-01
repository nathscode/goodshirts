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
			<main className="relative flex flex-col min-h-screen">
				<Navbar />
				<div className="flex-grow flex-1">{children}</div>
				<ScrollUp />
				<Footer />
			</main>
		</div>
	);
}
