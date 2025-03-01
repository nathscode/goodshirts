import { Users } from "@/src/db/schema";
import { AdapterUser } from "@auth/core/adapters";

// Helper function to ensure type is never null
function getNonNullType(
	role: "ADMIN" | "EMPLOYEE" | "SALES" | "CUSTOMER" | null
): "ADMIN" | "EMPLOYEE" | "SALES" | "CUSTOMER" {
	return role ?? "CUSTOMER"; // Default to CUSTOMER if role is null
}

// Map database user to AdapterUser
export function mapToAdapterUser(dbUser: Users): AdapterUser {
	// Ensure the type is never null
	const userType = getNonNullType(dbUser.role);

	return {
		id: dbUser.id,
		email: dbUser.email,
		emailVerified: dbUser.emailVerified,
		firstName: dbUser.firstName ?? null,
		lastName: dbUser.lastName ?? null,
		type: userType,
		isAdmin: userType === "ADMIN",
		name: `${dbUser.firstName || ""} ${dbUser.lastName || ""}`.trim() || null,
		image: dbUser.image ?? null,
	};
}
// You might also want to add a type guard to ensure type safety
export function isAdapterUser(user: any): user is AdapterUser {
	return (
		user &&
		typeof user.id === "string" &&
		typeof user.email === "string" &&
		typeof user.type === "string" &&
		typeof user.isAdmin === "boolean"
	);
}
