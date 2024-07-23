import useTypingIndicator from "@/hooks/useTypingIndicator.ts";
import { useEffect, useState } from "react";

const Typing = () => {
    const [startedTypingAt, setStartedTypingAt] = useState(0);
    const [lastTypedAt, setLastTypedAt] = useState(0);
    const [lastSentTypingAt, setLastSentTypingAt] = useState(0);
  
    const {
        isTyping,
        sendUserIsTyping,
        sentTypingEvent,
        shouldSendTypingEvent
    } = useTypingIndicator({
        lastSentTypingAt,
        lastTypedAt,
        setLastSentTypingAt,
        setLastTypedAt,
        setStartedTypingAt,
        startedTypingAt
    });

    useEffect(() => {
        if (shouldSendTypingEvent) {
            sentTypingEvent();
            console.log("Sent typing event")
        }
    }, [shouldSendTypingEvent])

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <input type="text" onChange={sendUserIsTyping} />
            <div>
                {isTyping ? "Typing..." : "Not Typing"}
            </div>
            <div>
                {shouldSendTypingEvent ? "Should send typing event" : "Should not send typing event"}
            </div>
        </div>
    );
}

export default Typing