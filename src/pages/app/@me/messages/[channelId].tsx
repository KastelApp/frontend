import TextBasedChannel from "@/components/Channels/TextBasedChannel.tsx";
import DmNavBar from "@/components/NavBars/DmNavBar.tsx";
import { Avatar, Button } from "@nextui-org/react";
import { useRouter } from "next/router";

const DmChannel = () => {
	const router = useRouter();

	return (
		<DmNavBar
			title={
				<div className="flex font-normal">
					<Avatar src="/icon-1.png" className="mr-2 h-6 w-6" />
					<p className="">{router.query.channelId}</p>
				</div>
			}
			topNavBarEndContent={
				<div className="flex gap-1">
					<Button color="primary" variant="flat" radius="none" className="h-6 max-h-6 max-w-full rounded-sm text-xs">
						Send friend request
					</Button>
					<Button color="danger" variant="flat" radius="none" className="h-6 max-h-6 max-w-full rounded-sm text-xs">
						Block
					</Button>
				</div>
			}
		>
			<TextBasedChannel />
		</DmNavBar>
	);
};

DmChannel.shouldHaveLayout = true;

export default DmChannel;
