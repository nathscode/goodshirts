import getCurrentUser from "@/src/actions/getCurrentUser";
import db from "@/src/db";
import { addressTable, addressTypeEnum } from "@/src/db/schema";
import { getLogger } from "@/src/lib/backend/logger";
import { handlerNativeResponse } from "@/src/lib/utils";
import {
	AddressSchema,
	AddressSchemaInfer,
} from "@/src/lib/validators/address";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

const logger = getLogger();
export async function POST(req: NextRequest) {
	try {
		const session = await getCurrentUser();
		if (!session) {
			return handlerNativeResponse(
				{
					status: 401, // Unauthorized
					errors: {
						message: "Unauthorized user",
					},
				},
				401
			);
		}
		const body: AddressSchemaInfer = await req.json();
		const payload = AddressSchema.safeParse(body);
		if (!payload.success) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: payload.error.message,
					},
				},
				400
			);
		}

		const { addressType, address, phoneNumber, landmark, state, city } =
			payload.data;
		let fullName = `${session?.firstName} ${session?.lastName}`;
		const typedAddressType =
			addressType as (typeof addressTypeEnum.enumValues)[number];
		const [newAddress] = await db
			.insert(addressTable)
			.values({
				userId: session.id,
				fullName: fullName,
				addressLine1: address,
				addressType: typedAddressType,
				landmark: landmark,
				state: state,
				city: city,
				country: "Nigeria",
				phoneNumber: phoneNumber,
			})
			.returning();

		if (!newAddress) {
			return handlerNativeResponse(
				{ status: 400, message: "No user created" },
				400
			);
		}
		return NextResponse.json({ status: "success" });
	} catch (error: any) {
		logger.info("USER ADDRESS CREATION ERROR", error);

		// Handle specific errors
		if (error instanceof ZodError) {
			return handlerNativeResponse(
				{
					status: 422,
					errors: { message: error.errors[0]?.message || "Validation failed" },
				},
				422
			);
		}

		// Return a generic server error response
		return handlerNativeResponse(
			{ status: 500, errors: { message: "Something went wrong" } },
			500
		);
	}
}

export async function PATCH(req: NextRequest) {
	try {
		const session = await getCurrentUser();
		if (!session) {
			return handlerNativeResponse(
				{
					status: 401, // Unauthorized
					errors: {
						message: "Unauthorized user",
					},
				},
				401
			);
		}

		// Extract addressId from the URL
		// const url = new URL(req.url);
		// const addressId = url.pathname.split("/").pop();
		// console.log("===============================");
		// console.log({ url });
		// console.log({ addressId });
		// console.log("===============================");

		// Parse and validate the request body
		const body: AddressSchemaInfer = await req.json();
		const payload = AddressSchema.safeParse(body);
		if (!payload.success) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: payload.error.message,
					},
				},
				400
			);
		}
		const {
			addressId,
			addressType,
			address,
			phoneNumber,
			landmark,
			state,
			city,
		} = payload.data;

		if (!addressId) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: "Address ID is required",
					},
				},
				400
			);
		}
		// Fetch the existing address to ensure it belongs to the user
		const existingAddress = await db
			.select()
			.from(addressTable)
			.where(eq(addressTable.id, addressId))
			.limit(1);

		if (!existingAddress || existingAddress.length === 0) {
			return handlerNativeResponse(
				{
					status: 404,
					errors: {
						message: "Address not found",
					},
				},
				404
			);
		}

		if (existingAddress[0].userId !== session.id) {
			return handlerNativeResponse(
				{
					status: 403,
					errors: {
						message: "You are not authorized to update this address",
					},
				},
				403
			);
		}

		// Update the address
		const typedAddressType =
			addressType as (typeof addressTypeEnum.enumValues)[number];

		const [updatedAddress] = await db
			.update(addressTable)
			.set({
				addressType: typedAddressType,
				addressLine1: address,
				phoneNumber: phoneNumber,
				landmark: landmark,
				state: state,
				city: city,
			})
			.where(eq(addressTable.id, addressId))
			.returning();

		if (!updatedAddress) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: "Failed to update address",
					},
				},
				400
			);
		}

		return NextResponse.json({ status: "success", data: updatedAddress });
	} catch (error: any) {
		console.error("ADDRESS UPDATE ERROR", error);

		// Handle specific errors
		if (error instanceof ZodError) {
			return handlerNativeResponse(
				{
					status: 422,
					errors: { message: error.errors[0]?.message || "Validation failed" },
				},
				422
			);
		}

		// Return a generic server error response
		return handlerNativeResponse(
			{ status: 500, errors: { message: "Something went wrong" } },
			500
		);
	}
}
