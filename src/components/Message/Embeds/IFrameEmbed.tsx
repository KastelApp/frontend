import SpotifyEmbed from "@/components/Message/Embeds/IFrameEmbeds/Spotify.tsx";
import { Embed } from "./RichEmbed.tsx";
import YoutubeIFrameEmbed from "@/components/Message/Embeds/IFrameEmbeds/Youtube.tsx";

const IFrameEmbed = ({
    embed
}: {
    embed: Embed;
}) => {

    if (embed.iframeSource?.provider === "Youtube") {
        return (
            <YoutubeIFrameEmbed embed={embed} />
        );
    }

    if (embed.iframeSource?.provider === "Spotify") {
        return (
            <SpotifyEmbed embed={embed} />
        );
    }

    return <>You shouldn't see this. Please report this {"<"}3</>
};

export default IFrameEmbed;