import TextBasedChannel from "@/components/Channels/TextBasedChannel.tsx";
import ChannelNavBar from "@/components/NavBars/ChannelNavBar.tsx";

const Channel = () => {
    return (
        <ChannelNavBar>
            <TextBasedChannel />
        </ChannelNavBar>
    );
};

Channel.shouldHaveLayout = true;

export default Channel;
