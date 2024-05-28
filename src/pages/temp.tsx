import { useRouter } from "next/router";
import { useEffect } from "react";

const Temp = () => {
	const router = useRouter();

	useEffect(() => {
		if (process.env.NODE_ENV === "production") {
			router.push("/404");

			return;
		}
		throw new Error("This is a test error");
	}, []);

	return (
		<div>
			<p>You should not be seeing this page</p>
		</div>
	);
};

export default Temp;
