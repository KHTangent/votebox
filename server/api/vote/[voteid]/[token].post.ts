import Voting from "~~/server/models/voting";
import useDbPool from "~~/server/utils/useDbPool";

interface VotingRequestBody {
	name: string;
}

/**
 * Casts a vote based on Voting ID and Token given as URL parameters. Accepts a JSON object with
 * the name of the option to vote for.
 */
export default defineEventHandler(async (e) => {
	const voteId = e.context.params.voteid;
	const voteToken = e.context.params.token;
	const body = await useBody<VotingRequestBody>(e);
	const pool = await useDbPool(e);
	const voting = await Voting.fromUuid(pool, voteId);
	await voting.castVote(pool, voteToken, body.name);
	return true;
});
