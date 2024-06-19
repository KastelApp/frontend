import LeftNavbar from "@/components/NavBars/LeftNavbar.tsx";
import { useSettingsStore } from "@/wrapper/Stores.ts";
import { memo } from "react";

const AppLayout = memo(({ children }: { children?: React.ReactElement | React.ReactElement[]; }) => {
	const { navBarLocation } = useSettingsStore();

	return (
		<div className="flex">
			{navBarLocation === "left" && <LeftNavbar />}
			{children}
		</div>
	);
});

export default AppLayout;
