import { auth } from "@/auth";
import CustomerSidebar from "@/src/components/CustomerSidebar";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";
import { redirect } from "next/navigation";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth();
	if (!session?.user) {
		return redirect("/login");
	}
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
