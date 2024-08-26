import type { Embed } from "../RichEmbed.tsx";
const SpotifyEmbed = ({
    embed
}: {
    embed: Embed;
}) => {

    const fixedUrl = new URL(embed.iframeSource?.url ?? "");

    fixedUrl.searchParams.set("utm_source", "kastelapp");

    return (
        <div className="rounded-md inline-block max-w-[400px] min-w-[400px] min-h-20 max-h-20 h-20 w-[400px]">
            <iframe
                className="rounded-2xl !bg-green-400 border-0 w-full h-full"
                src={fixedUrl.toString()}
                allow="encrypted-media; picture-in-picture"
                sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                loading="lazy" />
        </div>
    );
};

export default SpotifyEmbed;