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
		<div className="group relative w-full">
			<SyntaxHighlighter wrapLongLines language={getLanguageFromExtension(language)} style={oneDark as never}>
				{code}
			</SyntaxHighlighter>
			<Tooltip content={"Copy"}>
				<Copy
					className="absolute right-1 top-1 cursor-pointer text-white active:scale-95"
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
