import { CompatibilityEvent } from "h3";
import User from "../models/users";
import useDbPool from "./useDbPool";

/**
 * Fetches a user by access token based on the Authorization HTTP header
 * @param e H3 connection event
 */
export default async function useLogin(e: CompatibilityEvent): Promise<User> {
	if (
		!e.req.headers.authorization ||
		!e.req.headers.authorization.startsWith("Bearer ")
	) {
		throw createError({ statusCode: 401 });
	}
	const pool = await useDbPool(e);
	const token = e.req.headers.authorization.substring("Bearer ".length);
	return await User.fromToken(pool, token);
}
