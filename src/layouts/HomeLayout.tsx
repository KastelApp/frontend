import Footer from "@/components/Footer.tsx";
import TopHeader from "@/components/TopHeader.tsx";
import { confettiDark } from "@/components/confetti.tsx";
import cn from "@/utils/cn.ts";

const HomeLayout = ({ children, className, disableBackgroundImage = false }: { children?: React.ReactNode; className?: string; disableBackgroundImage?: boolean }) => {
	return (
		<div
			style={{
				backgroundImage: disableBackgroundImage ? undefined : confettiDark, // ? brings some life to the pages
			}}
		>
			<div className="flex min-h-screen flex-col">
				<TopHeader />
				<main className={cn("flex-grow", className)}>{children}</main>
			</div>
			<Footer />
		</div>
	);
};

export default HomeLayout;
