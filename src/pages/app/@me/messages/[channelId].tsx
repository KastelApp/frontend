import TextBasedChannel from "@/components/Channels/TextBasedChannel.tsx";
import DmNavBar from "@/components/NavBars/DmNavBar.tsx";
import { Avatar, Button } from "@nextui-org/react";
import { useRouter } from "next/router";

const DmChannel = () => {
	const router = useRouter();

	return (
		<DmNavBar
			title={
				<div className="font-normal flex">
					<Avatar src="/icon-1.png" className="mr-2 h-6 w-6" />
					<p className="">{router.query.channelId}</p>
				</div>
			}
			topNavBarEndContent={
				<div className="flex gap-1">
					<Button color="primary" variant="flat" radius="none" className=" max-w-full h-6 max-h-6 text-xs rounded-sm">
						Send friend request
					</Button>
					<Button color="danger" variant="flat" radius="none" className=" max-w-full h-6 max-h-6 text-xs rounded-sm">
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
