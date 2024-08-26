import Message, { MessageProps } from "@/components/Message/Message.tsx";
import MessageContainer from "@/components/MessageContainer/MessageContainer.tsx";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { useMemberStore } from "@/wrapper/Stores/Members.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import { useChannelStore, usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import Logger from "@/utils/Logger.ts";
import PermissionHandler from "@/wrapper/PermissionHandler.ts";
import { MessageStates, type Message as MessageType, useMessageStore } from "@/wrapper/Stores/MessageStore.ts";
import SkellyMessage from "../Message/SkellyMessage.tsx";
import diff from "@/utils/diff.ts";
import ChannelIcon from "../ChannelIcon.tsx";
import { channelTypes } from "@/utils/Constants.ts";
import fastDeepEqual from "fast-deep-equal";
import BiDirectionalInfiniteScroller from "@/components/BiDirectionalInfiniteScroller.tsx";
import { useInviteStore } from "@/wrapper/Stores/InviteStore.ts";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu.tsx";
import { Copy, Pen, Pin, Reply, Trash2 } from "lucide-react";
import { Divider } from "@nextui-org/react";

const skelliedMessages = Array.from({ length: 30 }, (_, i) => <SkellyMessage key={i} />);

/**
 * This is for TextBased Channel's, i.e DM's, Guild Text Channels, etc.
 */
