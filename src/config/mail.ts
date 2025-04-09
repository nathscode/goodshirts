const brevo = require("@getbrevo/brevo");
const apiInstance = new brevo.TransactionalEmailsApi();

const apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.BREVO_API_KEY!;

export async function sendEmail({
	to,
	from,
	subject,
	html,
	text,
	replyTo,
	params,
	headers,
}: {
	to:
		| string
		| { email: string; name?: string }
		| (string | { email: string; name?: string })[];
	from: { email: string; name?: string };
	subject: string;
	html: string;
	text?: string;
	replyTo?: { email: string; name?: string };
	params?: Record<string, any>;
	headers?: Record<string, string>;
}) {
	try {
		const recipients = (Array.isArray(to) ? to : [to]).map((recipient) =>
			typeof recipient === "string" ? { email: recipient } : recipient
		);

		const sendSmtpEmail = new brevo.SendSmtpEmail();

		sendSmtpEmail.subject = subject;
		sendSmtpEmail.htmlContent = html;
		if (text) sendSmtpEmail.textContent = text;
		sendSmtpEmail.sender = from;
		sendSmtpEmail.to = recipients;

		if (replyTo) {
			sendSmtpEmail.replyTo = replyTo;
		}

		if (headers) {
			sendSmtpEmail.headers = headers;
		}

		if (params) {
			sendSmtpEmail.params = params;
		}

		const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

		return { success: true, response };
	} catch (error: any) {
		console.error("Error sending Brevo email:", error);
		if (error.response?.body) console.error(error.response.body);
		return { success: false, error };
	}
}
