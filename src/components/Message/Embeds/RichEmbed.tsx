import ImageGrid from "@/components/ImageGrid.tsx";
import { Avatar, Image, User } from "@nextui-org/react";
import Link from "next/link";
import cn from "@/utils/cn.ts";
import MessageMarkDown from "@/components/Message/Markdown/MarkDown.tsx";

interface EmbedFiles {
	name?: string;
	url: string;
	height?: number;
	width?: number;
	type: "Image" | "Video";
	rawUrl: string;
	thumbHash?: string | null;
}

interface EmbedFooter {
	text?: string;
	iconUrl?: string;
	timestamp?: string;
}

interface EmbedField {
	name: string;
	value: string;
	inline: boolean;
}

interface EmbedAuthor {
	name: string;
	authorID?: string;
	iconUrl?: string;
	url: string;
}

interface EmbedThumbnail {
	url: string;
	rawUrl: string;
}

interface EmbedIframeSource {
	provider: "Youtube" | "Spotify";
	url: string; // ? i.e https://www.youtube.com/embed/cMg8KaMdDYo
}

interface EmbedProvider {
	name: string;
	url: string;
}

interface Embed {
	title?: string;
	description?: string;
	url?: string;
	color?: number;
	// ? Rich = Bot made embed
	// ? Iframe = Special embed which has an iframe (i.e Youtube)
	// ? Video = Embed with a video (Should not render an embed, just the video)
	// ? Image = Embed with an image (Should not render an embed, just the image)
	// ? Site = Embed from scraping a site
	type: "Rich" | "Iframe" | "Video" | "Image" | "Site";
	files?: EmbedFiles[];
	footer?: EmbedFooter;
	fields?: EmbedField[];
	author?: EmbedAuthor;
	thumbnail?: EmbedThumbnail;
	// ? PLEASE NOTE: EmbedProvider and iframeSource.provider are NOT the same. iframeSource.provider is used for the type of iframe (i.e Youtube, Spotify) since these may need different handling
	// ? EmbedProvider is shown at the top (i.e "FxTwitter / FixupX")
	iframeSource?: EmbedIframeSource;
	provider?: EmbedProvider;
}

const RichEmbed = ({ embed }: { embed: Embed; }) => {
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

	const groupedFields: EmbedField[][] = [];
	let currentGroup: EmbedField[] = [];

	for (const field of embed.fields ?? []) {
		if (field.inline && currentGroup.length < 3) {
			currentGroup.push(field);
		} else {
			if (currentGroup.length > 0) {
				groupedFields.push(currentGroup);
				currentGroup = [];
			}
			groupedFields.push([field]);
		}
	}

	if (currentGroup.length > 0) {
		groupedFields.push(currentGroup);
	}

	return (
		<div style={{
			borderLeft: `4px solid #${embed.color?.toString(16) ?? "000000"}`,
		}} className="inline-block w-auto rounded-md bg-darkAccent max-w-[calc(100%-1rem)] md:max-w-md ">
			{(embed.title || embed.author?.name || embed.thumbnail?.url) && (
				<header className="mr-3 pl-3 pt-3 flex flex-col items-start gap-2 text-white">
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
							className="mm-hw-20 rounded-md ml-4 mr-4"
							referrerPolicy="no-referrer"
						/>
					)}
				</header>
			)}

			<div className="mr-3 pl-3">
				{embed.description && (
					<p className="max-w-lg overflow-hidden whitespace-pre-line break-words text-sm text-white">
						<MessageMarkDown>
							{embed.description}
						</MessageMarkDown>
					</p>
				)}
				<div className="mt-2">
					{groupedFields.map((group, groupIndex) => (
						<div key={groupIndex} className="mb-2 flex flex-wrap">
							{group.map((field, fieldIndex) => (
								<span key={fieldIndex} className={cn("mr-2", field.inline ? "max-w-xs" : "max-w-lg")}>
									<strong className="text-md text-white">{field.name}</strong>
									<p className="text-sm text-white">{field.value}</p>
								</span>
							))}
						</div>
					))}
				</div>
				{embed.files && (
					<ImageGrid
						images={embed.files.map((file) => ({
							url: file.url,
							name: file.name,
							thumbHash: file.thumbHash,
						}))}
					/>
				)}
			</div>
			{(embed.footer?.text || embed.footer?.iconUrl || embed.footer?.timestamp) && (
				<div className="flex items-center text-xs text-white ml-3 mb-3">
					{embed.footer.iconUrl && (
						<>
							<Avatar src={embed.footer.iconUrl} className="h-6 w-6 rounded-full" />
							<span className="ml-1.5 mr-1 select-none">•</span>
						</>
					)}
					{embed.footer.text && (
						<span>
							{embed.footer.text}
							<span className="ml-1 mr-1 select-none">•</span>
						</span>
					)}
					{embed.footer.timestamp && <p>{new Date(embed.footer.timestamp).toLocaleString()}</p>}
				</div>
			)}
		</div>
	);
};

export default RichEmbed;

export type {
	EmbedFiles,
	EmbedFooter,
	EmbedField,
	EmbedAuthor,
	EmbedThumbnail,
	Embed,
	EmbedIframeSource,
	EmbedProvider,
};
