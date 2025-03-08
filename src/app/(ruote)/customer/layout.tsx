import CustomerSidebar from "@/src/components/CustomerSidebar";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<MaxWidthWrapper>
			<div className="flex max-lg:flex-col pt-5">
				<div className="hidden md:flex">
					<CustomerSidebar />
				</div>
				<div className="md:pl-[50px] flex-1">{children}</div>
			</div>
		</MaxWidthWrapper>
	);
};
export default MainLayout;
