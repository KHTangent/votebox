import pg from "pg";
import User from "./users";

interface VotingOption {
	name: string;
	votes: number;
}

interface DbVoting {
	id: string;
	owner: string;
	title: string;
}

export default class Voting {
	id: string;
	owner: User;
	title: string;
	options: VotingOption[];

	private constructor(
		id: string,
		owner: User,
		title: string,
		options: VotingOption[]
	) {
		this.id = id;
		this.owner = owner;
		this.title = title;
		this.options = options;
	}

	static async fromUuid(pool: pg.Pool, id: string, ownerId?: string) {
		let query = {
			text: "SELECT * FROM votings WHERE id = $1",
			values: [id],
		};
		const result = await pool.query(query);
		if (result.rowCount < 1) {
			throw createError({ statusCode: 404 });
		}
		const foundVote = result.rows[0] as DbVoting;
		if (ownerId && foundVote.owner !== ownerId) {
			throw createError({ statusCode: 403 });
		}
		query = {
			text: "SELECT name, votes FROM voting_options WHERE voting_id = $1",
			values: [foundVote.id],
		};
		const results = await pool.query(query);
		return new Voting(
			foundVote.id,
			await User.fromUuid(pool, foundVote.owner),
			foundVote.title,
			results.rows
		);
	}

	static async getOwnedBy(pool: pg.Pool, ownerId: string): Promise<Voting[]> {
		const query = {
			text: "SELECT id, title FROM votings WHERE owner = $1",
			values: [ownerId],
		};
		const results = await pool.query(query);
		if (results.rowCount > 0) {
			const owner = await User.fromUuid(pool, ownerId);
			return results.rows.map((e) => new Voting(e.id, owner, e.title, []));
		} else {
			return [];
		}
	}

	static async create(
		pool: pg.Pool,
		owner: User,
		title: string,
		options: string[]
	) {
		if (options.length < 1) {
			throw createError({
				statusCode: 400,
				message: "options cannot be empty",
			});
		}
		const client = await pool.connect();
		await client.query("BEGIN");
		let voting: Voting;
		try {
			let query = {
				text:
					"INSERT INTO votings(owner, title) " +
					"VALUES ($1, $2) " +
					"RETURNING *",
				values: [owner.id, title],
			};
			let result = await client.query(query);
			const newVoting = result.rows[0] as DbVoting;
			query = {
				text:
					"INSERT INTO voting_options(voting_id, name) " + "VALUES ($1, $2)",
				values: [newVoting.id, ""],
			};
			for (const option of options) {
				query.values[1] = option;
				await client.query(query);
			}
			client.query("COMMIT");
			voting = new Voting(
				newVoting.id,
				owner,
				newVoting.title,
				options.map((e) => {
					return { name: e, votes: 0 };
				})
			);
		} catch (e) {
			await client.query("ROLLBACK");
		} finally {
			client.release();
		}
		if (voting) return voting;
		else throw createError({ statusCode: 500 });
	}

	async issueToken(pool: pg.Pool): Promise<string> {
		const query = {
			text: "INSERT INTO voting_tokens(voting_id) VALUES ($1) RETURNING token",
			values: [this.id],
		};
		const result = await pool.query(query);
		if (result.rowCount < 1) {
			throw createError({
				statusCode: 500,
			});
		}
		return result.rows[0].token;
	}

	async checkToken(pool: pg.Pool, token: string) {
		const query = {
			text: "SELECT * FROM voting_tokens WHERE voting_id = $1 AND token = $2",
			values: [this.id, token],
		};
		const result = await pool.query(query);
		if (result.rowCount < 1) {
			throw createError({ statusCode: 400, message: "invalid token" });
		}
	}

	async castVote(pool: pg.Pool, token: string, vote: string) {
		const optionValid = this.options.findIndex((e) => e.name === vote);
		if (optionValid === -1) {
			throw createError({
				statusCode: 400,
				message: "option does not exist",
			});
		}
		await this.checkToken(pool, token);
		const client = await pool.connect();
		let success = false;
		try {
			await client.query("BEGIN");
			let query = {
				text: "UPDATE voting_options SET votes = votes + 1 WHERE name = $1",
				values: [vote],
			};
			await client.query(query);
			query = {
				text: "DELETE FROM voting_tokens WHERE token = $1",
				values: [token],
			};
			await client.query(query);
			await client.query("COMMIT");
			success = true;
		} catch (e) {
			await client.query("ROLLBACK");
		} finally {
			client.release();
		}
		if (!success) {
			throw createError({
				statusCode: 500,
			});
		}
	}

	async remove(pool: pg.Pool) {
		await pool.query({
			text: "DELETE FROM votings WHERE id = $1",
			values: [this.id],
		});
	}
}
