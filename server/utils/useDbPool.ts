import { CompatibilityEvent } from "h3";
import pg from "pg";

let pool: pg.Pool;

export async function useDbPool(e: CompatibilityEvent): Promise<pg.Pool> {
	if (!pool) {
		pool = new pg.Pool({
			connectionString: process.env["DB_URL"],
		});
		const client = await pool.connect();
		client.release();
	}
	return pool;
}
