import Message from "@/components/Message/Message.tsx";
import MessageContainer from "@/components/MessageContainer/MessageContainer.tsx";
import ChannelNavBar from "@/components/NavBars/ChannelNavBar.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";

const Guild = () => {

    return (
        <AppLayout>
            <ChannelNavBar>
                <MessageContainer placeholder="Message #general">
                    <div className="flex flex-col-reverse overflow-x-hidden w-full">
                        {Array.from({ length: 20 }, (_, i) => (
                            <Message key={i} content={`${i}`} replying={i % 5 === 0} />
                        ))}
                    </div>
                    <div id="bottom" />
                </MessageContainer>
            </ChannelNavBar>
        </AppLayout>
    );
};

export default Guild;
