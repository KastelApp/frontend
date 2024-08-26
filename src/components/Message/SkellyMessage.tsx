import { twMerge } from "tailwind-merge";
import { Skeleton } from "@nextui-org/react";
import { memo, useEffect, useState } from "react";

const MessageToSkelton = memo(({ msg, getLength }: { msg: string, getLength(word: string): number; }) => {
    const words = msg.split(" ");

    return (
        <div className="flex gap-1 flex-wrap">
            {words.map((word, index) => {
                const messageWidth = getLength(word);

                return (
                    <Skeleton
                        key={index}
                        className="rounded-lg mt-1 max-h-5 min-h-5"
                        style={{
                            minWidth: messageWidth,
                            maxWidth: messageWidth,
                        }}
                        disableAnimation
                    />
                );
            })}
        </div>
    );
});

const randomData = {
    names: ["DarkerInk", "TeaCup", "Otters", "Cats", "Waffles", "Developer", "John", "Rock", "Wick", "vegetable", "funky", "stitch"],
    content: [
        "Hello World! How are you",
        "This is a message",
        "A Cats the actual contents",
        "Sot know >>>:33333",
        "Very cool msg"
    ]
};

const SkellyMessage = memo(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;

    context.font = "20px Roboto";

    const getLength = (word: string) => {

        // ? temp
        return 60;

        const length = context.measureText(word).width;
        return length < 20 ? length + length : length;
    };

    const [name, setName] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        const randomName = randomData.names[Math.floor(Math.random() * randomData.names.length)];
        const randomContent = randomData.content[Math.floor(Math.random() * randomData.content.length)];

        setName(randomName);
        setContent(randomContent);
    }, []);

    return (
        <div
            className={twMerge(
                "group w-full hover:bg-msg-hover mb-4 relative",
            )}
        >
            <div className="flex">
                <Skeleton className="mt-1 ml-2 cursor-pointer min-w-8 min-h-8 w-8 h-8 hover:scale-95 transition-all duration-300 ease-in-out transform rounded-full" disableAnimation />
                <div className="relative">
                    <div className="flex flex-col ml-2">
                        <div className="flex min-w-96">
                            <Skeleton className="rounded-lg cursor-pointer max-h-4 min-h-4" style={{
                                minWidth: getLength(name),
                                maxWidth: getLength(name),
                            }} disableAnimation />
                        </div>
                        <MessageToSkelton msg={content} getLength={getLength} />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default SkellyMessage;