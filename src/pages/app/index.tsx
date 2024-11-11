import DmNavBar from "@/components/NavBars/DmNavBar.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";
import cn from "@/utils/cn.ts";
import { useStoredSettingsStore } from "@/wrapper/Stores.tsx";

const App = () => {
	const { isChannelsOpen, isMobile } = useStoredSettingsStore();


	return (
		<AppLayout>
			<div className={cn(isChannelsOpen ? "mm-w-60" : "mm-w-0", isChannelsOpen && isMobile ? "fixed top-0 left-16 bottom-0 z-10" : "")}>
				<DmNavBar />
			</div>

			<div className="w-full h-screen">
				Test
			</div>
		</AppLayout>
	);
};

export default App;