const TextBasedChannel = () => {
	const router = useRouter();
	const [readOnly, setReadOnly] = useState(true); // ? This is just so we know if the user can send messages or not (we prevent any changes / letting them type if so)
	const [changeSignal, setChangeSignal] = useState(0); // ? every time we want a re-render, we increment this value

	const { channelId, guildId } = router.query as { guildId: string; channelId: string; };

	const bottomRef = useRef<HTMLDivElement>(null);
	const channelIdRef = useRef(channelId);

	const { getCurrentUser, getUser } = useUserStore();
	const { getMember } = useMemberStore();
	const { getRoles } = useRoleStore();
	const { getChannels } = useChannelStore();
	const { fetchMessages, createMessage, getMessages } = useMessageStore();
	const { getChannel, updateChannel } = usePerChannelStore();
	const { getInvite, fetchInvite } = useInviteStore();
	const { getGuild } = useGuildStore();

	const [fetchedMessages, setFetchedMessages] = useState<MessageType[]>([]);
	const [renderedMessages, setRenderedMessages] = useState<Omit<MessageProps, "className" | "disableButtons" | "id">[]>([]);
	const hadErrorRef = useRef(false);
	const [fetching, setFetching] = useState(false);
	const [initialFetch, setInitialFetch] = useState(false);
	const [channelName, setChannelName] = useState("");
	const fetchingRef = useRef(false);
	const [isInViewOfBottom] = useState(true);
	const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
	const scrollerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		fetchingRef.current = fetching;
	}, [fetching]);

	useEffect(() => {
		const memberSubscription = useMemberStore.subscribe(() => setChangeSignal((prev) => prev + 1));
		const userSubscription = useUserStore.subscribe(() => setChangeSignal((prev) => prev + 1));
		const roleSubscription = useRoleStore.subscribe(() => setChangeSignal((prev) => prev + 1));
		const channelSubscription = useChannelStore.subscribe(() => setChangeSignal((prev) => prev + 1));
		const guildSubscription = useGuildStore.subscribe(() => setChangeSignal((prev) => prev + 1));
		const inviteSubscription = useInviteStore.subscribe(() => setChangeSignal((prev) => prev + 1));
		const messageSubscription = useMessageStore.subscribe((state, prevState) => {
			const oldMessages = prevState.messages.filter((msg) => msg.channelId === channelIdRef.current);
			const newMessages = state.messages.filter((msg) => msg.channelId === channelIdRef.current);

			const diffed = diff(oldMessages, newMessages);

			setFetchedMessages((prev) => {
				let updatedMessages = prev;

				if (diffed.removed.length > 0) {
					updatedMessages = updatedMessages.filter((msg) => !diffed.removed.some((removed) => removed.id === msg.id));
				}

				if (diffed.added.length > 0 && isInViewOfBottom) {
					updatedMessages = [...updatedMessages, ...diffed.added];

					if (scrollerRef.current) {
						const { scrollHeight, scrollTop, clientHeight } = scrollerRef.current;

						// ? theres around 30px of leeway
						if (scrollHeight - scrollTop <= clientHeight + 30) {
							setShouldScrollToBottom(true);
						}
					}
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
			userSubscription();
			inviteSubscription();
			guildSubscription();
		};
	}, []);

	const setMessages = async (guildId: string, channelId: string) => {
		if (fetchingRef.current || hadErrorRef.current) return;

		setFetching(true);

		const messageCache = getMessages(channelId);
		const perChannel = getChannel(channelId);

		if (messageCache.length < 50 && (perChannel.hasMoreAfter || perChannel.hasMoreAfter)) {
			const fetched = await fetchMessages(channelId, {
				limit: 50,
			});

			if (!fetched) {
				hadErrorRef.current = true;

				updateChannel(channelId, {
					fetchingError: true
				});

				return;
			}

			const newMessages = getMessages(channelId);

			setFetchedMessages(newMessages.toSorted((a, b) => a.creationDate.getTime() - b.creationDate.getTime()));
			setInitialFetch(true);

			//?  we assume this is the first load so we scroll to the bottom
			setTimeout(() => bottomRef.current?.scrollIntoView({
				behavior: "instant",
				block: "nearest",
				inline: "start"
			}), 50);

			for (const msg of newMessages) {
				for (const invite of msg.invites) {
					fetchInvite(invite);
				}
			}

			return;
		}

		setInitialFetch(true);

		if (messageCache.length > 250) {
			setFetchedMessages(messageCache.slice(0, 250).toSorted((a, b) => a.creationDate.getTime() - b.creationDate.getTime()));

			return;
		}

		console.log(messageCache);

		setFetchedMessages(messageCache.toSorted((a, b) => a.creationDate.getTime() - b.creationDate.getTime()));
	};

	useEffect(() => {
		hadErrorRef.current = false;

		setInitialFetch(false);
		setFetchedMessages([]);

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

			hadErrorRef.current = true;

			return;
		}

		if (permissionHandler.hasChannelPermission(channelId, ["ViewMessageHistory"])) setMessages(guildId, channelId);
	}, [channelId, guildId, changeSignal]);

	useEffect(() => {
		const finishedMsgs: Omit<MessageProps, "className" | "disableButtons" | "id">[] = [];

		const currentUser = getCurrentUser()!;

		for (const msg of fetchedMessages) {

			const fetchedAuthor = getUser(msg.authorId);
			const fetchedMember = guildId ? getMember(guildId, msg.authorId) ?? null : null;
			const roles = getRoles(guildId ?? "");

			let roleData: { color: string; id: string; } | null = null;

			if (fetchedMember) {
				const topColorRole = fetchedMember.roles
					.map((roleId) => roles.find((role) => role.id === roleId))
					.filter((role) => role !== undefined && role.color !== 0)
					.sort((a, b) => a!.position - b!.position)
					.reverse()[0];

				roleData = {
					color: topColorRole ? topColorRole.color.toString(16) : "",
					id: topColorRole ? topColorRole.id : ""
				};
			}

			const foundReplyMessage = msg.replyingTo ? fetchedMessages.find((fmsg) => fmsg.id === msg.replyingTo) : null;
			let replyData: MessageProps["replyMessage"] | null = null;

			if (foundReplyMessage) {
				const fetchedReplyAuthor = getUser(foundReplyMessage.authorId);
				const fetchedReplyMember = guildId ? getMember(guildId, foundReplyMessage.authorId) ?? null : null;

				let roleData: { color: string; id: string; } | null = null;

				if (fetchedReplyMember) {
					const roles = useRoleStore.getState().getRoles(guildId ?? "");
					const topColorRole = fetchedReplyMember.roles
						.map((roleId) => roles.find((role) => role.id === roleId))
						.filter((role) => role !== undefined && role.color !== 0)
						.sort((a, b) => a!.position - b!.position)
						.reverse()[0];

					roleData = {
						color: topColorRole ? topColorRole.color.toString(16) : "",
						id: topColorRole ? topColorRole.id : ""
					};
				}

				replyData = {
					message: foundReplyMessage,
					member: fetchedReplyMember,
					roleColor: roleData,
					user: fetchedReplyAuthor!
				};
			}

			finishedMsgs.push({
				inGuild: !!guildId || false,
				mentionsUser: msg.mentions.users.includes(currentUser.id),
				highlighted: false,
				message: {
					...msg,
					author: {
						user: fetchedAuthor!,
						member: fetchedMember ? {
							...fetchedMember,
							roles: fetchedMember.roles.map((roleId) => roles.find((role) => role.id === roleId)).filter((rol) => rol !== undefined)
						} : null,
						roleColor: roleData
					},
					invites: msg.invites.map((msg) => {
						const gotInvite = getInvite(msg);

						if (!gotInvite) return null;

						const guild = getGuild(gotInvite.guildId)!;

						return {
							...gotInvite,
							guild
						};
					})
				},
				replyMessage: replyData,
				editable: msg.authorId === currentUser.id,
				deleteable: msg.authorId === currentUser.id, // ? temp until I do the perms
				replyable: msg.state === MessageStates.Sent,
			});
		}

		setFetching(false);

		if (!fastDeepEqual(finishedMsgs, renderedMessages)) {
			setRenderedMessages(finishedMsgs);

			if (shouldScrollToBottom) {
				setTimeout(() => bottomRef.current?.scrollIntoView({
					behavior: "instant",
					block: "nearest",
					inline: "start"
				}), 50);
			}
		}

	}, [fetchedMessages, changeSignal]);

	const jumpTo = (messageId: string) => {
		const index = renderedMessages.findIndex((msg) => msg.message.id === messageId);

		if (index === -1) return;

		const msg = document.getElementById(`item-${index}`);

		if (!msg) return;

		updateChannel(channelId, {
			currentStates: [...getChannel(channelId).currentStates, "jumped"],
			jumpingStateId: messageId
		});

		setTimeout(() => {
			msg.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "start"
			});

			setTimeout(() => {
				updateChannel(channelId, {
					currentStates: getChannel(channelId).currentStates.filter((state) => state !== "jumped"),
					jumpingStateId: null
				});
			}, 1000);
		}, 50);
	};


	return (
		<MessageContainer
			placeholder={`Message #${channelName}`}
			isReadOnly={readOnly}
			sendMessage={(content) => {
				const perChannel = getChannel(channelId);

				createMessage(channelId, {
					content: content,
					replyingTo: perChannel.replyingStateId
				});

				updateChannel(channelId, {
					replyingStateId: null,
					currentStates: perChannel.currentStates.filter((state) => state !== "replying")
				});

				setTimeout(() => bottomRef.current?.scrollIntoView({
					behavior: "instant",
					block: "nearest",
					inline: "start"
				}), 50);
			}}
			channelId={channelId}
			guildId={guildId}
		>
			<div className="mt-auto overflow-y-auto mb-4" id="inf-scroller-msg-container" ref={scrollerRef}>
				<BiDirectionalInfiniteScroller
					data={renderedMessages}
					renderItem={(message) => (
						<ContextMenu>
							<ContextMenuTrigger>
								<Message
									{...message}
									key={message.message.id}
									jumpToMessage={jumpTo}
									highlighted={message.message.id === getChannel(channelId).jumpingStateId}
								/>
							</ContextMenuTrigger>
							<ContextMenuContent className="w-40">
								{message.replyable && (
									<ContextMenuItem onClick={() => {
										updateChannel(channelId, {
											currentStates: [...getChannel(channelId).currentStates, "replying"],
											replyingStateId: message.message.id
										});
									}}>
										Reply
										<Reply size={18} color="#acaebf" className="cursor-pointer ml-auto" />
									</ContextMenuItem>
								)}
								{message.editable && (
									<ContextMenuItem>
										Edit
										<Pen size={18} color="#acaebf" className={"cursor-pointer ml-auto"} />
									</ContextMenuItem>
								)}
								<ContextMenuItem>
									Pin Message
									<Pin size={18} color="#acaebf" className="cursor-pointer ml-auto" />
								</ContextMenuItem>
								<ContextMenuItem onClick={() => {
									navigator.clipboard.writeText(message.message.content);
								}}>
									Copy Text
									<Copy size={18} color="#acaebf" className="cursor-pointer ml-auto" />
								</ContextMenuItem>
								{message.deleteable && (
									<ContextMenuItem className="text-danger">
										Delete Message
										<Trash2 size={18} className={"text-danger cursor-pointer ml-auto"} />
									</ContextMenuItem>
								)}
								<Divider className="mt-1 mb-1" />
								<ContextMenuItem className="text-danger">Report Message</ContextMenuItem>
								<ContextMenuItem>Copy Message Link</ContextMenuItem>
								<ContextMenuItem onClick={() => {
									navigator.clipboard.writeText(message.message.id);
								}}>Copy Message ID</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>
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
						!false &&
						<div className="mt-8 mb-4 mr-16 ml-2 flex border-b-1 border-gray-800 select-none">
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
					hasMoreTop={false}
					classNames={{
						dataDiv: "overflow-x-hidden"
					}}
				/>
				{!initialFetch && skelliedMessages}
				<div ref={bottomRef} />
			</div>
		</MessageContainer>
	);
};

export default TextBasedChannel;
