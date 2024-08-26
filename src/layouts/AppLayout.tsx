import BottomNavBar from "@/components/NavBars/BottomNavBar.tsx";
import LeftNavBar from "@/components/NavBars/LeftNavBar";
import { NavBarLocation } from "@/types/payloads/ready.ts";
import { useSettingsStore } from "@/wrapper/Stores.ts";
import { memo } from "react";

const AppLayout = memo(({ children }: { children?: React.ReactElement | React.ReactElement[]; }) => {
	const { navBarLocation } = useSettingsStore();

	return (
		<div className="flex">
			{navBarLocation === NavBarLocation.Left ? <LeftNavBar /> : <BottomNavBar />}
			{children}
		</div>
	);
});

export default AppLayout;
