import { formatCurrency } from "@/src/lib/utils";
import {
	Body,
	Container,
	Head,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import { CartItem } from "../hooks/use-cart";

interface OrderCreatedProps {
	orderNum?: string;
	payable?: string;
	address?: string;
	orderItem: CartItem[];
	id?: string;
}

const OrderCreated = ({
	orderNum = "0",
	payable = "0",
	id = "My Project",
	address = "address",
	orderItem,
}: OrderCreatedProps) => {
	const previewText = `Order #${orderNum} was created was created with a value of $${payable}.`;
	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={{ marginTop: "32px" }}>
						<Img
							src="https://i.ibb.co/M0rWz67/summary-logo.jpg"
							width="100"
							height="100"
							alt="Africagoodshirts logo"
							style={logo}
						/>
					</Section>
					<Hr style={hr} />
					<Section style={{ marginTop: "32px" }}>
						<Text style={h1}>
							<strong>Thank You For Your Order!</strong>
						</Text>
						<Text style={paragraph}>
							Your order is in process; once it's confirmed, your order will be
							active. Be patient; we will update you in all the processes.
						</Text>
					</Section>
					<Section style={{ marginTop: "32px" }}>
						<table
							width={"94%"}
							style={spacing}
							border={0}
							cellPadding="0"
							cellSpacing="10"
							align="center"
						>
							<tr>
								<td width="70%" align="left" style={tableStyleTop}>
									Order Number
								</td>
								<td width="30%" align="right" style={tableStyleTop}>
									{orderNum}
								</td>
							</tr>
							{orderItem.map((cartItem, index) => (
								<tr>
									<td width="70%" align="left" style={tableStyle}>
										{`${cartItem.item.name}-${cartItem.variant.color}-${cartItem.size.size}`}{" "}
										{`x ${cartItem.quantity}`}
									</td>
									<td width="30%" align="right" style={tableStyle}>
										{cartItem.size.discountPrice
											? formatCurrency(
													Number(cartItem.size.discountPrice) *
														cartItem.quantity
												)
											: formatCurrency(
													Number(cartItem.size.price) * cartItem.quantity
												)}
									</td>
								</tr>
							))}
							<Hr style={hr} />
							<tr>
								<td width="70%" align="left" style={tableStyleBold}>
									Total
								</td>
								<td width="30%" align="right" style={tableStyleBold}>
									{payable}
								</td>
							</tr>
							<Hr style={hr} />
						</table>
					</Section>
					<Section style={{ marginTop: "10px" }}>
						<Text style={text}>
							<strong>Shipping Address</strong>
						</Text>
						<Text style={text}>{address}</Text>
					</Section>
					<Section style={{ textAlign: "center" }}>
						<Link
							href={`${process.env.NEXT_PUBLIC_APP_URL}/customer/orders/track/${id}`}
							style={cta}
						>
							Track Order
						</Link>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

export default OrderCreated;

const main = {
	backgroundColor: "#ffffff",
	margin: "0 auto",
};

const container = {
	border: "1px solid #eaeaea",
	borderRadius: "5px",
	margin: "40px auto",
	padding: "20px",
	width: "550px",
};

const logo = {
	margin: "0 auto",
};

const h1 = {
	color: "#000",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "24px",
	fontWeight: "normal",
	textAlign: "center" as const,
	margin: "30px 0",
	padding: "0",
};

const paragraph = {
	color: "#525f7f",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
	fontSize: "16px",
	lineHeight: "24px",
	textAlign: "left" as const,
};

const link = {
	color: "#FE0000",
	textDecoration: "none",
};

const text = {
	color: "#000",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	lineHeight: "24px",
};

const black = {
	color: "black",
};

const center = {
	verticalAlign: "middle",
};

const tableStyle = {
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	color: "#252525",
	padding: "10px",
	paddingLeft: 0,
};
const tableStyleBold = {
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	color: "#252525",
	padding: "10px",
	fontWeight: "700",
	paddingLeft: 0,
};
const tableStyleTop = {
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	color: "#252525",
	backgroundColor: "#EEEEEE",
	padding: "10px",
	paddingLeft: 0,
};

const btn = {
	backgroundColor: "#000",
	borderRadius: "5px",
	color: "#fff",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "12px",
	fontWeight: 500,
	lineHeight: "50px",
	textDecoration: "none",
	textAlign: "center" as const,
};

const cta = {
	padding: "13px 20px",
	borderRadius: "5px",
	backgroundColor: "#000",
	textAlign: "center" as const,
	color: "#fff",
	display: "block",
	width: "45%",
	margin: "0.5rem auto 0 auto",
};

const spacing = {
	marginBottom: "26px",
};

const hr = {
	border: "none",
	borderTop: "1px solid #eaeaea",
	margin: "10px 0",
	width: "100%",
};

const footer = {
	color: "#666666",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "12px",
	lineHeight: "24px",
};
