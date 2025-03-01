import getCurrentUser from "@/src/actions/getCurrentUser";
import db from "@/src/db";
import { addressTable, addressTypeEnum } from "@/src/db/schema";
import { getLogger } from "@/src/lib/backend/logger";
import { handlerNativeResponse } from "@/src/lib/utils";
import {
	AddressSchema,
	AddressSchemaInfer,
} from "@/src/lib/validators/address";
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
