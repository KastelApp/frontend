import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface DraggableProps<T> {
    items: T[];
    /**
     * Render {@link items}
     */
    render: (item: T, index: number) => JSX.Element;
    /**
     * Runs when the items are dropped, returns the new items array
     */
    onDrop: (items: T[]) => void;
    /**
     * Orientation of the draggables i.e vertical or horizontal
     */
    orientation?: "vertical" | "horizontal";
    className?: string;
}

/**
 * Draggable Elements
 */
const Draggables = <T,>({
    items,
    onDrop,
    render,
    orientation = "vertical",
    className
}: DraggableProps<T>) => {
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [dragItems, setDragItems] = useState(items);
    const [dragOverPosition, setDragOverPosition] = useState<"above" | "below" | "left" | "right" | null>(null);

    useEffect(() => {
        setDragItems(items);
    }, [items]);

    const handleDragStart = (index: number) => {
        setDraggingIndex(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (index !== draggingIndex) {
            const rect = (e.target as HTMLDivElement).getBoundingClientRect();
            const mousePos = orientation === "vertical" ? e.clientY : e.clientX;
            const middlePos = orientation === "vertical" ? (rect.top + rect.bottom) / 2 : (rect.left + rect.right) / 2;
            const position = mousePos < middlePos
                ? (orientation === "vertical" ? "above" : "left")
                : (orientation === "vertical" ? "below" : "right");
            setDragOverPosition(position);
            setDragOverIndex(index);
        }
    };

    const handleDrop = () => {
        if (draggingIndex !== null && dragOverIndex !== null && draggingIndex !== dragOverIndex) {
            const updatedItems = [...dragItems];
            const [removed] = updatedItems.splice(draggingIndex, 1);
            const dropPosition = (dragOverPosition === "above" || dragOverPosition === "left")
                ? dragOverIndex
                : dragOverIndex + 1;
            updatedItems.splice(dropPosition > draggingIndex ? dropPosition - 1 : dropPosition, 0, removed);
            setDragItems(updatedItems);
            onDrop(updatedItems);
        }
        setDraggingIndex(null);
        setDragOverIndex(null);
        setDragOverPosition(null);
    };

    const handleDragEnd = () => {
        setDraggingIndex(null);
        setDragOverIndex(null);
        setDragOverPosition(null);
    };

    return (
        <div className={className}>
            {dragItems.map((item, index) => (
                <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    className={twMerge(
                        "rounded",
                        dragOverIndex === index && dragOverPosition === "above" && draggingIndex !== index ? "border-t-4 border-green-500" : "",
                        dragOverIndex === index && dragOverPosition === "below" && draggingIndex !== index ? "border-b-4 border-green-500" : "",
                        dragOverIndex === index && dragOverPosition === "left" && draggingIndex !== index ? "border-l-4 border-green-500" : "",
                        dragOverIndex === index && dragOverPosition === "right" && draggingIndex !== index ? "border-r-4 border-green-500" : "",
                    )}
                >
                    {render(item, index)}
                </div>
            ))}
        </div>
    );
};

export default Draggables;
