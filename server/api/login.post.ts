import User from "../models/users";
import { useDbPool } from "../utils/useDbPool";
interface LoginRequestBody {
	username: string;
	password: string;
}

export default defineEventHandler(async (e) => {
	const login = await useBody<LoginRequestBody>(e);
	const pool = await useDbPool(e);
	const user = await User.login(pool, login.username, login.password);
	const token = await user.getAccessToken(pool);
	return {
		token,
	};
});
