import pg from "pg";
import { hash, verify } from "argon2";
import { promisify } from "util";
import { randomBytes } from "crypto";
const randomBytesPromisify = promisify(randomBytes);

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

	/**
	 * Fetches a user from the database by ID
	 * @param pool Database connection pool to use
	 * @param uuid UUID of user to fetch
	 * @returns Found user
	 * @throws Relevant H3Error if anything goes wrong
	 */
	static async fromUuid(pool: pg.Pool, uuid: string) {
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

	/**
	 * Create a new user with the specified credentials
	 * @param pool Database connection pool to use
	 * @param username Username of new user
	 * @param password Plaintext password to use
	 * @returns Newly created user
	 * @throws Relevant H3Error if something goes wrong
	 */
	static async register(pool: pg.Pool, username: string, password: string) {
		const pwHash = await hash(password);
		const query = {
			text:
				"INSERT INTO users(username, password)" +
				"VALUES ($1, $2)" +
				"RETURNING *",
			values: [username, pwHash],
		};
		let result: pg.QueryResult;
		try {
			result = await pool.query(query);
		} catch (e: unknown) {
			if (e instanceof pg.DatabaseError) {
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

	/**
	 * Fetches a user by access token
	 * @param pool Database connection pool to use
	 * @param token Access token
	 */
	static async fromToken(pool: pg.Pool, token: string) {
		let query = {
			text:
				"SELECT id, username, password " +
				"FROM users JOIN access_tokens ON id = user_id " +
				"WHERE token = $1",
			values: [token],
		};
		const result = await pool.query(query);
		if (result.rowCount < 1) {
			throw createError({ statusCode: 401 });
		}
		const foundUser = result.rows[0] as DbUser;
		query.text = "UPDATE access_tokens SET last_used = NOW() WHERE token = $1";
		await pool.query(query);
		return new User(foundUser.id, foundUser.username);
	}

	/**
	 * Fetches a user by credentials
	 * @param pool Database connection pool to use
	 * @param username Username to log in
	 * @param password Plaintext password
	 * @returns Found user
	 * @throws Relevant H3Error if something goes wrong, like incorrect credentials
	 */
	static async login(pool: pg.Pool, username: string, password: string) {
		const query = {
			text: "SELECT * FROM users WHERE username = $1",
			values: [username],
		};
		const result = await pool.query(query);
		if (result.rowCount < 1) {
			throw createError({ statusCode: 400, message: "Invalid login" });
		}
		const foundUser = result.rows[0] as DbUser;
		if (!(await verify(foundUser.password, password))) {
			throw createError({ statusCode: 400, message: "Invalid login" });
		}
		return new User(foundUser.id, foundUser.username);
	}

	/**
	 * Invalidates one or more access tokens
	 * @param pool Database connection pool to use
	 * @param token Access token to invalidate. If empty, invalidate all tokens belonging to this user.
	 */
	async logout(pool: pg.Pool, token?: string) {
		let query: pg.QueryConfig;
		if (token) {
			query = {
				text: "DELETE FROM access_tokens WHERE user_id = $1 AND token = $2",
				values: [this.id, token],
			};
		} else {
			query = {
				text: "DELETE FROM access_tokens WHERE user_id = $1",
				values: [this.id],
			};
		}
		await pool.query(query);
	}

	/**
	 * Generates a new access token for this user
	 * @param pool Database connection pool to use
	 */
	async getAccessToken(pool: pg.Pool): Promise<string> {
		const token = (await randomBytesPromisify(64)).toString("base64");
		const query = {
			text: "INSERT INTO access_tokens(user_id, token)" + "VALUES ($1, $2)",
			values: [this.id, token],
		};
		try {
			await pool.query(query);
		} catch (e) {
			throw createError({
				statusCode: 500,
				message: "error creating token",
			});
		}
		return token;
	}
}
