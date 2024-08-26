import ChannelNavBar from "@/components/NavBars/ChannelNavBar.tsx";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Guild = () => {
	const router = useRouter();

	const [ready, setReady] = useState(false);

	const guildId = router.query.guildId as string;

	const { getTopChannel } = useChannelStore();

	useEffect(() => {
		if (!guildId) return;

		const topChannel = getTopChannel(guildId);

		if (topChannel) {
			router.push(`/app/guilds/${guildId}/channels/${topChannel.id}`);

			return;
		}

		setReady(true);
	}, [guildId]);

	return (
		<ChannelNavBar isChannelHeaderHidden isMemberBarHidden>
			<>
				{ready && <div className="flex justify-center items-center h-screen">
					<div className="text-center -mt-[20%] space-y-2">
						<h1 className="text-white font-semibold text-lg">No Text Channels</h1>
						<p className="text-gray-500 w-96">There's seems to be no text channels in this guild, or you do not have access to any</p>
					</div>
				</div>}
			</>
		</ChannelNavBar>
	);
};

Guild.shouldHaveLayout = true;

export default Guild;
