import Voting from "~~/server/models/voting";
import useDbPool from "~~/server/utils/useDbPool";

/**
 * Uses a voting ID and token to fetch info about a voting, like title and options.
 * ID and Token are URL parameters
 */
export default defineEventHandler(async (e) => {
	const voteId = e.context.params.voteid;
	const voteToken = e.context.params.token;
	const pool = await useDbPool(e);
	const voting = await Voting.fromUuid(pool, voteId);
	await voting.checkToken(pool, voteToken);
	return {
		title: voting.title,
		options: voting.options.map((e) => e.name),
	};
});
