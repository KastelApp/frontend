import ImageGrid from "@/components/ImageGrid.tsx";
import { Avatar, Image, User } from "@nextui-org/react";
import cn from "@/utils/cn.ts";
import MessageMarkDown from "@/components/Message/Markdown/MarkDown.tsx";
import { Embed, EmbedField } from "@/types/embed.ts";
import Link from "@/components/Link.tsx";

const RichEmbed = ({ embed }: { embed: Embed }) => {
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
		<div
			style={{
				borderLeft: `4px solid #${embed.color?.toString(16) ?? "000000"}`,
			}}
			className="inline-block w-auto max-w-[calc(100%-1rem)] rounded-md bg-darkAccent md:max-w-md"
		>
			{(embed.title || embed.author?.name || embed.thumbnail?.url) && (
				<header className="mr-3 flex flex-col items-start gap-2 pl-3 pt-3 text-white">
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
						<MessageMarkDown>{embed.description}</MessageMarkDown>
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
						files={embed.files}
					/>
				)}
			</div>
			{(embed.footer?.text || embed.footer?.iconUrl || embed.footer?.timestamp) && (
				<div className="mb-3 ml-3 flex items-center text-xs text-white">
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
