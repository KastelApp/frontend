import TextBasedChannel from "@/components/Channels/TextBasedChannel.tsx";
import BrowseChannelsTopNavbar from "@/components/NavBars/BrowseChannelsTopNavbar.tsx";
import ChannelSidebar from "@/components/NavBars/ChannelNavBar.tsx";
import ChannelTopNavbar from "@/components/NavBars/ChannelTopNavbar.tsx";
import MembersNavBar from "@/components/NavBars/MemberNavBar/MembersNavBar.tsx";
import HubChannels from "@/components/Settings/Hub/Channels.tsx";
import { useRouter } from "@/hooks/useRouter.ts";
import AppLayout from "@/layouts/AppLayout.tsx";
import arrayify from "@/utils/arrayify.ts";
import cn from "@/utils/cn.ts";
import Logger from "@/utils/Logger.ts";
import { Routes } from "@/utils/Routes.ts";
import { useHubSettingsStore, useStoredSettingsStore } from "@/wrapper/Stores.tsx";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useHubStore } from "@/wrapper/Stores/HubStore.ts";
import { useEffect } from "react";

const HubPages = () => {
	const router = useRouter();
	const [hubId, part, channelId, messageId] = arrayify(router.params?.slug);
	const inHub = useHubStore((state) => state.getHub(hubId));
	const channel = useChannelStore((state) => state.getChannel(channelId));
	const getHubSettings = useHubSettingsStore((state) => state.getHubSettings);
	const setHubSettings = useHubSettingsStore((state) => state.setHubSettings);

	useEffect(() => {
		if (!router.isReady) return;

		if (part && part !== "channels") {
			Logger.debug(`Invalid Part: ${part}`, "Pages | HubPage");

			router.push(Routes.hubs());

			return;
		}

		if (inHub?.unavailable) {
			Logger.debug("Hub not found", "Pages | HubPage");

			router.push(Routes.hubs());

			return;
		}

		if (channelId && !channel) {
			Logger.debug("Channel not found", "Pages | HubPage");

			router.push(Routes.hub(hubId));

			return;
		}

		if (!hubId || !channelId) return;

		if (channelId) {
			setHubSettings(hubId, {
				lastChannelId: channelId,
			});
		}
	}, [router, hubId, channelId, part, messageId, getHubSettings, setHubSettings]);

	const { setIsChannelsOpen, setIsMembersOpen, setIsHubsOpen, isChannelsOpen, isHubsOpen, isMembersOpen, isMobile } =
		useStoredSettingsStore();

	const toggle = (type: "channels" | "members") => {
		// ? if on mobile toggle the other one if its open
		if (isMobile) {
			if (type === "channels") {
				setIsChannelsOpen(!isChannelsOpen);
				setIsHubsOpen(!isChannelsOpen);
				if (isMembersOpen) setIsMembersOpen(false);
			} else {
				setIsMembersOpen(!isMembersOpen);
				if (isChannelsOpen) setIsChannelsOpen(false);
				if (isHubsOpen) setIsHubsOpen(false);
			}
		} else {
			if (type === "channels") {
				setIsChannelsOpen(!isChannelsOpen);
			} else {
				setIsMembersOpen(!isMembersOpen);
			}
		}
	};

	return (
		<AppLayout>
			<div className={cn("h-full")}>
				<div className={cn(isChannelsOpen && isMobile ? "fixed bottom-0 left-16 top-0 z-10" : "h-screen")}>
					{isChannelsOpen && <ChannelSidebar currentChannelId={channelId} currentHubId={hubId} />}
				</div>
			</div>

			<div className="col-span-2 flex flex-col">
				{channel && (
					<ChannelTopNavbar
						channel={channel}
						isMobile={isMobile}
						isChannelsOpen={isChannelsOpen}
						toggleChannelSidebar={() => toggle("channels")}
						toggleMembersSidebar={() => toggle("members")}
					/>
				)}
				{!channelId && <BrowseChannelsTopNavbar />}
				<div className="flex flex-1">
					<div className="min-w-0 flex-1 overflow-auto">
						{!channelId && <HubChannels hubId={hubId} />}
						{channelId && <TextBasedChannel />}
						{isMobile && (isMembersOpen || isChannelsOpen) && (
							<div
								className="absolute inset-0 bg-black/50"
								onClick={() => (isMembersOpen ? toggle("members") : toggle("channels"))}
							/>
						)}
					</div>

					{channel && channelId && (
						<MembersNavBar
							className={cn(
								isMembersOpen ? "mm-w-60" : "mm-w-0",
								isMembersOpen && isMobile && "fixed bottom-0 right-0 top-12 ml-auto",
								"flex-shrink-0 overflow-auto",
							)}
						/>
					)}
				</div>
			</div>
		</AppLayout>
	);
};

export default HubPages;
