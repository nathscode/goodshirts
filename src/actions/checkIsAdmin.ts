"use server";
import getCurrentUser from "./getCurrentUser";

export default async function checkIsAdmin() {
	const session = await getCurrentUser();
	if (!session) {
		return null;
	}

	if (!session.isAdmin) {
		return false;
	}

	return true;
}
