import ImageGrid from "@/components/ImageGrid.tsx";
import { Avatar, Card, CardBody, CardFooter, CardHeader, Image } from "@nextui-org/react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

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
    text: string;
    iconUrl: string;
    timestamp: string;
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


const RichEmbed = ({
    embed
}: {
    embed: Embed;
}) => {

    const HyperLinkPossibly = ({ url, children, noColor }: { url?: string; children: React.ReactNode; noColor?: boolean; }) => {
        return url ? (
            <Link href={url} passHref className={!noColor ? "text-blue-500" : ""} target="_blank">
                {children}
            </Link>
        ) : (
            <>{children}</>
        );
    };

    const groupedFields: (EmbedField[])[] = [];
    let currentGroup: EmbedField[] = [];

    for (const field of (embed.fields ?? [])) {
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
            borderLeft: `4px solid #${embed.color?.toString(16) ?? "000000"}`
        }} className="rounded-md inline-block w-auto">
            <Card shadow="sm" radius="none" className="rounded-md min-w-0 min-h-0 bg-lightAccent dark:bg-darkAccent max-w-[430px]">
                {(embed.title || embed.author?.name || embed.thumbnail?.url) && (
                    <CardHeader className="p-0 pl-3 pt-3 mr-3">
                        <div className="flex flex-col items-start gap-2 text-white">
                            {embed.author?.name && (
                                <HyperLinkPossibly url={embed.author.url} noColor={embed.author.url === undefined}>
                                    <div>
                                        {embed.author.iconUrl && <Avatar src={embed.author.iconUrl} className="h-6 w-6 rounded-full" />}
                                        <p className="font-bold truncate max-w-md">{embed.author.name}</p>
                                    </div>
                                </HyperLinkPossibly>
                            )}
                            {embed.title && <HyperLinkPossibly url={embed.url}><p className="truncate max-w-md mb-2">{embed.title}</p></HyperLinkPossibly>}
                        </div>
                        {embed.thumbnail?.url && (
                            <div className="ml-4 mr-4">
                                <Image src={embed.thumbnail.url} alt="Thumbnail" className="rounded-md max-w-20 min-w-20 max-h-20 min-h-20" />
                            </div>
                        )}
                    </CardHeader>
                )}
                <CardBody className="p-0 pl-4 mr-3 pr-2 ">
                    {embed.description && <p className="text-sm text-white max-w-xl whitespace-pre-line overflow-hidden break-words">{embed.description}</p>}
                    <div className="mt-2">
                        {groupedFields.map((group, groupIndex) => (
                            <div key={groupIndex} className="flex flex-wrap mb-2">
                                {group.map((field, fieldIndex) => (
                                    <span key={fieldIndex} className={twMerge("mr-2", field.inline ? "max-w-xs" : "max-w-lg")}>
                                        <strong className="text-md text-white">{field.name}</strong>
                                        <p className="text-sm text-white">{field.value}</p>
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                    {embed.files && <ImageGrid images={embed.files.map((file) => ({
                        url: file.url,
                        name: file.name,
                        thumbHash: file.thumbHash
                    }))} />}
                </CardBody>
                {(embed.footer?.text || embed.footer?.timestamp) && (
                    <CardFooter className="mr-3">
                        <div className="flex items-center justify-between text-xs text-white">
                            {embed.footer.iconUrl && <>
                                <Avatar src={embed.footer.iconUrl} className="h-6 w-6 rounded-full" />
                                <span className="ml-1.5 mr-1 select-none">•</span>
                            </>}
                            {embed.footer.text &&
                                <span>{embed.footer.text}
                                    <span className="ml-1 mr-1 select-none">•</span>
                                </span>}
                            {embed.footer.timestamp &&
                                <p>
                                    {new Date(embed.footer.timestamp).toLocaleString()}
                                </p>
                            }
                        </div>
                    </CardFooter>
                )}
            </Card>
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
    EmbedProvider
};