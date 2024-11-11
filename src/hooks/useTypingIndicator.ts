import { useState, useEffect, useCallback, useRef } from "react";

interface TypingIndicator {
	isTyping: boolean;
	sendUserIsTyping: (content: string) => void;
	shouldSendTypingEvent: boolean;
	sentTypingEvent: () => void;
}

interface Props {
	onTypingStart: () => void;
	onTypingStop: () => void;
	/**
	 * How often shouldSendTyping is set to true
	 */
	typingEventInterval?: number;
	/**
	 * How long until we class the user as typing / not typing
	 */
	typingTimeout?: number;

	miscTimeout?: number;
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
	onTypingStart,
	onTypingStop,
	typingTimeout = 750,
	typingEventInterval = 7000,
	miscTimeout = 3000,
}: Props): TypingIndicator => {
	const [isTyping, setIsTyping] = useState(false);
	const [shouldSendTypingEvent, setShouldSendTypingEvent] = useState(false);
	const [lastTyped, setLastTyped] = useState<number>(0);
	const [startedTyping, setStartedTyping] = useState<number>(0);
	const [lastSentTyping, setLastSentTyping] = useState<number>(0);
	const timeout = useRef<NodeJS.Timeout | null>(null);
	const initialTimeout = useRef<NodeJS.Timeout | null>(null);

	const sentTypingEvent = useCallback(
		(force: boolean = false) => {
			if (force || shouldSendTypingEvent) {
				setShouldSendTypingEvent(false);
				setLastSentTyping(Date.now());
			}
		},
		[shouldSendTypingEvent],
	);

	// ? When we start typing, we have to wait exactly 1s (typingTimeout) before we set isTyping to true. BUT if its been miscTimeout since we last typed, we have to restart the waiting period

	// if its been more then typingTimeout since we last sent a typing event, we should send one
	const customSendShouldSendTypingEvent = useCallback(() => {
		if (Date.now() - lastSentTyping > typingEventInterval) {
			setShouldSendTypingEvent(true);
		}
	}, [lastSentTyping, typingEventInterval]);

	const sendUserIsTyping = useCallback(
		(content: string) => {
			if (content.length === 0) {
				setIsTyping(false);
				setLastTyped(0);
				setStartedTyping(0);

				if (initialTimeout.current) {
					clearTimeout(initialTimeout.current);
				}

				return;
			}

			if (isTyping) {
				setLastTyped(Date.now());
				return;
			}

			if (Date.now() - lastTyped > miscTimeout) {
				setStartedTyping(Date.now());
				setLastTyped(Date.now());

				if (initialTimeout.current) {
					clearTimeout(initialTimeout.current);
				}

				initialTimeout.current = setTimeout(() => {
					setIsTyping(true);
					onTypingStart();
					customSendShouldSendTypingEvent();
				}, 2000);

				return;
			}

			if (Date.now() - startedTyping > typingTimeout) {
				setIsTyping(true);
				onTypingStart();
				// setShouldSendTypingEvent(true);
			}
		},
		[isTyping, lastTyped, miscTimeout, onTypingStart, startedTyping, typingTimeout],
	);

	useEffect(() => {
		if (isTyping) {
			timeout.current = setTimeout(() => {
				setIsTyping(false);
				onTypingStop();
			}, typingTimeout);
		} else {
			clearTimeout(timeout.current!);
		}

		return () => {
			clearTimeout(timeout.current!);
		};
	}, [isTyping, onTypingStop, typingTimeout]);

	useEffect(() => {
		if (isTyping) {
			const interval = setInterval(() => {
				setShouldSendTypingEvent(true);
			}, typingEventInterval);

			return () => {
				clearInterval(interval);
			};
		}
	}, [isTyping, typingEventInterval]);

	return {
		isTyping,
		sendUserIsTyping,
		shouldSendTypingEvent,
		sentTypingEvent,
	};
};

export default useTypingIndicator;
