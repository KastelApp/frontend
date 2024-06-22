import Message from "@/components/Message/Message.tsx";
import MessageContainer from "@/components/MessageContainer/MessageContainer.tsx";
import BiDirectionalInfiniteScroller from "../BiDirectionalInfiniteScroller.tsx";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { useMemberStore } from "@/wrapper/Stores/Members.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import { useChannelStore, usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import Logger from "@/utils/Logger.ts";
import PermissionHandler from "@/wrapper/PermissionHandler.ts";
import { type Message as MessageType, useMessageStore } from "@/wrapper/Stores/MessageStore.ts";
import SkellyMessage from "../Message/SkellyMessage.tsx";
import diff from "@/utils/diff.ts";
import ChannelIcon from "../ChannelIcon.tsx";
import { channelTypes } from "@/utils/Constants.ts";

const skelliedMessages = Array.from({ length: 50 }, (_, i) => <SkellyMessage key={i} />);

/**
 * This is for TextBased Channel's, i.e DM's, Guild Text Channels, etc.
 */
const TextBasedChannel = () => {
	const router = useRouter();
	const [readOnly, setReadOnly] = useState(true); // ? This is just so we know if the user can send messages or not (we prevent any changes / letting them type if so)
	const [canViewMessages, setCanViewMessages] = useState(false); // ? This is for when message history is disabled, true = can view messages, false = cannot view messages
	const [changeSignal, setChangeSignal] = useState(0); // ? every time we want a re-render, we increment this value

	const { channelId, guildId } = router.query as { guildId: string; channelId: string; };

	const bottomRef = useRef<HTMLDivElement>(null);
	const channelIdRef = useRef(channelId);

	const { getCurrentUser } = useUserStore();
	const { getMember } = useMemberStore();
	const { getRoles } = useRoleStore();
	const { getChannels } = useChannelStore();
	const { fetchMessages, createMessage, getMessages, editMessage } = useMessageStore();
	const { getChannel, updateChannel } = usePerChannelStore();

	const [renderedMessages, setRenderedMessages] = useState<MessageType[]>([]);
	const [hadError, setHadError] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [initialFetch, setInitialFetch] = useState(false);
	const [channelName, setChannelName] = useState("");
	const fetchingRef = useRef(false);
	const [isInViewOfBottom] = useState(true);

	const perChannel = getChannel(channelId);

	useEffect(() => {
		fetchingRef.current = fetching;
	}, [fetching]);

	useEffect(() => {
		const memberSubscription = useMemberStore.subscribe(() => setChangeSignal((prev) => prev + 1));
		const roleSubscription = useRoleStore.subscribe(() => setChangeSignal((prev) => prev + 1));
		const channelSubscription = useChannelStore.subscribe(() => setChangeSignal((prev) => prev + 1));
		const messageSubscription = useMessageStore.subscribe((state, prevState) => {
			const oldMessages = prevState.messages.filter((msg) => msg.channelId === channelIdRef.current);
			const newMessages = state.messages.filter((msg) => msg.channelId === channelIdRef.current);

			const diffed = diff(oldMessages, newMessages);

			// ? If there's an addition and we are inView of the bottom then add the new message to the bottom
			// ? If there's a removal and its in rendered messages then remove it (since it probably got deleted)
			// ? If there's an edit and its in rendered messages then update it
			console.log(diffed, channelId);

			setRenderedMessages((prev) => {
				let updatedMessages = prev;

				if (diffed.removed.length > 0) {
					updatedMessages = updatedMessages.filter((msg) => !diffed.removed.some((removed) => removed.id === msg.id));
				}

				if (diffed.added.length > 0 && isInViewOfBottom) {
					updatedMessages = [...updatedMessages, ...diffed.added];
				}

				if (diffed.changed.length > 0) {
					updatedMessages = updatedMessages.map((msg) => {
						const found = diffed.changed.find((edited) => edited.id === msg.id);

						if (!found) {
							return msg;
						}

						return found;
					});
				}

				return updatedMessages;
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

		console.log(messageCache);

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

			setRenderedMessages(newMessages);
			setFetching(false);
			setInitialFetch(true);

			//?  we assume this is the first load so we scroll to the bottom
			setTimeout(() => bottomRef.current?.scrollIntoView({
				behavior: "instant",
				block: "nearest",
				inline: "start"
			}), 50);

			return;
		}

		setFetching(false);
		setInitialFetch(true);

		if (messageCache.length > 250) {
			setRenderedMessages(messageCache.slice(0, 250));

			return;
		}

		setRenderedMessages(messageCache);
	};

	useEffect(() => {
		setHadError(false);
		setInitialFetch(false);
		setRenderedMessages([]);

		channelIdRef.current = channelId;

		const clientUser = getCurrentUser();

		if (!clientUser) {
			Logger.warn("No client user found", "TextBasedChannel");

			return;
		}

		const guildMember = getMember(guildId, clientUser.id);
		const roles = getRoles(guildId);
		const channels = getChannels(guildId);

		const foundChannel = channels.find((channel) => channel.id === channelId);

		if (foundChannel) {
			setChannelName(foundChannel.name);
		}

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
		<MessageContainer placeholder={`Message #${channelName}`} isReadOnly={readOnly} sendMessage={(content) => {
			console.log(content);

			createMessage(channelId, {
				content,
				id: "cats"
			});

			setTimeout(() => bottomRef.current?.scrollIntoView({
				behavior: "instant",
				block: "nearest",
				inline: "start"
			}), 50);

			setTimeout(() => {
				editMessage("cats", {
					content: "I wuv cats"
				})
			}, 2000)
		}}
		channelId={channelId}
		guildId={guildId}
		>
			<div className="mt-auto overflow-y-auto">
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
					topContent={
						!perChannel.hasMoreBefore &&
						<div className="mb-4 mr-16 ml-2 flex border-b-1 border-gray-800 select-none">
							<div className="flex mb-2">
								<div className="bg-slate-700 p-2 rounded-full flex items-center">
									<ChannelIcon type={channelTypes.GuildText} size={48} />
								</div>
								<div className="ml-2 mt-2">
									<h1 className="font-bold text-xl">Welcome to the #{channelName} channel</h1>
									<h2 className="text-gray-400">This is the beginning of the channel</h2>
								</div>
							</div>
						</div>
					}
					hasMoreTop={perChannel.hasMoreBefore}
				/>
				<div ref={bottomRef} />
			</div>
		</MessageContainer>
	);
};

export default TextBasedChannel;
