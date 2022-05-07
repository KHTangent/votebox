import Voting from "~~/server/models/voting";
import useDbPool from "../../utils/useDbPool";
import useLogin from "../../utils/useLogin";

/**
 * Fetches details about a single voting, given as a URL parameter
 */
export default defineEventHandler(async (e) => {
	const pool = await useDbPool(e);
	const user = await useLogin(e);
	const voteId = e.context.params.id;
	const voting = await Voting.fromUuid(pool, voteId, user.id);
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
