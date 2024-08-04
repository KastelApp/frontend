import { Image } from "@nextui-org/react";

const ImageGrid = ({ length }: { length: number; }) => {
    const images = Array.from({ length });

    return (
        <div className="grid gap-2 mb-2">
            {images.length === 1 && (
                <div className={"flex justify-center max-w-96 max-h-56"}>
                    <Image
                        src="https://opengraph.githubassets.com/7e0878100669d3723ea934e23f9f95dc09995af79d4d100569dcdbf93b2a8bed/KastelApp/frontend"
                        alt="Image"
                        radius="none"
                    />
                </div>
            )}

            {images.length === 2 && (
                <div className="flex gap-2">
                    {images.map((_, index) => (
                        <div key={index} className={"max-w-48 max-h-56 flex-shrink-0"}>
                            <Image
                                src="https://opengraph.githubassets.com/7e0878100669d3723ea934e23f9f95dc09995af79d4d100569dcdbf93b2a8bed/KastelApp/frontend"
                                alt={`Image ${index + 1}`}
                                radius="none"
                            />
                        </div>
                    ))}
                </div>
            )}

            {images.length === 3 && (
                <div className="flex h-full">
                    <div className={"flex-1 max-w-52 max-h-full"}>
                        <Image
                            src="https://opengraph.githubassets.com/7e0878100669d3723ea934e23f9f95dc09995af79d4d100569dcdbf93b2a8bed/KastelApp/frontend"
                            alt="Large Image"
                            radius="none"
                            className="h-full"
                            classNames={{
                                wrapper: "h-full"
                            }}
                        />
                    </div>
                    <div className="flex flex-col justify-between ml-1 gap-y-1">
                        {images.slice(1).map((_, index) => (
                            <Image
                                src="https://opengraph.githubassets.com/7e0878100669d3723ea934e23f9f95dc09995af79d4d100569dcdbf93b2a8bed/KastelApp/frontend"
                                alt={`Small Image ${index + 1}`}
                                key={index} className={"max-w-60 max-h-24"}
                                radius="none"

                            />
                        ))}
                    </div>
                </div>
            )}

            {images.length === 4 && (
                <div className="grid grid-cols-2 gap-y-2">
                    {images.map((_, index) => (
                        <div key={index} className={"max-w-48 max-h-48"}>
                            <Image
                                src="https://opengraph.githubassets.com/7e0878100669d3723ea934e23f9f95dc09995af79d4d100569dcdbf93b2a8bed/KastelApp/frontend"
                                alt={`Image ${index + 1}`}
                                radius="none"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGrid;
