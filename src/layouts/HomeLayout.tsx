import Footer from "@/components/Footer.tsx";
import TopHeader from "@/components/TopHeader.tsx";
import { confettiDark } from "@/components/confetti.tsx";

const HomeLayout = ({
	children,
}: {
	children?: React.ReactElement | React.ReactElement[] | React.ReactElement | React.ReactElement[][];
}) => {
	return (
		<div style={{
			backgroundImage: confettiDark // ? brings some life to the pages
		}}>
			<div className="flex flex-col min-h-screen">
				<TopHeader />
				<main className="flex-grow">{children}</main>
			</div>
			<Footer />
		</div>
	);
};

export default HomeLayout;
