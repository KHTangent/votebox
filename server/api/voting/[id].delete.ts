import Voting from "~~/server/models/voting";
import useDbPool from "../../utils/useDbPool";
import useLogin from "../../utils/useLogin";

export default defineEventHandler(async (e) => {
	const pool = await useDbPool(e);
	const user = await useLogin(e);
	const voteId = e.context.params.id;
	const voting = await Voting.fromUuid(pool, voteId, user.id);
	if (voting.owner.id !== user.id) {
		throw createError({
			statusCode: 401,
			message: "you don't own this voting",
		});
	}
	await voting.remove(pool);
	return true;
});
