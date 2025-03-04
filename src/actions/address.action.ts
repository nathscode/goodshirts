"use server";
import { and, desc, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import db from "../db";
import { AddressType, addressTable } from "../db/schema";
import { getLogger } from "../lib/backend/logger";
import getCurrentUser from "./getCurrentUser";

const logger = getLogger();

export async function getUserAddress(): Promise<AddressType | null> {
	noStore();

	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}
	try {
		const address = await db.query.addressTable.findFirst({
			where: and(
				eq(addressTable.userId, session.id!),
				eq(addressTable.isDefault, true)
			),
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

export async function setDefaultAddress(addressId: string) {
	const session = await getCurrentUser();
	if (!session) {
		throw new Error("Unauthenticated User.. Try and Login");
	}

	try {
		const address = await db.query.addressTable.findFirst({
			where: and(
				eq(addressTable.id, addressId),
				eq(addressTable.userId, session.id!)
			),
		});

		if (!address) {
			throw new Error("Address not found");
		}

		const newDefaultStatus = !address.isDefault; // Toggle default status

		await db.transaction(async (tx) => {
			// If setting as default, remove default from all other addresses
			if (newDefaultStatus) {
				await tx
					.update(addressTable)
					.set({ isDefault: false })
					.where(eq(addressTable.userId, session.id!));
			}

			// Update selected address
			await tx
				.update(addressTable)
				.set({ isDefault: newDefaultStatus })
				.where(eq(addressTable.id, addressId));
		});

		return {
			status: "success",
			message: `Address ${newDefaultStatus ? "set" : "removed"} as default successfully`,
		};
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to update default address");
	}
}

export async function deleteUserAddress(addressId: string) {
	const session = await getCurrentUser();
	if (!session) {
		throw Error("Unauthenticated User.. Try and Login");
	}

	try {
		const deleted = await db
			.delete(addressTable)
			.where(
				and(
					eq(addressTable.id, addressId),
					eq(addressTable.userId, session.id!)
				)
			)
			.returning();

		if (!deleted) {
			return { status: "error", message: "Address not found or unauthorized" };
		}

		return { status: "success", message: "Address deleted successfully" };
	} catch (error) {
		logger.error("Database Error:", error);
		throw new Error("Failed to delete address");
	}
}
