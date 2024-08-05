import oneDark from "@/components/Message/Markdown/style.ts";
import { getLanguageFromExtension } from "@/utils/getLanguageFromExtension.ts";
import { Tooltip } from "@nextui-org/react";
import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface CodeblockProps {
	language: string;
	code: string;
}

const Codeblock = ({ language, code }: CodeblockProps) => {
	return (
		<div className="relative group w-full">
			<SyntaxHighlighter language={getLanguageFromExtension(language)} style={oneDark as never}>
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
