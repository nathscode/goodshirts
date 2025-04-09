import { site } from "@/src/config/site";
import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
	name?: string;
	token?: string;
}

const PasswordResetEmail = ({
	name = "",
	token = "",
}: PasswordResetEmailProps) => {
	const previewText = `[${site.name}] Password Reset email.`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="my-auto mx-auto w-full max-w-lg">
					<Container className="border border-solid border-neutral-500/25 rounded mx-auto p-6">
						<Section style={{ marginTop: "32px" }}>
							<Img
								src="https://i.ibb.co/M0rWz67/summary-logo.jpg"
								width="100"
								height="100"
								alt="Africagoodshirts logo"
								className="mx-auto my-0"
							/>
						</Section>
						<Hr className="my-5 border border-[#eaeaea] w-full" />
						<Heading className="mt-0">{site.name}</Heading>
						<Heading className="mt-0">{`Hi, ${name}`}</Heading>
						<Text>Forgot your password? Let's get you a new one.</Text>
						<Text>
							{`If you lost or would like to reset your ${site.name} account password,
							please click the button below:.`}
						</Text>
						<div className="w-3/4 bg-neutral-500/5 border border-solid border-neutral-400/25 rounded-lg px-6">
							<Button
								className="w-full py-4 px-6 text-center text-white bg-black hover:bg-gray-800 rounded-lg"
								href={`${
									process.env.NEXT_PUBLIC_APP_URL
								}/account/${encodeURIComponent(token)}/reset`}
							>
								Reset password
							</Button>
						</div>
						<Text>
							This link and code will only be valid for the next 1 hour. Ignore
							message if you did not request for password reset.
						</Text>
						<Hr className="border border-solid border-neutral-500/25 my-4 mx-0 w-full" />
						<Text className="text-xs text-center mx-auto text-neutral-500/75">
							© {new Date().getFullYear()} {name}™. All Rights Reserved.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
export default PasswordResetEmail;
