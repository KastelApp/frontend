import cn from "@/utils/cn.ts";

interface TopNavbarProps {
	children: React.ReactNode;
	className?: string;
}

const TopNavBar = ({ children, className }: TopNavbarProps) => {
	return (
		<div
			className={cn("flex h-12 items-center justify-between border-b border-[#26282c] bg-darkAccent px-1", className)}
		>
			{children}
		</div>
	);
};

export default TopNavBar;
