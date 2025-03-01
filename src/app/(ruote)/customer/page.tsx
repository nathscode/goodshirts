import CustomerSidebar from "@/src/components/CustomerSidebar";
import MaxWidthWrapper from "@/src/components/MaxWidthWrapper";

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
