import ImageGrid from "@/components/ImageGrid.tsx";
import cn from "@/utils/cn.ts";
import { Link, useDisclosure } from "@nextui-org/react";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { UnLazyImage } from "@unlazy/react";
import { useState } from "react";

interface Image {
    url: string;
    thumbHash?: string | null;
    name?: string;
}

interface PopUpImageProps {
    url?: string;
    thumbHash?: string | null;
    name?: string;
    className?: string;
    images?: Image[];
    classNames?: {
        image?: string;
        container?: string;
        modal?: string;
    };
}

const repairUrl = (url: string) => {
    // ? repair basically just removes the width and height query params
    const fixedUrl = new URL(url);

    fixedUrl.searchParams.delete("width");
    fixedUrl.searchParams.delete("height");

    return fixedUrl.toString();
};

const PopUpImage = ({
    // className,
    classNames,
    images,
    name,
    thumbHash,
    url
}: PopUpImageProps) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [currentImage] = useState<number>(0); // ? the index

    if (!images && url) {
        images = [{ url, thumbHash, name }];
    }

    return (
        <>
            <ImageGrid images={images ?? []} onClick={() => onOpen()} />
            <Modal isOpen={isOpen} onOpenChange={onClose} className={cn(classNames?.modal, "bg-transparent shadow-none")} classNames={{
                base: " w-auto h-auto"

            }} size="full">
                <ModalContent>
                    <ModalBody>
                        <div className="flex flex-col justify-center items-center w-[98%] h-[98%]">
                            <UnLazyImage
                                src={repairUrl(images?.[currentImage].url ?? "")}
                                alt={images?.[currentImage].name ?? "Image"}
                                thumbhash={images?.[currentImage].thumbHash ?? undefined}
                                className="max-w-[80vw] max-h-[80vh]"
                                style={{
                                    width: "auto",
                                    height: "auto",
                                }}
                            />
                            <Link
                                href={repairUrl(images?.[currentImage].url ?? "")}
                                target="_blank"
                                className="mr-auto"
                            >
                                Open in browser
                            </Link>
                        </div>


                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default PopUpImage;