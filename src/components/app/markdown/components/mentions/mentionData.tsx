import { Dispatch, SetStateAction, useState } from "react";

export interface ModelData {
    x: number;
    y: number;
    width: number;
    height: number;
    setPos: Dispatch<SetStateAction<{
        x: number;
        y: number;
        width: number;
        height: number;
    }>>;
    setPlacement: Dispatch<SetStateAction<"top" | "bottom" | "left" | "right">>;
    placement: "top" | "bottom" | "left" | "right";
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
}

const useModelData = (): ModelData => {
    const [pos, setPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [isOpen, setIsOpen] = useState(false);
    const [placement, setPlacement] = useState<"top" | "bottom" | "left" | "right">("bottom");

    const onClose = () => {
        setTimeout(() => setIsOpen(false), 150)
    };

    const onToggle = () => {
        setIsOpen(!isOpen)
    };

    return {
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height,
        setPos,
        isOpen,
        onToggle,
        onClose,
        placement,
        setPlacement
    };
};

const clickHandler = ({
    setPos,
    onToggle,
    setPlacement
}: {
    setPos: (pos: { x: number, y: number, width: number, height: number; }) => void;
    onToggle: () => void;
    setPlacement: (placement: "top" | "bottom" | "left" | "right") => void;
}) => (e: React.MouseEvent<HTMLElement>) => {
    const element = e.currentTarget;

    const totalWidth = element.offsetWidth;
    const totalHeight = element.offsetHeight;

    const rect = element.getBoundingClientRect();
    const x = rect.left;
    const y = rect.top;

    if (window.innerWidth - x < 500) {
        setPlacement("left");
    } else {
        setPlacement("right");
    }

    setPos({ x, y, width: totalWidth, height: totalHeight });

    onToggle();
};


export {
    useModelData,
    clickHandler
};