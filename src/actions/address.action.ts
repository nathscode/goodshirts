"use server";
import { and, desc, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import { AddressType, addressTable } from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";

const logger = getLogger();

export async function getUserAddressById(
	id: string
): Promise<AddressType | null> {
	noStore();

	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}
	if (!id) {
		return null;
	}
	try {
		const address = await db.query.addressTable.findFirst({
			where: and(eq(addressTable.userId, id), eq(addressTable.isDefault, true)),
		});

		if (!address) return null;
		const plainAddress = JSON.parse(JSON.stringify(address));
		return plainAddress;
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to fetch address");
	}
}
export async function getAllUserAddressById(): Promise<AddressType[] | []> {
	noStore();

	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}

	try {
		const addresses = await db
			.select()
			.from(addressTable)
			.where(eq(addressTable.userId, session.id!))
			.orderBy(desc(addressTable.isDefault));

		if (!addresses.length) return [];

		const plainAddresses = JSON.parse(JSON.stringify(addresses));
		return plainAddresses;
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to fetch address");
	}
}
