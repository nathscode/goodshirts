import "dotenv/config";
import type { Config } from "drizzle-kit";
const caCert = process.env.PG_SSL_CA!;

if (!caCert) {
	console.error("PG_SSL_CA is not defined.");
	process.exit(1);
}

const config: Config = {
	out: "./src/db/migrations",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		host: process.env.DATABASE_HOST!,
		port: parseInt(process.env.DATABASE_PORT!),
		user: process.env.DATABASE_USER!,
		password: process.env.DATABASE_PASSWORD!,
		database: process.env.DATABASE_NAME!,
		ssl: {
			ca: caCert,
		},
	},
};

export default config;
