import { X, Pen, CirclePlus, SendHorizontal, SmilePlus } from "lucide-react";
import SlateEditor from "./SlateEditor.tsx";
import { Divider, Image } from "@nextui-org/react";
import TypingDots from "./TypingDats.tsx";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { Member, useMemberStore } from "@/wrapper/Stores/Members.ts";
import { useMessageStore } from "@/wrapper/Stores/MessageStore.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import fastDeepEqual from "fast-deep-equal";
import { useSettingsStore } from "@/wrapper/Stores.ts";
import { NavBarLocation } from "@/types/payloads/ready.ts";
import Tooltip from "../Tooltip.tsx";
import useTypingIndicator from "@/hooks/useTypingIndicator.ts";

const FileComponent = ({ fileName, imageUrl }: { fileName?: string; imageUrl?: string; }) => {
	return (
		<div className="w-44 h-44 bg-accent mt-2 rounded-md flex flex-col justify-center relative">
			<div className="relative w-[90%] ml-2.5 max-h-[75%] flex flex-col justify-center items-center bg-gray-500 mb-4">
				<div className="w-full h-full flex justify-center items-center relative overflow-hidden cursor-pointer">
					<Image src={imageUrl} alt={fileName} className="object-cover w-full h-full rounded-md" />
				</div>
			</div>
			<div className="absolute top-0 right-0 bg-gray-800 p-1 z-10 rounded-md">
				<div className="flex gap-2">
					<Tooltip content="Edit File Details">
						<Pen size={18} color="#acaebf" className="cursor-pointer" />
					</Tooltip>
					<Tooltip content="Remove File">
						<X size={18} className="text-danger cursor-pointer" />
					</Tooltip>
				</div>
			</div>
			<div className="absolute bottom-0 left-0 w-full mb-1">
				<span className="text-sm text-white ml-2">{fileName}</span>
			</div>
		</div>
	);
};

