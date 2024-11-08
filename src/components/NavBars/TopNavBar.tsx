import cn from "@/utils/cn.ts";

interface TopNavbarProps {
  children: React.ReactNode;
  className?: string;
}

const TopNavBar = ({ children, className }: TopNavbarProps) => {
  return (
    <div className={cn("h-12 bg-darkAccent border-b border-[#26282c] flex items-center justify-between px-1", className)}>
      {children}
    </div>
  );
};

export default TopNavBar;