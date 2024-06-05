import { Link } from "@nextui-org/react";
import NextLink from "next/link";

const Temp = () => {
	return (
		<div>
			<Link href="/" color="primary" className="whitespace-pre-wrap">Link without <code>as={"{NextLink}"}</code></Link>
			<br />
			<Link href="/" color="primary" as={NextLink} className="whitespace-pre-wrap">Link with <code>as={"{NextLink}"}</code></Link>
		</div>
	);
};

export default Temp;
