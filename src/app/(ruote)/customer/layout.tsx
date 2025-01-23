import CustomerSidebar from "@/components/CustomerSidebar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { redirect } from "next/navigation";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<MaxWidthWrapper>
			<div className="flex max-lg:flex-col text-grey-1">
				<div className="hidden md:flex">
					<CustomerSidebar />
				</div>
				<div className="md:pl-[50px] flex-1">{children}</div>
			</div>
		</MaxWidthWrapper>
	);
};
export default MainLayout;
