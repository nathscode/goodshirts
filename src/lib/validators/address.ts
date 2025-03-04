import * as z from "zod";

export const AddressSchema = z.object({
	addressType: z.string().min(1, { message: "Address type required" }),
	phoneNumber: z.string().min(1, { message: "Phone Number is required" }),
	landmark: z.string().min(1, { message: "landmark is required" }),
	city: z.string().min(1, {
		message: "city is required",
	}),
	state: z.string().min(1, {
		message: "state is required",
	}),
	address: z.string().min(1, { message: "your address is required" }),
	postalCode: z.string().optional(),
	addressId: z.string().optional(),
});

export type AddressSchemaInfer = z.infer<typeof AddressSchema>;
