import LeftNavBar from "@/components/NavBars/LeftNavBar.tsx";
import useEasyResizable from "@/hooks/useEasyResizable.tsx";
import { useRouter } from "@/hooks/useRouter.ts";
import cn from "@/utils/cn.ts";
import { Routes } from "@/utils/Routes.ts";
import { useStoredSettingsStore } from "@/wrapper/Stores.tsx";
import { useEffect } from "react";

const AppLayout = ({ children }: { children?: React.ReactElement | React.ReactElement[] }) => {
	const router = useRouter();
	const {
		navbarPosition,
		setNavbarPosition,
		setIsMobile,
		setIsChannelsOpen,
		setIsMembersOpen,
		setIsHubsOpen,
		isChannelsOpen,
		isHubsOpen,
		isMobile,
	} = useStoredSettingsStore();

	const shouldHaveZeroPx = router.pathname === Routes.hubs();

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
			setIsChannelsOpen(window.innerWidth >= 768);
			setIsMembersOpen(window.innerWidth >= 768);
			setIsHubsOpen(window.innerWidth >= 768);
		};

		checkMobile();
	}, []);

	const {
		Separator: LeftSeparator,
		panelProps,
		ResizablePanel,
		position,
	} = useEasyResizable({
		axis: "x",
		initial: navbarPosition,
		min: 64,
		max: 300,
		onResizeEnd: (args) => {
			setNavbarPosition(args.position);
		},
	});

	const gridTemplateColumns = `
		${isHubsOpen && !isMobile ? position + 4 : 0}px
		${shouldHaveZeroPx ? 0 : isChannelsOpen && !isMobile ? 240 : 0}px
		1fr
		${shouldHaveZeroPx ? 0 : 240}px
	`;

	return (
		<div className="grid h-screen overflow-x-hidden" style={{ gridTemplateColumns: gridTemplateColumns }}>
			<div className="flex h-full">
				<ResizablePanel
					noSize={isMobile}
					{...panelProps}
					className={cn(isHubsOpen && isMobile && "fixed z-[1] bg-background")}
				>
					{isHubsOpen && <LeftNavBar />}
				</ResizablePanel>
				{!isMobile && <LeftSeparator />}
			</div>
			{children}
		</div>
	);
};

export default AppLayout;
