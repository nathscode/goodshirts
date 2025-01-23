import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { cn, constructMetadata } from "@/lib/utils";
import { Inter, Dela_Gothic_One } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Footer from "@/components/Footer";
import ScrollUp from "@/components/ScrollUp";

const inter = Inter({
	variable: "--font-inter",
	weight: ["400", "500", "700", "900"],
	subsets: ["latin"],
});
const dela = Dela_Gothic_One({
	variable: "--font-dela",
	weight: ["400"],
	subsets: ["latin"],
});

export const metadata = constructMetadata();

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="h-full">
			<body
				className={cn(
					"relative h-full font-sans antialiased",
					dela.className,
					inter.className
				)}
			>
				<main className="relative flex flex-col min-h-screen">
					<Providers>
						<Navbar />
						<div className="flex-grow flex-1">{children}</div>
						<ScrollUp />
						<Footer />
					</Providers>
				</main>

				<Toaster position="top-center" richColors />
			</body>
		</html>
	);
}
