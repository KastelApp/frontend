import { useEffect, useState } from "react";
import cn from "@/utils/cn.ts";

interface DraggableItemProps {
	// in the future we might add more props
	draggable: boolean;
}

interface DraggableProps<T> {
	items: T[];
	/**
	 * Render {@link items}
	 */
	render: (item: T, index: number, props: DraggableItemProps) => JSX.Element;
	/**
	 * Runs when the items are dropped, returns the new items array as well as the item that was dropped.
	 */
	onDrop: (items: T[], prev: T[], droppedItem: T) => void;

	/**
	 * Runs when the user starts dragging an item
	 */
	onDrag?: (item: T, items: T[]) => void;

	/**
	 * Runs when the user stops dragging but didn't drop the item anywhere (also gets called when onDrop gets called)
	 */
	onDragStop?: (items: T[]) => void;

	/**
	 * Orientation of the draggables i.e vertical or horizontal
	 */
	orientation?: "vertical" | "horizontal";
	/**
	 * List of indexes to be disabled
	 */
	disabledIndexes?: number[];
	/**
	 * List of indexes where items cannot be placed above
	 */
	noDropAboveIndexes?: number[];
	/**
	 * List of indexes where items cannot be placed below
	 */
	noDropBelowIndexes?: number[];
	/**
	 * Disables the ghost element
	 */
	disableGhostElement?: boolean;
	/**
	 * If we should move items at the bottom to the top.
	 *
	 * Defaults to false
	 */
	moveBottomToTop?: boolean;
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
	disabledIndexes = [],
	noDropAboveIndexes = [],
	noDropBelowIndexes = [],
	className,
	disableGhostElement,
	onDrag,
	onDragStop,
	moveBottomToTop = false,
}: DraggableProps<T>) => {
	const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
	const [dragItems, setDragItems] = useState(items);
	const [dragOverPosition, setDragOverPosition] = useState<"above" | "below" | "left" | "right" | null>(null);

	useEffect(() => {
		setDragItems(items);
	}, [items]);

	const handleDragStart = (index: number) => {
		if (!disabledIndexes.includes(index)) {
			setDraggingIndex(index);
		}

		if (onDrag) onDrag(items[index], items);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
		e.preventDefault();
		if (index !== draggingIndex && !disabledIndexes.includes(index)) {
			const rect = (e.target as HTMLDivElement).getBoundingClientRect();
			const mousePos = orientation === "vertical" ? e.clientY : e.clientX;
			const middlePos = orientation === "vertical" ? (rect.top + rect.bottom) / 2 : (rect.left + rect.right) / 2;
			const position =
				mousePos < middlePos
					? orientation === "vertical"
						? "above"
						: "left"
					: orientation === "vertical"
						? "below"
						: "right";
			setDragOverPosition(position);
			setDragOverIndex(index);
		}
	};

	const handleDrop = () => {
		if (
			draggingIndex !== null &&
			dragOverIndex !== null &&
			draggingIndex !== dragOverIndex &&
			!(
				(dragOverPosition === "above" && noDropAboveIndexes.includes(dragOverIndex)) ||
				(dragOverPosition === "below" && noDropBelowIndexes.includes(dragOverIndex))
			)
		) {
			const oldDropItems = [...dragItems];
			const updatedItems = [...dragItems];
			const [removed] = updatedItems.splice(draggingIndex, 1);
			const dropPosition =
				dragOverPosition === "above" || dragOverPosition === "left" ? dragOverIndex : dragOverIndex + 1;
			updatedItems.splice(dropPosition > draggingIndex ? dropPosition - 1 : dropPosition, 0, removed);
			setDragItems(updatedItems);
			onDrop(updatedItems, oldDropItems, removed);
		}
		setDraggingIndex(null);
		setDragOverIndex(null);
		setDragOverPosition(null);
	};

	const handleDragEnd = () => {
		setDraggingIndex(null);
		setDragOverIndex(null);
		setDragOverPosition(null);

		if (onDragStop) onDragStop(items);
	};

	const handleGhostDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragOverIndex(dragItems.length);
		setDragOverPosition("below");
	};

	const handleGhostDrop = () => {
		if (draggingIndex !== null) {
			const oldDropItems = [...dragItems];
			const updatedItems = [...dragItems];
			const [removed] = updatedItems.splice(draggingIndex, 1);
			// updatedItems.push(removed);

			if (moveBottomToTop) {
				updatedItems.unshift(removed);
			} else {
				updatedItems.push(removed);
			}

			setDragItems(updatedItems);
			onDrop(updatedItems, oldDropItems, removed);
		}
		setDraggingIndex(null);
		setDragOverIndex(null);
		setDragOverPosition(null);
	};

	return (
		<div className={className}>
			{dragItems.map((item, index) => (
				<div
					key={index}
					draggable={!disabledIndexes.includes(index)}
					onDragStart={() => handleDragStart(index)}
					onDragOver={(e) => handleDragOver(e, index)}
					onDrop={handleDrop}
					onDragEnd={handleDragEnd}
					className={cn(
						"rounded",
						disabledIndexes.includes(index) ? "cursor-not-allowed opacity-30" : "",
						dragOverIndex === index &&
							dragOverPosition === "above" &&
							draggingIndex !== index &&
							!noDropAboveIndexes.includes(index)
							? "border-t-4 border-green-500"
							: "",
						dragOverIndex === index &&
							dragOverPosition === "below" &&
							draggingIndex !== index &&
							!noDropBelowIndexes.includes(index)
							? "border-b-4 border-green-500"
							: "",
						dragOverIndex === index && dragOverPosition === "left" && draggingIndex !== index
							? "border-l-4 border-green-500"
							: "",
						dragOverIndex === index && dragOverPosition === "right" && draggingIndex !== index
							? "border-r-4 border-green-500"
							: "",
					)}
				>
					{render(item, index, {
						draggable: true,
					})}
				</div>
			))}
			{!disableGhostElement && (
				<div
					onDragOver={handleGhostDragOver}
					onDrop={handleGhostDrop}
					className={cn(
						"h-10 w-full",
						dragOverIndex === dragItems.length && dragOverPosition === "below" ? "border-t-4 border-green-500" : "",
					)}
				/>
			)}
		</div>
	);
};

export default Draggables;
