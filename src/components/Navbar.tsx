import getCurrentUser from "../actions/getCurrentUser";
import MaxWidthWrapper from "./MaxWidthWrapper";
import NavbarClient from "./NavbarClient";

const Navbar = async () => {
	const session = await getCurrentUser();
	return (
		<>
			<div className="fixed z-[50] w-full bg-white">
				<MaxWidthWrapper>
					<NavbarClient session={session} />
				</MaxWidthWrapper>
			</div>
			<div className="block py-10"></div>
		</>
	);
};
export default Navbar;