const MessageContainer = ({ placeholder, children, isReadOnly, sendMessage, channelId, guildId }: {
	placeholder: string;
	children?: React.ReactNode;
	isReadOnly?: boolean;
	sendMessage: (content: string) => void;
	channelId: string;
	guildId: string | null;
}) => {
	const { navBarLocation } = useSettingsStore();

	const [files, setFiles] = useState<{ name: string; url: string; }[]>([]);
	const [replying, setReplying] = useState<boolean>(false);

	const { getChannel, updateChannel } = usePerChannelStore();
	const { getMessage } = useMessageStore();

	const channelIdRef = useRef<string>(channelId);

	const [replyingAuthor, setReplyingAuthor] = useState<{
		user: User | null;
		member: Member | null;
		roleColor: { color: string | null; id: string; } | null;
	}>({
		member: null,
		user: null,
		roleColor: null
	});

	const [startedTypingAt, setStartedTypingAt] = useState(0);
    const [lastTypedAt, setLastTypedAt] = useState(0);
    const [lastSentTypingAt, setLastSentTypingAt] = useState(0);
	const [content, setContent] = useState("");

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
		const gotChannel = getChannel(channelId);

		let shouldUpdatingLastTyping = false;
		let shouldUpdateStartedTyping = false;
		let shouldUpdateLastSentTyping = false;

		if (gotChannel.lastTyped !== lastTypedAt) {
			shouldUpdatingLastTyping = true;
		}

		if (gotChannel.lastTypingSent !== lastSentTypingAt) {
			shouldUpdateLastSentTyping = true;
		}

		if (gotChannel.typingStarted !== startedTypingAt) {
			shouldUpdateStartedTyping = true;
		}

		updateChannel(channelId, {
			...(shouldUpdatingLastTyping ? { lastTyped: lastTypedAt } : {}),
			...(shouldUpdateLastSentTyping ? { lastTypingSent: lastSentTypingAt } : {}),
			...(shouldUpdateStartedTyping ? { typingStarted: startedTypingAt } : {})
		})
	}, [startedTypingAt, lastTypedAt, lastSentTypingAt]);

	useEffect(() => {
		console.log("isTyping", isTyping);
		console.log("shouldSendTypingEvent", shouldSendTypingEvent);
	}, [isTyping, shouldSendTypingEvent]);

	const [signal, setSignal] = useState<number>(0);
	// ? the users usernames / nickname
	const [typingUsers, setTypingUsers] = useState<string[]>(["DarkerInk"]);

	useEffect(() => {
		const subscribed = usePerChannelStore.subscribe((state, prevState) => {
			const oldChannel = prevState.channels[channelIdRef.current];
			const newChannel = state.channels[channelIdRef.current];

			if (!fastDeepEqual(oldChannel, newChannel)) {
				if (oldChannel && newChannel && (oldChannel.previousMessageContent !== newChannel.previousMessageContent
					|| oldChannel.typingStarted !== newChannel.typingStarted
					|| oldChannel.lastTypingSent !== newChannel.lastTypingSent
					|| oldChannel.lastTyped !== newChannel.lastTyped)
				) return;

				setSignal((old) => old + 1);
			}
		});

		return () => subscribed();
	}, []);

	useEffect(() => {
		channelIdRef.current = channelId;

		const channel = getChannel(channelId);

		setTypingUsers(channel.typingUserIds);
		setLastSentTypingAt(channel.lastTypingSent);
		setLastTypedAt(channel.lastTyped);
		setStartedTypingAt(channel.typingStarted);
		if (channel.previousMessageContent !== content) setContent(channel.previousMessageContent ?? "");

		console.log("updating")

		if (channel.typingUserIds.length > 0) {
			const typingUsers = channel.typingUserIds.map((userId) => {
				const user = useUserStore.getState().getUser(userId);
				const member = guildId ? useMemberStore.getState().getMember(guildId, userId) : null;

				return member ? member.nickname ?? user?.globalNickname ?? user?.username : user?.globalNickname ?? user?.username;
			}).filter((username) => typeof username === "string");

			setTypingUsers(typingUsers);
		}

		if (!channel.currentStates.includes("replying")) {
			setReplying(false);

			return;
		}

		setReplying(true);

		const foundReply = getMessage(channel.replyingStateId ?? "");

		if (foundReply) {
			const fetchedAuthor = useUserStore.getState().getUser(foundReply.authorId);
			const fetchedMember = guildId ? useMemberStore.getState().getMember(guildId, foundReply.authorId) ?? null : null;

			let roleData: { color: string; id: string; } | null = null;

			if (fetchedMember) {
				const roles = useRoleStore.getState().getRoles(guildId ?? "");
				const topColorRole = fetchedMember.roles
					.map((roleId) => roles.find((role) => role.id === roleId))
					.filter((role) => role !== undefined)
					.sort((a, b) => a!.position - b!.position)
					.reverse()[0];

				roleData = {
					color: topColorRole ? topColorRole.color.toString(16) : "",
					id: topColorRole ? topColorRole.id : ""
				};
			}

			setReplyingAuthor({
				user: fetchedAuthor,
				member: fetchedMember,
				roleColor: roleData
			});
		}
	}, [channelId, guildId, signal]);

	useEffect(() => {
		updateChannel(channelId, {
			previousMessageContent: content
		});
	}, [content])

	return (
		<div className="flex flex-col h-screen overflow-x-hidden" style={{
			maxHeight: navBarLocation === NavBarLocation.Bottom ? "calc(100vh - 4rem)" : ""
		}}>
			{children}
			<div className="mb-12 w-[98%] ml-2">
				{replying && (
					<div className="ml-1 w-full bg-accent rounded-md rounded-b-none flex select-none">
						<div className="p-2">
							Replying to <span className="font-semibold text-white" style={{
								color: guildId ?
									replyingAuthor.member ?
										replyingAuthor.roleColor?.color ? `#${replyingAuthor.roleColor.color}` : "#CFDBFF"
										: "#ACAEBF"
									: "#CFDBFF"
							}}>{replyingAuthor.member ? replyingAuthor.member.nickname ?? replyingAuthor.user?.globalNickname ?? replyingAuthor.user?.username : replyingAuthor.user?.globalNickname ?? replyingAuthor.user?.username}</span>
						</div>
						<div className="flex items-center gap-2 ml-auto mr-2">
							<Tooltip content="Close Reply">
								<X size={22} color="#acaebf" className="cursor-pointer" onClick={() => {
									setReplying(false);
									setReplyingAuthor({
										member: null,
										user: null,
										roleColor: null
									});

									const channel = getChannel(channelIdRef.current);

									usePerChannelStore.getState().updateChannel(channelIdRef.current, {
										currentStates: channel.currentStates.filter((state) => state !== "replying") ?? [],
										editingStateId: null,
									});
								}} />
							</Tooltip>
						</div>
					</div>
				)}
				<div
					className={twMerge(
						"w-full ml-1 py-1 px-4 bg-gray-800 rounded-lg max-h-96 overflow-y-auto overflow-x-hidden",
						replying ? "rounded-t-none" : "",
					)}
				>
					<div className="mb-3 mt-2">
						{files.length > 0 && (
							<div className="flex flex-wrap justify-start mb-4 mt-4 gap-2">
								{files.map((file, index) => (
									<FileComponent key={index} fileName={file.name} imageUrl={file.url} />
								))}
								<Divider className="mt-2" />
							</div>
						)}
						<div className={twMerge("flex", isReadOnly ? "opacity-45 cursor-not-allowed" : "")}>
							<div className="mr-4">
								{/*// todo: File select */}
								<CirclePlus
									size={22}
									color="#acaebf"
									className={twMerge(isReadOnly ? "" : "cursor-pointer")}
									onClick={() => {
										if (isReadOnly) return;

										setFiles((old) => [
											...old,
											{
												name: "test.png",
												url: "https://development.kastelapp.com/icon-1.png",
											},
										]);
									}}
								/>
							</div>
							<SlateEditor
								sendMessage={(msg) => {
									sendMessage(msg);

									setContent("");
								}}
								placeholder={placeholder}
								isReadOnly={isReadOnly}
								initialText={content}
								readOnlyMessage="You do not have permission to send messages in this channel"
								onType={(text) => {
									if (isReadOnly) return;

									setContent(text);

									sendUserIsTyping();
								}}
							/>
							<div className="flex ml-4 gap-2">
								<SmilePlus size={22} color="#acaebf" className={twMerge(isReadOnly ? "" : "cursor-pointer")} />
								<SendHorizontal size={22} color="#8c52ff" className={twMerge(isReadOnly ? "" : "cursor-pointer")} />
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-1 mt-1 ml-2 min-h-4 max-h-4">
					{typingUsers.length > 0 && (
						<>
							<TypingDots />
							{/* <span className="text-xs font-semibold text-gray-300">Testing is typing</span> */}
							{/*//? we show "is typing" when one person is typing, and then "User and User are typing" when its two */}
							{/*//? else we just show "User, User, User are typing" */}
							<span className="text-xs font-semibold text-gray-300">
								{typingUsers.length === 1 ? `${typingUsers[0]} is typing` : typingUsers.length === 2 ? `${typingUsers[0]} and ${typingUsers[1]} are typing` : `${typingUsers.slice(0, 2).join(", ")} and ${typingUsers.length - 2} others are typing`}
							</span>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default MessageContainer;
