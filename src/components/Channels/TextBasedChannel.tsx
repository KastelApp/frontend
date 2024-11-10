import MessageContainer from "@/components/MessageContainer/MessageContainer.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { useMemberStore } from "@/wrapper/Stores/Members.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import { useChannelStore, usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { MessageContext, MessageStates, MessageStore, type Message as MessageType, useMessageStore } from "@/wrapper/Stores/MessageStore.ts";
import SkellyMessage from "../Message/SkellyMessage.tsx";
import diff from "@/utils/diff.ts";
import { useInviteStore } from "@/wrapper/Stores/InviteStore.ts";
import { useHubStore } from "@/wrapper/Stores/HubStore.ts";
import arrayify from "@/utils/arrayify.ts";
import useScrollable, { ScrollStates } from "@/hooks/useScrollable.ts";
import Logger from "@/utils/Logger.ts";
import PermissionHandler from "@/wrapper/PermissionHandler.ts";
import Message, { MessageProps } from "@/components/Message/Message.tsx";
import ChannelIcon from "@/components/ChannelIcon.tsx";
import { channelTypes } from "@/utils/Constants.ts";
import { defer } from "@/utils/defer.ts";
import { animateScroll } from "react-scroll";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu.tsx";
import { Copy, Pen, Pin, Reply, Trash2 } from "lucide-react";
import { Divider } from "@nextui-org/react";
import { Routes } from "@/utils/Routes.ts";

const skelliedMessages = Array.from({ length: 30 }, (_, i) => <SkellyMessage key={i} />);

/**
 * This is for TextBased Channel's, i.e DM's, Hub Text Channels, etc.
 */
const TextBasedChannel = () => {
    const router = useRouter();
    const [readOnly, setReadOnly] = useState(true); // ? This is just so we know if the user can send messages or not (we prevent any changes / letting them type if so)
    const [, setCanViewMessageHistory] = useState(false); // ? This is so we know if the user can view message history
    const [fetchedInitial, setFetchedInitial] = useState(false);
    const [signal, setSignal] = useState(0); // ? every time we want a re-render, we increment this value
    const [hubId, , channelId] = arrayify(router.query?.slug);
    const ref = useRef<HTMLDivElement>(null);

    const channelName = useChannelStore((state) => state.getChannel(channelId)?.name ?? "Unknown Channel");
    const messages = useMessageStore((state) => state.getMessages(channelId).sort((a, b) => a.creationDate.getTime() - b.creationDate.getTime()));
    const channels = useChannelStore((state) => state.getChannels(hubId));
    const roles = useRoleStore((state) => state.getRoles(hubId));
    const getMember = useMemberStore((state) => state.getMember);
    const getCurrentUser = useUserStore((state) => state.getCurrentUser);
    const fetchMessages = useMessageStore((state) => state.fetchMessages);
    const getUser = useUserStore((state) => state.getUser);
    const getInvite = useInviteStore((state) => state.getInvite);
    const getHub = useHubStore((state) => state.getHub);
    const createMessage = useMessageStore((state) => state.createMessage);
    const getPerChannel = usePerChannelStore((state) => state.getChannel);
    const updatePerChannel = usePerChannelStore((state) => state.updateChannel);

    useEffect(() => {
        const memberSubscription = useMemberStore.subscribe(() => setSignal((prev) => prev + 1));
        const userSubscription = useUserStore.subscribe(() => setSignal((prev) => prev + 1));
        const roleSubscription = useRoleStore.subscribe(() => setSignal((prev) => prev + 1));
        const channelSubscription = useChannelStore.subscribe(() => setSignal((prev) => prev + 1));
        const hubSubscription = useHubStore.subscribe(() => setSignal((prev) => prev + 1));
        const inviteSubscription = useInviteStore.subscribe(() => setSignal((prev) => prev + 1));

        return () => {
            memberSubscription();
            roleSubscription();
            channelSubscription();
            userSubscription();
            inviteSubscription();
            hubSubscription();
        };
    }, []);

    const [fetching, setFetching] = useState(false);
    const [cooldown, setCooldown] = useState(false);

    const fetchBottomItems = useCallback(async (count: number, around?: string | null) => {
        const aroundIndex = messages.findIndex((msg) => msg.id === around);
        const cachedMessages = messages.slice(aroundIndex + 1, aroundIndex + 1 + count);

        if (cachedMessages.length === count) {
            return {
                items: cachedMessages,
                hasMore: messages.length > aroundIndex + 1 + count,
            };
        }

        const fetchedMessages = await fetchMessages(channelId, {
            limit: count - cachedMessages.length,
            after: around ?? undefined,
        });

        return {
            items: [...cachedMessages, ...fetchedMessages.messages],
            hasMore: fetchedMessages.success ? fetchedMessages.messages.length === count - cachedMessages.length : false,
        };
    }, [channelId, messages]);

    const fetchTopItems = useCallback(async (count: number, around?: string | null) => {
        const aroundIndex = messages.findIndex((msg) => msg.id === around);
        const cachedMessages = messages.slice(
            Math.max(0, aroundIndex - count),
            aroundIndex
        );

        if (cachedMessages.length === count) {
            return {
                items: cachedMessages,
                hasMore: messages.length > aroundIndex - count,
            };
        }

        const fetchedMessages = await fetchMessages(channelId, {
            limit: count - cachedMessages.length,
            before: around ?? undefined,
        });

        return {
            items: [...fetchedMessages.messages, ...cachedMessages],
            hasMore: fetchedMessages.success ? fetchedMessages.messages.length === count - cachedMessages.length : false,
        };
    }, [messages]);


    const {
        renderedItems,
        addSingleItem,
        removeItem,
        atBottom,
        updateItem,
        atTop,
        fetchBottom,
        fetchTop,
        hasMoreBottom,
        hasMoreTop,
        setScrollState,
        setHasMoreBottom,
        setHasMoreTop,
        setRenderedItems
    } = useScrollable<MessageType>({
        ref,
        fetchBottomItems,
        fetchTopItems,
        maxRenderedItems: 300,
        removeCount: 150,
        sortItems: (a, b) => a.creationDate.getTime() - b.creationDate.getTime(),
    });

    const messageSubscription = useCallback((state: MessageStore, prevState: MessageStore) => {
        const oldMessages = prevState.messages.filter((msg) => msg.channelId === channelId);
        const newMessages = state.messages.filter((msg) => msg.channelId === channelId);

        const diffed = diff(oldMessages, newMessages);

        for (const removed of diffed.removed) {
            removeItem(removed.id);
        }

        for (const added of diffed.added) {
            if (added.context === MessageContext.API) continue;

            addSingleItem(added);

            if (atBottom()) {
                setTimeout(() => {
                    animateScroll.scrollToBottom({
                        container: ref.current,
                        duration: 0,
                    });
                }, 50)
            }
        }

        for (const changed of diffed.changed) {
            updateItem(changed);
        }
    }, [channelId, atBottom]);

    useEffect(() => {
        const msgSubscription = useMessageStore.subscribe(messageSubscription);

        return () => {
            msgSubscription();
        };
    }, [messageSubscription]);

    const slowedTopFetch = useCallback(async (count: number, noAround = false, force = false) => {
        if (!force && (!hasMoreTop || !atTop(0))) {
            return;
        }

        if (fetching || cooldown) {
            setScrollState({ type: ScrollStates.ScrollTop, y: 100 });

            return;
        }

        setFetching(true);
        setCooldown(true);

        await fetchTop(count, noAround, force);

        setFetching(false);

        setTimeout(() => setCooldown(false), 500);
    }, [fetchTop, fetching, cooldown, atTop]);

    const slowedBottomFetch = useCallback(async (count: number, noAround = false, force = false) => {
        if (!hasMoreBottom || !atBottom(0)) return;

        if (fetching || cooldown) {
            setScrollState({ type: ScrollStates.ScrollTop, y: ref.current!.scrollTop - 100 });

            return;
        }

        setFetching(true);
        setCooldown(true);

        await fetchBottom(count, noAround, force);

        setFetching(false);

        setTimeout(() => setCooldown(false), 500);
    }, [fetchBottom, fetching, cooldown, atBottom]);

    useEffect(() => {
        const clientUser = getCurrentUser();

        if (!clientUser) {
            Logger.warn("No client user found", "TextBasedChannel");

            return;
        }

        const hubMember = getMember(hubId, clientUser.id);

        if (!hubMember) {
            Logger.warn("No hub member found", "TextBasedChannel");

            return;
        }

        const permissionHandler = new PermissionHandler(
            clientUser.id,
            hubMember.owner,
            hubMember.roles.map((roleId) => roles.find((role) => role.id === roleId)!).filter(Boolean),
            channels,
        );

        if (!permissionHandler.hasChannelPermission(channelId, ["ViewChannels"])) {
            router.push(Routes.hubChannels(hubId));

            return;
        }


        setReadOnly(!permissionHandler.hasChannelPermission(channelId, ["SendMessages"]));

        const canViewMessageHistory = permissionHandler.hasChannelPermission(channelId, ["ViewMessageHistory"]);

        setCanViewMessageHistory(canViewMessageHistory);

        const perChannelInfo = getPerChannel(channelId);

        setRenderedItems([]);
        setFetchedInitial(perChannelInfo.fetchingInfo.fetchedInitial);

        setHasMoreBottom(perChannelInfo.fetchingInfo.hasMoreAfter);
        setHasMoreTop(perChannelInfo.fetchingInfo.hasMoreBefore);

        if (perChannelInfo.fetchingInfo.fetchedInitial) {
            setRenderedItems(messages.slice(messages.length - 50, messages.length));

            return;
        }

        animateScroll.scrollToBottom({
            container: ref.current,
            duration: 0,
        });

        defer(() => {
            slowedTopFetch(50, true, true).then(() => {
                setFetchedInitial(true);

                updatePerChannel(channelId, {
                    fetchingInfo: {
                        fetchedInitial: true,
                    },
                });
            });

        });

        return;
    }, [channelId]);

    useEffect(() => {
        updatePerChannel(channelId, {
            fetchingInfo: {
                hasMoreAfter: hasMoreBottom,
                hasMoreBefore: hasMoreTop,
            }
        });
    }, [hasMoreBottom, hasMoreTop]);

    const createRenderableMessages = useCallback((renderMessages: MessageType[]) => {
        const finishedMsgs: Omit<MessageProps, "className" | "disableButtons" | "id">[] = [];
        const currentUser = getCurrentUser()!;

        for (const msg of renderMessages.sort((a, b) => a.creationDate.getTime() - b.creationDate.getTime())) {
            const fetchedAuthor = getUser(msg.authorId);
            const fetchedMember = hubId ? getMember(hubId, msg.authorId) ?? null : null;

            let roleData: { color: string; id: string; } | null = null;

            if (fetchedMember) {
                const topColorRole = fetchedMember.roles
                    .map((roleId) => roles.find((role) => role.id === roleId))
                    .filter((role) => role !== undefined && role.color !== 0)
                    .sort((a, b) => a!.position - b!.position)
                    .reverse()[0];

                roleData = {
                    color: topColorRole ? topColorRole.color.toString(16) : "",
                    id: topColorRole ? topColorRole.id : "",
                };
            }

            const foundReplyMessage = msg.replyingTo ? messages.find((fmsg) => fmsg.id === msg.replyingTo) : null;
            let replyData: MessageProps["replyMessage"] | null = null;

            if (foundReplyMessage) {
                const fetchedReplyAuthor = getUser(foundReplyMessage.authorId);
                const fetchedReplyMember = hubId ? getMember(hubId, foundReplyMessage.authorId) ?? null : null;

                let roleData: { color: string; id: string; } | null = null;

                if (fetchedReplyMember) {
                    const roles = useRoleStore.getState().getRoles(hubId ?? "");
                    const topColorRole = fetchedReplyMember.roles
                        .map((roleId) => roles.find((role) => role.id === roleId))
                        .filter((role) => role !== undefined && role.color !== 0)
                        .sort((a, b) => a!.position - b!.position)
                        .reverse()[0];

                    roleData = {
                        color: topColorRole ? topColorRole.color.toString(16) : "",
                        id: topColorRole ? topColorRole.id : "",
                    };
                }

                replyData = {
                    message: foundReplyMessage,
                    member: fetchedReplyMember ? {
                        ...fetchedReplyMember,
                        roles: fetchedReplyMember.roles
                            .map((roleId) => roles.find((role) => role.id === roleId))
                            .filter((rol) => rol !== undefined),
                    } : null,
                    roleColor: roleData,
                    user: fetchedReplyAuthor!,
                };
            }

            // ? here's the rules for message grouping
            // ? 1) If its replying to a message, it should not be grouped
            // ? 2) The message before it must not be grouped and it must be from the same author
            // ? 3) If the prev message is the same as the author it must been within 10 minutes of the current message
            // ? (i.e if you send 3 messages those should be grouped) but then if you wait 15 minutes and send another message it should not be grouped
            // todo: maybe in the future let users customize this?

            const prevMessage = finishedMsgs[finishedMsgs.length - 1];

            let shouldGroup = false;

            if (prevMessage) {
                const timeDiff = msg.creationDate.getTime() - prevMessage.message.creationDate.getTime();

                shouldGroup = prevMessage.message.author.user.id === msg.authorId && timeDiff <= 10 * 60 * 1000; // ? 10 minutes
            }

            if (msg.replyingTo) shouldGroup = false;

            finishedMsgs.push({
                inHub: !!hubId || false,
                mentionsUser: msg.mentions.users.includes(currentUser.id),
                isHighlighted: false,
                message: {
                    ...msg,
                    author: {
                        user: fetchedAuthor!,
                        member: fetchedMember
                            ? {
                                ...fetchedMember,
                                roles: fetchedMember.roles
                                    .map((roleId) => roles.find((role) => role.id === roleId))
                                    .filter((rol) => rol !== undefined),
                            }
                            : null,
                        roleColor: roleData,
                    },
                    invites: msg.invites.map((msg) => {
                        const gotInvite = getInvite(msg);

                        if (!gotInvite) return null;

                        const hub = gotInvite.valid ? getHub(gotInvite.hubId!)! : null;

                        return {
                            ...gotInvite,
                            hub,
                        };
                    }),
                },
                replyMessage: replyData,
                isEditable: msg.authorId === currentUser.id,
                isDeleteable: msg.authorId === currentUser.id, // ? temp until I do the perms
                isReplyable: msg.state === MessageStates.Sent,
                isGrouped: shouldGroup,
                isParent: !shouldGroup,
            });
        }

        return finishedMsgs;
    }, [hubId, messages, roles]);

    const sendMessage = useCallback((content: string) => {
        if (!content) return;

        const perChannel = getPerChannel(channelId);

        createMessage(channelId, {
            content: content,
            replyingTo: perChannel.replyingStateId,
        });

        updatePerChannel(channelId, {
            replyingStateId: null,
            currentStates: perChannel.currentStates.filter((s) => s !== "replying"),
        });


        defer(() => {
            animateScroll.scrollToBottom({
                container: ref.current,
                duration: 0,
            });
        });
    }, [channelId, ref]);


    const onScroll = useCallback(async () => {
        if (atTop(0)) {
            await slowedTopFetch(50);
        }

        if (atBottom(0)) {
            slowedBottomFetch(50);
        }

    }, [atTop, atBottom, slowedTopFetch, slowedBottomFetch]);

    useEffect(() => {
        if (!ref.current) return;

        ref.current.addEventListener("scroll", onScroll);

        return () => {
            if (ref.current) ref.current.removeEventListener("scroll", onScroll);
        };
    }, [fetchTop, fetching, cooldown, fetchBottom]);

    const [renderedMessages, setRenderedMessages] = useState<Omit<MessageProps, "className" | "disableButtons" | "id">[]>([]);

    useEffect(() => {
        const filteredItems = renderedItems.filter((item, index, self) => self.findIndex((t) => t.id === item.id) === index);
        const renderable = createRenderableMessages(filteredItems);

        setRenderedMessages(renderable);
    }, [renderedItems, signal]);

    return (
        <MessageContainer
            placeholder={`Message #${channelName}`}
            isReadOnly={readOnly}
            sendMessage={sendMessage}
            channelId={channelId}
            hubId={hubId}
        >
            <div className="mb-4 mt-auto overflow-y-auto overflow-x-hidden" ref={ref}>
                {!hasMoreTop && (
                    <div className="mb-4 ml-2 mt-8 flex select-none border-b-1 border-gray-800" id="toIgnore-channelHeader">
                        <div className="mb-2 flex items-center">
                            <ChannelIcon
                                type={channelTypes.HubText}
                                className="flex items-center rounded-full bg-slate-700 p-2 mm-hw-20"
                            />
                            <div className="ml-4">
                                <h1 className="text-xl font-bold">Welcome to the #{channelName} channel</h1>
                                <h2 className="text-gray-400">This is the beginning of the channel</h2>
                            </div>
                        </div>
                    </div>
                )}

                {/* {renderedItems.length === 0 && skelliedMessages} */}
                {/* {renderedMessages.length === 0 } */}
                {!fetchedInitial && skelliedMessages}

                {renderedMessages.map((msg) => (
                    // <Message key={msg.message.id} {...msg} id={msg.message.id} />
                    <ContextMenu key={msg.message.id}>
                        <ContextMenuTrigger>
                            <Message
                                {...msg}
                                key={msg.message.id}
                                // jumpToMessage={jumpTo}
                                // isHighlighted={msg.message.id === getChannel(channelId).jumpingStateId}
                            />
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-40">
                            {msg.isReplyable && (
                                <ContextMenuItem
                                onClick={() => {
                                        // updateChannel(channelId, {
                                        //     currentStates: [...getChannel(channelId).currentStates, "replying"],
                                        //     replyingStateId: message.message.id,
                                        // });
                                    }}
                                >
                                    Reply
                                    <Reply size={18} color="#acaebf" className="ml-auto cursor-pointer" />
                                </ContextMenuItem>
                            )}
                            {msg.isEditable && (
                                <ContextMenuItem>
                                    Edit
                                    <Pen size={18} color="#acaebf" className={"ml-auto cursor-pointer"} />
                                </ContextMenuItem>
                            )}
                            <ContextMenuItem>
                                Pin Message
                                <Pin size={18} color="#acaebf" className="ml-auto cursor-pointer" />
                            </ContextMenuItem>
                            <ContextMenuItem
                                onClick={() => {
                                    navigator.clipboard.writeText(msg.message.content);
                                }}
                            >
                                Copy Text
                                <Copy size={18} color="#acaebf" className="ml-auto cursor-pointer" />
                            </ContextMenuItem>
                            {msg.isDeleteable && (
                                <ContextMenuItem className="text-danger">
                                    Delete Message
                                    <Trash2 size={18} className={"ml-auto cursor-pointer text-danger"} />
                                </ContextMenuItem>
                            )}
                            <Divider className="mb-1 mt-1" />
                            <ContextMenuItem className="text-danger">Report Message</ContextMenuItem>
                            <ContextMenuItem>Copy Message Link</ContextMenuItem>
                            <ContextMenuItem
                                onClick={() => {
                                    navigator.clipboard.writeText(msg.message.id);
                                }}
                            >
                                Copy Message ID
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                ))}
            </div>
        </MessageContainer>
    );
};

export default TextBasedChannel;
