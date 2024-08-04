import { getLanguageFromExtension } from "@/utils/getLanguageFromExtension.ts";
import { Tooltip } from "@nextui-org/react";
import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeblockProps {
	language: string;
	code: string;
}

const Codeblock = ({ language, code }: CodeblockProps) => {
	return (
		<div className="relative group">
			<SyntaxHighlighter language={getLanguageFromExtension(language)} style={oneDark}>
				{code}
			</SyntaxHighlighter>
			<Tooltip content={"Copy"}>
				<Copy
					className="absolute top-1 right-1 hidden group-hover:block cursor-pointer text-white"
					size={18}
					onClick={() => {
						navigator.clipboard.writeText(code);
					}}
				/>
			</Tooltip>
		</div>
	);
};

export default Codeblock;
