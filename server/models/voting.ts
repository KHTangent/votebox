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
}
