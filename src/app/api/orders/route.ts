import { NextRequest, NextResponse } from "next/server";
import {
	orders,
	orderItems,
	addressTable,
	payments,
	paymentMethodEnum,
} from "@/src/db/schema";
import { eq } from "drizzle-orm";
import db from "@/src/db";
import getCurrentUser from "@/src/actions/getCurrentUser";
import { render } from "@react-email/render";
import { generateCryptoString, handlerNativeResponse } from "@/src/lib/utils";
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

	if (!addressId || !Array.isArray(cartItems) || cartItems.length === 0) {
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
		const addressId = formData.get("addressId") as string;
		const reference = formData.get("reference") as string;
		const paymentType = formData.get("paymentType") as string;
		const shippingFee = Number(formData.get("shippingFee"));
		const totalAmount = Number(formData.get("total"));
		const payable = Number(formData.get("payable"));
		const cartItems = JSON.parse(formData.get("cartItems") as string);

		if (!addressId || !Array.isArray(cartItems) || cartItems.length === 0) {
			throw new Error("Invalid input data");
		}

		const session = await getCurrentUser();
		if (!session) {
			return handlerNativeResponse(
				{ status: 401, errors: { message: "Unauthorized user" } },
				401
			);
		}

		const existingAddress = await db.query.addressTable.findFirst({
			where: eq(addressTable.id, addressId),
		});

		if (!existingAddress) {
			return handlerNativeResponse(
				{ status: 403, errors: { message: "No address found" } },
				403
			);
		}

		const orderNumber = generateCryptoString(10);
		const finalTotal = totalAmount + shippingFee;
		const typedPayment =
			paymentType as (typeof paymentMethodEnum.enumValues)[number];

		// Start a database transaction
		const result = await db.transaction(async (tx) => {
			const [newOrder] = await tx
				.insert(orders)
				.values({
					userId: session.id,
					orderNumber: orderNumber.toUpperCase(),
					grandTotal: finalTotal.toFixed(2),
					total: totalAmount.toFixed(2),
					shippingFee: shippingFee.toFixed(2),
					paymentType: typedPayment,
					shippingAddress: existingAddress.id,
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
			await tx.insert(payments).values({
				//@ts-ignore
				userId: session.id,
				orderId: newOrder.id,
				refId: reference,
				payable: payable.toFixed(2),
				paymentMethod: typedPayment,
				processor: typedPayment === "DELIVERY" ? "DELIVERY" : "PAYSTACK",
				status: "SUCCESS",
				isSuccessful: true,
			});

			return { newOrder, existingAddress, cartItems, payable };
		});

		// Send order confirmation emails
		await sendOrderConfirmationEmails(session.email!, {
			id: result.newOrder.id,
			payable: result.payable,
			orderNumber: result.newOrder.orderNumber,
			address: result.existingAddress,
			cartItems: result.cartItems,
		});

		return NextResponse.json({ success: true, order: result.newOrder });
	} catch (error: any) {
		logger.error("Error creating order:", error);
		return NextResponse.json(
			{ error: error.message || "Server error" },
			{ status: 500 }
		);
	}
}
