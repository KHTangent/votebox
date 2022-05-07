import Voting from "../models/voting";
import useDbPool from "../utils/useDbPool";
import useLogin from "../utils/useLogin";

interface CreationRequestBody {
	title: string;
	options: string[];
}

/**
 * Creates a new voting. Accepts a JSON object describing the new voting
 */
export default defineEventHandler(async (e) => {
	const pool = await useDbPool(e);
	const user = await useLogin(e);
	const body = await useBody<CreationRequestBody>(e);
	if (body.options.length < 1) {
		throw createError({
			statusCode: 400,
			message: "options cannot be empty",
		});
	}
	if (new Set(body.options).size !== body.options.length) {
		throw createError({
			statusCode: 400,
			message: "options must be unique",
		});
	}
	const voting = await Voting.create(pool, user, body.title, body.options);
	return {
		id: voting.id,
		title: voting.title,
		options: voting.options.map((e) => {
			return {
				name: e.name,
				votes: e.votes,
			};
		}),
	};
});
