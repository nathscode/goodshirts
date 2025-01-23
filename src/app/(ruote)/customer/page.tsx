import CustomerSidebar from "@/components/CustomerSidebar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

type Props = {};

const CustomerPage = async (props: Props) => {
	return (
		<MaxWidthWrapper>
			<div className="md:hidden">
				<CustomerSidebar />
			</div>
		</MaxWidthWrapper>
	);
};

export default CustomerPage;
