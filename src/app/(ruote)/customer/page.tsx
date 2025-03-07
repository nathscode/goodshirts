import { redirect } from "next/navigation";

type Props = {};

const CustomerPage = async (props: Props) => {
	redirect("/customer/account");
};

export default CustomerPage;
