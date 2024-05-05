import Message from "@/components/Message/Message.tsx";
import MessageContainer from "@/components/MessageContainer/MessageContainer.tsx";
import ChannelNavBar from "@/components/NavBars/ChannelNavBar.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";

const Guild = () => {

    return (
        <AppLayout>
            <ChannelNavBar>
                <MessageContainer placeholder="Message #general">
                    <div className="flex flex-col-reverse overflow-auto">
                        {Array.from({ length: 13 }, (_, i) => (
                            <Message key={i} content={`${i}`} />
                        ))}
                    </div>
                    <div id="bottom" />
                </MessageContainer>
            </ChannelNavBar>
        </AppLayout>
    );
};

export default Guild;
