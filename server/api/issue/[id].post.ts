import Voting from "~~/server/models/voting";
import useDbPool from "../../utils/useDbPool";
import useLogin from "../../utils/useLogin";

/**
 * Issues a new token for the voting ID given as query parameter. Verifies that
 * the endpoint was called by the owner of the voting before creating a token.
 */
export default defineEventHandler(async (e) => {
	const pool = await useDbPool(e);
	const user = await useLogin(e);
	const voteId = e.context.params.id;
	const voting = await Voting.fromUuid(pool, voteId, user.id);
	const ballot = await voting.issueToken(pool);
	return {
		token: ballot,
	};
});
