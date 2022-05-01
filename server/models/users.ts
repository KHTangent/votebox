import { Pool, DatabaseError, QueryResult } from "pg";
import { hash, verify } from "argon2";

interface DbUser {
	id: string;
	username: string;
	password: string;
}

export default class User {
	id: string;
	username: string;

	private constructor(id: string, username: string) {
		this.id = id;
		this.username = username;
	}

	static async fromUuid(pool: Pool, uuid: string) {
		const query = {
			text: "SELECT * FROM users WHERE id = $1",
			values: [uuid],
		};
		const result = await pool.query(query);
		if (result.rowCount < 1) {
			throw createError({ statusCode: 404, message: "User not found" });
		}
		const foundUser = result.rows[0] as DbUser;
		return new User(foundUser.id, foundUser.username);
	}

	static async register(pool: Pool, username: string, password: string) {
		const pwHash = await hash(password);
		const query = {
			text:
				"INSERT INTO users(username, password" +
				"VALUES ($1, $2)" +
				"RETURNING *",
			values: [username, pwHash],
		};
		let result: QueryResult;
		try {
			result = await pool.query(query);
		} catch (e: unknown) {
			if (e instanceof DatabaseError) {
				if (e.constraint === "users_username_key") {
					throw createError({
						statusCode: 400,
						message: "Username is taken",
					});
				}
			}
			throw createError({
				statusCode: 500,
			});
		}
		if (result.rowCount < 1) {
			throw createError({
				statusCode: 500,
			});
		}
		const foundUser = result.rows[0] as DbUser;
		return new User(foundUser.id, foundUser.username);
	}

	static async login(pool: Pool, username: string, password: string) {
		const query = {
			text: "SELECT * FROM users WHERE username = $1",
			values: [username],
		};
		const result = await pool.query(query);
		if (result.rowCount < 1) {
			throw createError({ statusCode: 404, message: "Invalid login" });
		}
		const foundUser = result.rows[0] as DbUser;
		if (!(await verify(foundUser.password, password))) {
			throw createError({ statusCode: 404, message: "Invalid login" });
		}
		return new User(foundUser.id, foundUser.username);
	}
}
