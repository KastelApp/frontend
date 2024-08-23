import { Embed } from "@/components/Message/Embeds/RichEmbed.tsx";
import PopUpImage from "@/components/PopUpImage.tsx";
import { UnLazyImage } from "@unlazy/react"

const ImageEmbed = ({
    embed
}: {
    embed: Embed;
}) => {

    const firstFile = embed.files?.[0];

    if (!firstFile) return null;

    const fixedUrl = new URL(firstFile.url);

    fixedUrl.searchParams.set("width", "400");

    return (
        <div className="rounded-md inline-block w-auto">
            <PopUpImage url={fixedUrl.toString()} alt={firstFile.name ?? "Image"} thumbhash={firstFile.thumbHash ?? undefined} style={{
                minWidth: "400px",
                minHeight: "215px",
                maxWidth: "400px",
                maxHeight: "215px",
            }} />
        </div>
    );
};

export default ImageEmbed;
