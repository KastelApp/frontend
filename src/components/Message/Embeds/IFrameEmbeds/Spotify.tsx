import cn from "@/utils/cn.ts";
import type { Embed } from "../RichEmbed.tsx";
const SpotifyEmbed = ({ embed }: { embed: Embed }) => {
	const fixedUrl = new URL(embed.iframeSource?.url ?? "");

	fixedUrl.searchParams.set("utm_source", "kastelapp");

	const isPlaylist = fixedUrl.pathname.includes("/playlist/");

	return (
		<div
			className={cn(
				"inline-block w-[400px] min-w-[400px] max-w-[400px] rounded-md",

				!isPlaylist ? "h-20 max-h-20 min-h-20" : "min-h-[352px]",
			)}
		>
			<iframe
				className="rounded-2xl border-0 !bg-green-400"
				src={fixedUrl.toString()}
				allow="encrypted-media; picture-in-picture"
				sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
				loading="lazy"
				height={isPlaylist ? "352px" : "80px"}
				width={"100%"}
			/>
		</div>
	);
};

export default SpotifyEmbed;
