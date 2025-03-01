import { SessionProvider } from "next-auth/react";
import Providers from "@/src/components/Providers";
import { cn, constructMetadata } from "@/src/lib/utils";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
const inter = Inter({
	variable: "--font-inter",
	weight: ["400", "500", "700", "900"],
	subsets: ["latin"],
});
// const dela = Dela_Gothic_One({
// 	variable: "--font-dela",
// 	weight: ["400"],
// 	subsets: ["latin"],
// });

export const metadata = constructMetadata();

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="h-full">
			<body
				className={cn("relative h-full font-sans antialiased", inter.className)}
			>
				<SessionProvider>
					<main className="relative flex flex-col min-h-screen">
						<Providers>
							<div className="flex-grow flex-1">{children}</div>
						</Providers>
					</main>
					<Toaster position="top-center" richColors />
				</SessionProvider>
			</body>
		</html>
	);
}
