"use client";
import DashboardNavBar from "@/src/components/DashboardNavBar";
import { AppSidebar } from "@/src/components/sidebar";
import { useSidebarStore } from "@/src/hooks/use-sidebar";
import { useStore } from "zustand";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const { isSidebarOpen } = useStore(useSidebarStore);
	return (
		<div className="min-h-screen bg-slate-100 w-full relative overflow-hidden">
			<aside
				className={`hidden md:flex h-full border-r border-input z-30 flex-col fixed inset-y-0 ${
					isSidebarOpen ? "w-[300px]" : "w-0 hidden"
				} duration-300 `}
			>
				<AppSidebar />
			</aside>
			<main
				className={`${
					isSidebarOpen ? "md:pl-[300px]" : "md:pl-[300px] mb-10"
				}  size-full`}
			>
				<div className="flex-1 overflow-y-auto h-full p-4 md:p-6 relative z-10">
					<div className="relative min-h-full flex flex-col">
						<DashboardNavBar />
						<div className="h-full min-h-screen flex flex-col flex-1 space-y-4 bg-white rounded-lg">
							{children}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default DashboardLayout;
