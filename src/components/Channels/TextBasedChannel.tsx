import Message from "@/components/Message/Message.tsx";
import MessageContainer from "@/components/MessageContainer/MessageContainer.tsx";

const TextBasedChannel = () => {
    return (
        <MessageContainer placeholder="Message #general">
            <div className="flex flex-col-reverse overflow-x-hidden w-full">
                {Array.from({ length: 20 }, (_, i) => (
                    <Message key={i} content={`${i}${i % 10 === 0 ? `${i}`.repeat(500) : ""}`} replying={i % 5 === 0} mention={i % 3 === 0} tag={i % 9 === 0 ? "System" : undefined} />
                ))}
            </div>
            <div id="bottom" />
        </MessageContainer>
    );
};

export default TextBasedChannel;