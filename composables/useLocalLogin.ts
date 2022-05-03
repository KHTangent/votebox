export const useLocalLogin = () =>
	useState<string>("login", () => {
		if (global.localStorage) {
			const stored: string = localStorage.getItem("token");
			return stored ? stored : "";
		}
		return "";
	});
