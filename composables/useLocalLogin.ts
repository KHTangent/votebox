export const useLocalLogin = () =>
	useState<string>("login", () => {
		const stored: string = localStorage.getItem("token");
		return stored ? stored : "";
	});
