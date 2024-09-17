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
        "inline-flex max-w-max mt-1 mb-0.5 items-center space-x-1 text-sm font-medium text-gray-700 bg-darkAccent dark:text-gray-200 rounded-md px-1.5 cursor-pointer",
        selected && "border-1 border-primary bg-primary/20"
      )}>
      <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      <span>{count}</span>
    </div>
  );
};

export default ReactionBox;
