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

export type {
    Embed,
    EmbedAuthor,
    EmbedField,
    EmbedFiles,
    EmbedFooter,
    EmbedIframeSource,
    EmbedProvider,
    EmbedThumbnail
}