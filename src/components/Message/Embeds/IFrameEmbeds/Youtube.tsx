import { Card, CardBody, CardHeader, Image, User } from "@nextui-org/react";
import Link from "next/link";
import type { Embed } from "../RichEmbed.tsx";
import { useState } from "react";
import { Play } from "lucide-react";
import cn from "@/utils/cn.ts";
import { UnLazyImage } from "@unlazy/react";

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
			<Link href={url} passHref className={!noColor ? "text-blue-500" : ""} target="_blank">
				{children}
			</Link>
		) : (
			<>{children}</>
		);
	};

	if (!embed.iframeSource) return null;

	const PreIframe = ({ children }: { children: React.ReactNode }) => {
		const [iframeInview, setiframeInview] = useState<boolean>(false);

		if (embed.iframeSource?.provider !== "Youtube") return children;

		const foundYoutubeThumbnail = embed.files?.find((file) => file.name === "YoutubeThumbnail");

		return (
			<div
				className={cn("relative mb-4 w-[28rem] max-w-md", !iframeInview ? "cursor-pointer" : "")}
				onClick={() => {
					if (!iframeInview) setiframeInview(true);
				}}
			>
				{!iframeInview && (
					<>
						<div>
							<UnLazyImage
								src={foundYoutubeThumbnail?.url}
								thumbhash={foundYoutubeThumbnail?.thumbHash ?? undefined}
								alt="Youtube Thumbnail"
								className="h-full w-full rounded-md"
							/>
							<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
								<Play size={40} className="text-white" />
							</div>
						</div>
					</>
				)}
				{iframeInview && children}
			</div>
		);
	};

	return (
		<div
			style={{
				borderLeft: `4px solid #${embed.color?.toString(16) ?? "000000"}`,
			}}
			className="inline-block w-auto rounded-md"
		>
			<Card shadow="sm" radius="none" className="min-h-0 min-w-0 rounded-md bg-lightAccent dark:bg-darkAccent">
				{(embed.title || embed.author?.name || embed.thumbnail?.url) && (
					<CardHeader className="mr-3 p-0 pl-3 pt-3">
						<div className="flex flex-col items-start gap-2 text-white">
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
									<p className="mb-2 max-w-md truncate">{embed.title}</p>
								</HyperLinkPossibly>
							)}
						</div>
						{embed.thumbnail?.url && (
							<div className="ml-4 mr-4">
								<Image
									src={embed.thumbnail.url}
									alt="Thumbnail"
									className="max-h-20 min-h-20 min-w-20 max-w-20 rounded-md"
									referrerPolicy="no-referrer"
								/>
							</div>
						)}
					</CardHeader>
				)}
				<CardBody className="mr-3 p-0 pl-3">
					{embed.description && (
						<p className="max-w-lg overflow-hidden whitespace-pre-line break-words text-sm text-white">
							{embed.description}
						</p>
					)}
					<div className="mt-2">
						{/*//t! Allow disabling of iframes for those more safety focused people(?) */}
						<PreIframe>
							<iframe
								src={embed.iframeSource.url}
								allowFullScreen
								title="Embed"
								className="h-full w-full"
								// ? ;3 if you know you know
								sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
								allow="autoplay"
								style={{
									maxHeight: "250px",
									minHeight: "250px",
								}}
							/>
						</PreIframe>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default YoutubeIFrameEmbed;
