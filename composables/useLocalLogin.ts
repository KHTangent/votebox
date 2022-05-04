export const useLocalLogin = () =>
	useState<string>("login", () => {
		const token = useCookie("token");
		token.value = token.value || "";
		return token;
	});
