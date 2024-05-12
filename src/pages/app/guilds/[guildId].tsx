import TextBasedChannel from "@/components/Channels/TextBasedChannel.tsx";
import ChannelNavBar from "@/components/NavBars/ChannelNavBar.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";

const Guild = () => {

    return (
        <AppLayout>
            <ChannelNavBar>
                <TextBasedChannel />
            </ChannelNavBar>
        </AppLayout>
    );
};

export default Guild;
