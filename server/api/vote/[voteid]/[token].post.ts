import Voting from "~~/server/models/voting";
import useDbPool from "~~/server/utils/useDbPool";

interface VotingRequestBody {
	name: string;
}

export default defineEventHandler(async (e) => {
	const voteId = e.context.params.voteid;
	const voteToken = e.context.params.token;
	const body = await useBody<VotingRequestBody>(e);
	const pool = await useDbPool(e);
	const voting = await Voting.fromUuid(pool, voteId);
	await voting.castVote(pool, voteToken, body.name);
	return true;
});
