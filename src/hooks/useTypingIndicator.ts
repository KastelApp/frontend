import { useState, useEffect, useRef } from "react";

interface TypingIndicator {
  isTyping: boolean;
  sendUserIsTyping: () => void;
  sentTypingEvent: () => void;
  shouldSendTypingEvent: boolean;
}

interface Props {
  startedTypingAt: number;
  setStartedTypingAt: (time: number) => void;
  lastTypedAt: number;
  setLastTypedAt: (time: number) => void;
  lastSentTypingAt: number;
  setLastSentTypingAt: (time: number) => void;
}

/**
 * How this works is simple. When the user types you call `sendUserIsTyping` which sets `isTyping` to true after 3 seconds of typing
 * 
 * Once isTyping is true, it will set `shouldSendTypingEvent` to true. When its true you should send a typing event to the server, and then call `sentTypingEvent`
 * 
 * When `sentTypingEvent` is called it will set `shouldSendTypingEvent` to false. After 7 seconds it becomes true again.
 * 
 * When the user stops typing there's a 3 second delay before `isTyping` is set to false
 */
const useTypingIndicator = ({
  lastSentTypingAt,
  lastTypedAt,
  setLastSentTypingAt,
  setLastTypedAt,
  setStartedTypingAt,
  startedTypingAt
}: Props): TypingIndicator => {
  const [isTyping, setIsTyping] = useState(false);
  const [shouldSendTypingEvent, setShouldSendTypingEvent] = useState(false);

  const resetStartedTypingAtRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypedRef = useRef<number>(lastTypedAt);
  const shouldSendTypingEventRef = useRef<boolean>(shouldSendTypingEvent);
  const startedTypingAtRef = useRef<number>(startedTypingAt);
  const lastSentTypingAtRef = useRef<number>(lastSentTypingAt);
  const isTypingRef = useRef<boolean>(isTyping);

  useEffect(() => {
    lastTypedRef.current = lastTypedAt;
    shouldSendTypingEventRef.current = shouldSendTypingEvent;
    startedTypingAtRef.current = startedTypingAt;
    lastSentTypingAtRef.current = lastSentTypingAt;
    isTypingRef.current = isTyping;
  }, [lastTypedAt, shouldSendTypingEvent, startedTypingAt, lastSentTypingAt, isTyping]);

  const sendUserIsTyping = () => {
    if (resetStartedTypingAtRef.current) {
      clearTimeout(resetStartedTypingAtRef.current);
    }

    resetStartedTypingAtRef.current = setTimeout(() => {
      setStartedTypingAt(0);
      setShouldSendTypingEvent(false);
    }, 3000);

    setLastTypedAt(Date.now());

    if (startedTypingAtRef.current === 0) {
      setStartedTypingAt(Date.now());
    }

    if (startedTypingAtRef.current > 0 && Date.now() - startedTypingAtRef.current > 3000) {
      setIsTyping(true);
    }
  }

  const resetShouldSendTypingEvent = useRef<NodeJS.Timeout | null>(null);

  const sentTypingEvent = () => {
    if (!shouldSendTypingEventRef.current) return;

    setShouldSendTypingEvent(false);
    setLastSentTypingAt(Date.now());

    if (resetShouldSendTypingEvent.current) {
      clearTimeout(resetShouldSendTypingEvent.current);
    }

    resetShouldSendTypingEvent.current = setTimeout(() => {
      if (Date.now() - lastTypedRef.current < 2000) {
        setShouldSendTypingEvent(true);
      }
    }, 7000);
  }

  useEffect(() => {
    const checkinterval = setInterval(() => {
      if (Date.now() - lastTypedRef.current > 3000) {
        setIsTyping(false);
      }

      if (isTypingRef.current === true && startedTypingAtRef.current !== 0 && Date.now() - startedTypingAtRef.current > 3000 && (lastSentTypingAtRef.current !== 0 ? Date.now() - lastSentTypingAtRef.current >= 7000 : true)) {
        setShouldSendTypingEvent(true);
      } else {
        setShouldSendTypingEvent(false);
      }
    }, 100);

    return () => {
      clearInterval(checkinterval);
    
      if (resetStartedTypingAtRef.current) {
        clearTimeout(resetStartedTypingAtRef.current);
      }

      if (resetShouldSendTypingEvent.current) {
        clearTimeout(resetShouldSendTypingEvent.current);
      }
    }
  }, []);

  return { isTyping, sendUserIsTyping, sentTypingEvent, shouldSendTypingEvent };
}

export default useTypingIndicator;