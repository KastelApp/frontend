import DmNavBar from "@/components/NavBars/DmNavBar.tsx";
import cn from "@/utils/cn.ts";
import { useStoredSettingsStore } from "@/wrapper/Stores.tsx";

const App = () => {
	const { isChannelsOpen, isMobile } = useStoredSettingsStore();


	return (
		<>
			<div className={cn(isChannelsOpen ? "mm-w-60" : "mm-w-0", isChannelsOpen && isMobile ? "fixed top-0 left-16 bottom-0 z-10" : "")}>
				<DmNavBar />
			</div>

			<div className="w-full h-screen">
				Test
			</div>
		</>
	);
};

App.shouldHaveLayout = true;

export default App;
