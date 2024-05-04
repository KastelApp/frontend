import MessageContainer from "@/components/MessageContainer/MessageContainer.tsx";
import ChannelNavBar from "@/components/NavBars/ChannelNavBar.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";

const Guild = () => {

    return (
        <AppLayout>
            <ChannelNavBar>
                <>
                    <MessageContainer placeholder="Message #general" />
                </>
            </ChannelNavBar>
        </AppLayout>
    );
};

export default Guild;
