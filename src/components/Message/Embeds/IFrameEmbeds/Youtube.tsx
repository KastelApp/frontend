import { Image, User } from "@nextui-org/react";
import { useState } from "react";
import { Play } from "lucide-react";
import cn from "@/utils/cn.ts";
import { UnLazyImage } from "@unlazy/react";
import Link from "@/components/Link.tsx";
import { Embed } from "@/types/embed.ts";

const PreIframe = ({ children, embed }: { children: React.ReactNode; embed: Embed }) => {
	const [iframeInview, setiframeInview] = useState<boolean>(false);

	if (embed.iframeSource?.provider !== "Youtube") return children;

	const foundYoutubeThumbnail = embed.files?.find((file) => file.name === "YoutubeThumbnail");

	return (
		<div
			className={cn("relative mb-4 aspect-[400/225] w-full max-w-[400px]", !iframeInview && "cursor-pointer")}
			onClick={() => {
				if (!iframeInview) setiframeInview(true);
			}}
		>
			{!iframeInview && (
				<div>
					<UnLazyImage
						src={foundYoutubeThumbnail?.url}
						thumbhash={foundYoutubeThumbnail?.thumbHash ?? undefined}
						alt="Youtube Thumbnail"
						className="rounded-md"
					/>
					<div className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 transform">
						<Play size={40} className="text-white" />
					</div>
					{!iframeInview && <div className="absolute left-0 top-0 h-full w-full rounded-md bg-black opacity-50" />}
				</div>
			)}
			{iframeInview && children}
		</div>
	);
};

const YoutubeIFrameEmbed = ({ embed }: { embed: Embed }) => {
	const HyperLinkPossibly = ({
		url,
		children,
		noColor,
	}: {
		url?: string;
		children: React.ReactNode;
		noColor?: boolean;
	}) => {
		return url ? (
			<Link href={url} className={!noColor ? "text-blue-500" : ""} target="_blank">
				{children}
			</Link>
		) : (
			<>{children}</>
		);
	};

	if (!embed.iframeSource) return null;

	return (
		<div
			style={{
				borderLeft: `4px solid #${embed.color?.toString(16) ?? "000000"}`,
			}}
			className="inline-block w-auto max-w-[calc(100%-1rem)] rounded-md bg-darkAccent md:max-w-96"
		>
			{(embed.title || embed.author?.name || embed.thumbnail?.url) && (
				<header className="mr-3 flex flex-col items-start gap-2 pl-3 pt-3 text-white">
					{embed.iframeSource.provider && (
						<p className="text-xs">
							<HyperLinkPossibly url={"https://youtube.com"} noColor>
								{embed.iframeSource.provider}
							</HyperLinkPossibly>
						</p>
					)}

					{embed.author?.name && (
						<HyperLinkPossibly url={embed.author.url} noColor>
							<User
								name={embed.author.name}
								avatarProps={{
									src: embed.author.iconUrl,
									className: "h-6 w-6 rounded-full",
									imgProps: {
										referrerPolicy: "no-referrer",
									},
								}}
								className="max-w-md truncate font-bold"
								classNames={{
									name: "text-xs",
								}}
							/>
						</HyperLinkPossibly>
					)}

					{embed.title && (
						<HyperLinkPossibly url={embed.url}>
							<p className="mb-2">{embed.title}</p>
						</HyperLinkPossibly>
					)}

					{embed.thumbnail?.url && (
						<Image
							src={embed.thumbnail.url}
							alt="Thumbnail"
							className="ml-4 mr-4 rounded-md mm-hw-20"
							referrerPolicy="no-referrer"
						/>
					)}
				</header>
			)}

			<div className="mr-3 pl-3">
				{embed.description && (
					<p className="max-w-lg overflow-hidden whitespace-pre-line break-words text-sm text-white">
						{embed.description}
					</p>
				)}

				<div className="mt-2">
					{/*//t! Allow disabling of iframes for those more safety focused people(?) */}
					<PreIframe embed={embed}>
						<iframe
							src={embed.iframeSource.url}
							allowFullScreen
							title={embed.title}
							className="h-full max-w-[400px]"
							sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
							allow="autoplay"
							width={"100%"}
						/>
					</PreIframe>
				</div>
			</div>
		</div>
	);
};

export default YoutubeIFrameEmbed;
