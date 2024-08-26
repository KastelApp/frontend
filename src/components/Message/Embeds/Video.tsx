import { Embed } from "@/components/Message/Embeds/RichEmbed.tsx";

const VideoEmbed = ({
    embed
}: {
    embed: Embed;
}) => {

    const firstFile = embed.files?.[0];

    if (!firstFile) return null;

    return (
        <div className="rounded-md inline-block w-auto">
            <video style={{
                minWidth: "400px",
                minHeight: "215px",
                maxWidth: "400px",
                maxHeight: "215px",
            }} controls>
                <source src={firstFile.url} type={"video/mp4"} />
            </video>
        </div>
    );
};

export default VideoEmbed;
