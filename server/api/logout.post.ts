import useDbPool from "../utils/useDbPool";
import useLogin from "../utils/useLogin";

export default defineEventHandler(async (e) => {
	const pool = await useDbPool(e);
	const user = await useLogin(e);
	const token = e.req.headers.authorization.substring("Bearer ".length);
	await user.logout(pool, token);
	return true;
});
