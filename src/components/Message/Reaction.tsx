import cn from "@/utils/cn.ts";
import React from "react";

interface ReactionBoxProps {
	icon: React.ReactNode;
	count: number;
	selected?: boolean;
}

const ReactionBox = ({ icon, count, selected = true }: ReactionBoxProps) => {
	return (
		<div
			className={cn(
				"mb-0.5 mt-1 inline-flex max-w-max cursor-pointer items-center space-x-1 rounded-md bg-darkAccent px-1.5 text-sm font-medium text-gray-700 dark:text-gray-200",
				selected && "border-1 border-primary bg-primary/20",
			)}
		>
			<span className="flex h-4 w-4 items-center justify-center">{icon}</span>
			<span>{count}</span>
		</div>
	);
};

export default ReactionBox;
