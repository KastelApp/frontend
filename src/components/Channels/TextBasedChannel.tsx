import Message from "@/components/Message/Message.tsx";
import MessageContainer from "@/components/MessageContainer/MessageContainer.tsx";
import BiDirectionalInfiniteScroller from "../BiDirectionalInfiniteScroller.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { useMemberStore } from "@/wrapper/Stores/Members.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import { useChannelStore, usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import Logger from "@/utils/Logger.ts";
import PermissionHandler from "@/wrapper/PermissionHandler.ts";
import { type Message as MessageType, useMessageStore } from "@/wrapper/Stores/MessageStore.ts";
import SkellyMessage from "../Message/SkellyMessage.tsx";

const skelliedMessages = Array.from({ length: 50 }, (_, i) => <SkellyMessage key={i} />);

/**
 * This is for TextBased Channel's, i.e DM's, Guild Text Channels, etc.
 */
const TextBasedChannel = () => {
	const router = useRouter();
	// ? This is just so we know if the user can send messages or not (we prevent any changes / letting them type if so)
	const [readOnly, setReadOnly] = useState(true);
	// ? This is for when message history is disabled, true = can view messages, false = cannot view messages
	const [canViewMessages, setCanViewMessages] = useState(false);
	// ? every time we want a re-render, we increment this value
	const [changeSignal, setChangeSignal] = useState(0);

	const { channelId, guildId } = router.query as { guildId: string; channelId: string; };

	const { getCurrentUser } = useUserStore();
	const { getMember } = useMemberStore();
	const { getRoles } = useRoleStore();
	const { getChannels } = useChannelStore();
	const { fetchMessages, createMessage, getMessages } = useMessageStore();
	const { getChannel, updateChannel } = usePerChannelStore();

	const [renderedMessages, setRenderedMessages] = useState<MessageType[]>([]);
	const [hadError, setHadError] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [initialFetch, setInitialFetch] = useState(false);
	const fetchingRef = useRef(false);

	useEffect(() => {
		fetchingRef.current = fetching;
	}, [fetching]);

	useEffect(() => {
		const memberSubscription = useMemberStore.subscribe(() => setChangeSignal((prev) => prev + 1));
		const roleSubscription = useRoleStore.subscribe(() => setChangeSignal((prev) => prev + 1));
		const channelSubscription = useChannelStore.subscribe(() => setChangeSignal((prev) => prev + 1));
		const messageSubscription = useMessageStore.subscribe((state) => {
			setRenderedMessages((prev) => {
				const newMessages = prev.map((message) => {
					const found = state.messages.find((msg) => msg.id === message.id);

					if (!found) {
						return message;
					}

					return found;
				});

				return newMessages;
			});
		});

		return () => {
			memberSubscription();
			roleSubscription();
			channelSubscription();
			messageSubscription();
		};
	}, []);

	const setMessages = async (guildId: string, channelId: string) => {
		if (fetchingRef.current) return;

		setFetching(true);

		const messageCache = getMessages(channelId);
		const perChannel = getChannel(channelId);

		if (messageCache.length < 50 && (perChannel.hasMoreAfter || perChannel.hasMoreAfter)) {
			const fetched = await fetchMessages(channelId, {
				limit: 50,
			});

			if (!fetched) {
				setHadError(true);

				updateChannel(channelId, {
					fetchingError: true
				});

				return;
			}

			const newMessages = getMessages(channelId);

			setRenderedMessages(newMessages.toReversed());

			setFetching(false);

			setInitialFetch(true);

			return;
		}

		setFetching(false);
		setInitialFetch(true);

		if (messageCache.length > 250) {
			setRenderedMessages(messageCache.slice(0, 250));

			return;
		}

		setRenderedMessages(messageCache.toReversed());
	};

	useEffect(() => {
		setHadError(false);
		setInitialFetch(false);
		setRenderedMessages([]);

		const clientUser = getCurrentUser();

		if (!clientUser) {
			Logger.warn("No client user found", "TextBasedChannel");

			return;
		}

		const guildMember = getMember(guildId, clientUser.id);
		const roles = getRoles(guildId);
		const channels = getChannels(guildId);

		if (!guildMember) {
			Logger.warn("No guild member found", "TextBasedChannel");

			return;
		}

		const permissionHandler = new PermissionHandler(
			clientUser.id,
			guildMember.owner,
			guildMember.roles.map(roleId => roles.find(role => role.id === roleId)!).filter(Boolean),
			channels
		);

		if (!permissionHandler.hasChannelPermission(channelId, ["ViewChannels"])) {
			router.push(`/app/guilds/${guildId}`);

			return;
		}

		setReadOnly(!permissionHandler.hasChannelPermission(channelId, ["SendMessages"]));

		const perChannel = getChannel(channelId);

		if (perChannel.fetchingError) {
			console.log("had error :/");
			setHadError(true);

			return;
		}

		setMessages(guildId, channelId);
	}, [channelId, guildId, changeSignal]);

	return (
		<MessageContainer placeholder="Message #general" isReadOnly={readOnly} sendMessage={(content) => {
			console.log(content);
		}}>
			<div className="flex-grow pr-2 overflow-y-auto">
				{!initialFetch && skelliedMessages}
				<BiDirectionalInfiniteScroller
					data={renderedMessages}
					renderItem={(message) => (
						<Message
							message={message}
							key={message.id}
						/>
					)}
					onBottomReached={async () => {
						console.log("bottom reached");
					}}
					onTopReached={async () => {
						console.log("top reached");
					}}
					topSkeleton={<>{skelliedMessages}</>}
					bottomSkeleton={<>{skelliedMessages}</>}
					initialScrollTop={-1}
					loading={fetching}
					topContent={<>You've reached the top</>}
				/>
			</div>
		</MessageContainer>
	);
};

export default TextBasedChannel;
