import Voting from "../models/voting";
import useDbPool from "../utils/useDbPool";
import useLogin from "../utils/useLogin";

export default defineEventHandler(async (e) => {
	const pool = await useDbPool(e);
	const user = await useLogin(e);
	const votings = await Voting.getOwnedBy(pool, user.id);
	return votings.map((e) => {
		return {
			id: e.id,
			title: e.title,
		};
	});
});
