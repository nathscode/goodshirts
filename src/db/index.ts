import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (typeof window !== "undefined") {
	throw new Error("Database configuration should not run on the client!");
}

const caCert = process.env.PG_SSL_CA!;

if (!caCert) {
	console.error("PG_SSL_CA is not defined.");
	process.exit(1);
}

const pool = new Pool({
	host: process.env.DATABASE_HOST!,
	port: parseInt(process.env.DATABASE_PORT!, 10),
	user: process.env.DATABASE_USER!,
	password: process.env.DATABASE_PASSWORD!,
	database: process.env.DATABASE_NAME!,
	ssl: { ca: caCert },
});

const db = drizzle(pool, { schema });

export type db = typeof db;
export default db;
