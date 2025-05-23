import { NextRequest, NextResponse } from "next/server";
import {
	orders,
	orderItems,
	addressTable,
	payments,
	paymentMethodEnum,
	guestUsers,
} from "@/src/db/schema";
import { and, eq } from "drizzle-orm";
import db from "@/src/db";
import getCurrentUser from "@/src/actions/getCurrentUser";
import { render } from "@react-email/render";
import {
	generateCryptoString,
	handlerNativeResponse,
	normalizeEmail,
} from "@/src/lib/utils";
import { getLogger } from "@/src/lib/backend/logger";
import OrderCreated from "@/src/emails/order-created";
import { sendEmail } from "@/src/config/mail";
import { site } from "@/src/config/site";

const logger = getLogger();

// Helper function to validate input data
function validateInput(formData: FormData) {
	const addressId = formData.get("addressId") as string;
	const reference = formData.get("reference") as string;
	const shippingFee = Number(formData.get("shippingFee"));
	const totalAmount = Number(formData.get("total"));
	const payable = Number(formData.get("payable"));
	const cartItems = JSON.parse(formData.get("cartItems") as string);

	if (!Array.isArray(cartItems) || cartItems.length === 0) {
		throw new Error("Invalid input data");
	}

	return { addressId, reference, shippingFee, totalAmount, payable, cartItems };
}

// Helper function to send order confirmation emails
async function sendOrderConfirmationEmails(email: string, orderDetails: any) {
	const emailHtml = await render(
		OrderCreated({
			id: orderDetails.id,
			payable: orderDetails.payable.toFixed(2),
			orderNum: orderDetails.orderNumber,
			address: `${orderDetails.address.landmark} ${orderDetails.address.addressLine1}`,
			orderItem: orderDetails.cartItems,
		})
	);

	try {
		const emailPayload = {
			from: {
				email: `goodshirtsafrica@gmail.com`,
				name: `${site.name} <no-reply@${site.domain}>`,
			},
			html: emailHtml,
			params: {
				orderId: orderDetails.id,
				customerName: "Good Shirts Africa Customer",
			},
		};

		await Promise.all([
			sendEmail({
				...emailPayload,
				to: email!,
				subject: `Your Order Created - #${orderDetails.orderNumber}`,
			}),
			sendEmail({
				...emailPayload,
				to: "goodshirtsafrica@gmail.com",
				subject: `New Order Created - #${orderDetails.orderNumber}`,
			}),
		]);
	} catch (error) {
		logger.error("Failed to send order confirmation email", error);
	}
}

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const {
			addressId,
			reference,
			shippingFee,
			totalAmount,
			payable,
			cartItems,
		} = validateInput(formData);

		const paymentType = formData.get("paymentType") as string;
		const guestUserData = formData.get("guestUser")
			? JSON.parse(formData.get("guestUser") as string)
			: null;

		// For guest orders, we don't require a session
		const session = await getCurrentUser();
		if (!session && !guestUserData) {
			return handlerNativeResponse(
				{ status: 401, errors: { message: "Unauthorized user" } },
				401
			);
		}

		const orderNumber = generateCryptoString(10);
		const finalTotal = totalAmount + shippingFee;
		const typedPayment =
			paymentType as (typeof paymentMethodEnum.enumValues)[number];

		// Start transaction
		const result = await db.transaction(async (tx) => {
			let guestUserId: string | undefined;
			let shippingAddressDetails: any;

			// Handle guest user logic
			if (guestUserData) {
				let formattedEmail = normalizeEmail(guestUserData.email);
				let existingGuestUser = null;
				if (guestUserData.email) {
					existingGuestUser = await tx.query.guestUsers.findFirst({
						where: and(
							eq(guestUsers.email, formattedEmail),
							eq(guestUsers.phoneNumber, guestUserData.phoneNumber)
						),
					});
				}

				// If guest user exists, use their ID
				if (existingGuestUser) {
					guestUserId = existingGuestUser.id;
					// Update guest user info if needed
					await tx
						.update(guestUsers)
						.set({
							firstName: guestUserData.firstName,
							lastName: guestUserData.lastName,
							state: guestUserData.state,
							lga: guestUserData.lga,
							city: guestUserData.city,
							streetAddress: guestUserData.streetAddress,
							whatsappNumber:
								guestUserData.whatsappNumber ||
								existingGuestUser.whatsappNumber,
						})
						.where(eq(guestUsers.id, guestUserId));
				} else {
					const [newGuestUser] = await tx
						.insert(guestUsers)
						.values({
							email: formattedEmail,
							phoneNumber: guestUserData.phoneNumber,
							whatsappNumber: guestUserData.whatsappNumber,
							firstName: guestUserData.firstName,
							lastName: guestUserData.lastName,
							state: guestUserData.state,
							lga: guestUserData.lga,
							city: guestUserData.city,
							streetAddress: guestUserData.streetAddress,
						})
						.returning();
					guestUserId = newGuestUser.id;
				}

				shippingAddressDetails = {
					...guestUserData,
					id: guestUserId,
				};
			} else {
				const existingAddress = await tx.query.addressTable.findFirst({
					where: eq(addressTable.id, addressId),
				});
				if (!existingAddress) {
					throw new Error("No address found");
				}
				shippingAddressDetails = existingAddress;
			}
			const [newOrder] = await tx
				.insert(orders)
				.values({
					userId: session?.id,
					guestUserId,
					orderNumber: orderNumber.toUpperCase(),
					grandTotal: finalTotal.toFixed(2),
					total: totalAmount.toFixed(2),
					shippingFee: shippingFee.toFixed(2),
					paymentType: typedPayment,
					shippingAddress: session?.id ? addressId : null,
					guestShippingAddress: guestUserId ? shippingAddressDetails : null,
				})
				.returning();
			const orderItemsData = cartItems.map((item: any) => ({
				orderId: newOrder.id,
				productId: item.item.id,
				variantId: item.variant.id,
				sizeId: item.size.id,
				quantity: item.quantity,
				price: item.size.price,
				discountPrice: item.size.discountPrice || null,
			}));

			await tx.insert(orderItems).values(orderItemsData);

			// Create payment record
			await tx.insert(payments).values({
				userId: session?.id,
				guestUserId,
				orderId: newOrder.id,
				refId: reference,
				payable: payable.toFixed(2),
				paymentMethod: typedPayment,
				processor: typedPayment === "DELIVERY" ? "DELIVERY" : "PAYSTACK",
				status: "SUCCESS",
				isSuccessful: true,
			});

			return {
				newOrder,
				shippingAddress: shippingAddressDetails,
				cartItems,
				payable,
				email: session?.email || normalizeEmail(guestUserData?.email),
			};
		});

		if (result.email) {
			await sendOrderConfirmationEmails(result.email, {
				id: result.newOrder.id,
				payable: result.payable,
				orderNumber: result.newOrder.orderNumber,
				address: result.shippingAddress,
				cartItems: result.cartItems,
			});
		}

		return NextResponse.json({ success: true, order: result.newOrder });
	} catch (error: any) {
		logger.error("Error creating order:", error);
		return NextResponse.json(
			{ error: error.message || "Server error" },
			{ status: 500 }
		);
	}
}
