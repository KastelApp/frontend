import { X, Pen, CirclePlus, SendHorizontal, SmilePlus } from "lucide-react";
import SlateEditor from "./SlateEditor.tsx";
import { Avatar, Divider, Image } from "@nextui-org/react";
import TypingDots from "./TypingDats.tsx";
import { useEffect, useRef, useState } from "react";
import { useContentStore, usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { Member, useMemberStore } from "@/wrapper/Stores/Members.ts";
import { useMessageStore } from "@/wrapper/Stores/MessageStore.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import { useAPIStore, useGuildSettingsStore, useSettingsStore, useTranslationStore } from "@/wrapper/Stores.ts";
import { NavBarLocation } from "@/types/payloads/ready.ts";
import Tooltip from "../Tooltip.tsx";
import useTypingIndicator from "@/hooks/useTypingIndicator.ts";
import hexOpacity from "@/utils/hexOpacity.ts";
import cn from "@/utils/cn.ts";

const FileComponent = ({ fileName, imageUrl }: { fileName?: string; imageUrl?: string }) => {
	return (
		<div className="relative mt-2 flex h-44 w-44 flex-col justify-center rounded-md bg-lightAccent dark:bg-darkAccent">
			<div className="relative mb-4 ml-2.5 flex max-h-[75%] w-[90%] flex-col items-center justify-center bg-gray-500">
				<div className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden">
					<Image src={imageUrl} alt={fileName} className="h-full w-full rounded-md object-cover" />
				</div>
			</div>
			<div className="absolute right-0 top-0 z-10 rounded-md bg-gray-800 p-1">
				<div className="flex gap-2">
					<Tooltip content="Edit File Details">
						<Pen size={18} color="#acaebf" className="cursor-pointer" />
					</Tooltip>
					<Tooltip content="Remove File">
						<X size={18} className="cursor-pointer text-danger" />
					</Tooltip>
				</div>
			</div>
			<div className="absolute bottom-0 left-0 mb-1 w-full">
				<span className="ml-2 text-sm text-white">{fileName}</span>
			</div>
		</div>
	);
};

const MessageContainer = ({
	placeholder,
	children,
	isReadOnly,
	sendMessage,
	channelId,
	guildId,
}: {
	placeholder: string;
	children?: React.ReactNode;
	isReadOnly?: boolean;
	sendMessage: (content: string) => void;
	channelId: string;
	guildId: string | null;
}) => {
	const { t } = useTranslationStore();
	const { navBarLocation } = useSettingsStore();
	const { guildSettings } = useGuildSettingsStore();

	const membersBarOpen = guildId ? !guildSettings[guildId]?.memberBarHidden : false;

	const [files] = useState<{ name: string; url: string }[]>([]);
	const [state, setState] = useState<("replying" | "mentioning")[]>([]);

	const { getChannel, updateChannel } = usePerChannelStore();
	const { getMessage } = useMessageStore();

	const channelIdRef = useRef<string>(channelId);

	const [replyingAuthor, setReplyingAuthor] = useState<{
		user: User | null;
		member: Member | null;
		roleColor: { color: string | null; id: string } | null;
	}>({
		member: null,
		user: null,
		roleColor: null,
	});

	const [startedTypingAt, setStartedTypingAt] = useState(0);
	const [lastTypedAt, setLastTypedAt] = useState(0);
	const [lastSentTypingAt, setLastSentTypingAt] = useState(0);
	const [content, setContent] = useState("");

	const { isTyping, sendUserIsTyping, sentTypingEvent, shouldSendTypingEvent } = useTypingIndicator({
		lastSentTypingAt,
		lastTypedAt,
		setLastSentTypingAt,
		setLastTypedAt,
		setStartedTypingAt,
		startedTypingAt,
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
			...(shouldUpdateStartedTyping ? { typingStarted: startedTypingAt } : {}),
		});
	}, [startedTypingAt, lastTypedAt, lastSentTypingAt]);

	const { api } = useAPIStore();

	useEffect(() => {
		const sendType = async (channelId: string) => {
			await api.post({
				url: `/channels/${channelId}/typing`,
			});
		};

		if (shouldSendTypingEvent) {
			sendType(channelId).then(() => sentTypingEvent());
		}
	}, [isTyping, shouldSendTypingEvent]);

	const [signal, setSignal] = useState<number>(0);
	// ? the users usernames / nickname
	const [typingUsers, setTypingUsers] = useState<string[]>([]);

	useEffect(() => {
		const subscribed = usePerChannelStore.subscribe(() => setSignal((prev) => prev + 1));

		return () => subscribed();
	}, []);

	const { getContent, setContent: setMsgContent } = useContentStore();

	useEffect(() => {
		channelIdRef.current = channelId;

		const channel = getChannel(channelId);

		setContent(getContent(channelId) ?? "");
		setLastSentTypingAt(channel.lastTypingSent);
		setLastTypedAt(channel.lastTyped);
		setStartedTypingAt(channel.typingStarted);

		const filteredTypingUsers = channel.typingUsers.filter((user) => user.started > Date.now() - 7000);

		if (filteredTypingUsers.length !== channel.typingUsers.length) {
			updateChannel(channelId, {
				typingUsers: filteredTypingUsers,
			});
		}

		// ? we want to ignore ourselves
		const typingUsers = filteredTypingUsers
			.filter((typing) => typing.id !== useUserStore.getState().getCurrentUser()?.id)
			.map((typing) => {
				const user = useUserStore.getState().getUser(typing.id);
				const member = guildId ? useMemberStore.getState().getMember(guildId, typing.id) : null;

				return member
					? member.nickname ?? user?.globalNickname ?? user?.username
					: user?.globalNickname ?? user?.username;
			})
			.filter((username) => typeof username === "string");

		setTypingUsers(typingUsers);

		if (!channel.currentStates.includes("replying")) {
			setState((prev) => prev.filter((v) => v !== "replying"));

			return;
		}

		setState((prev) => [...prev.filter((v) => v !== "replying"), "replying"]);

		const foundReply = getMessage(channel.replyingStateId ?? "");

		if (foundReply) {
			const fetchedAuthor = useUserStore.getState().getUser(foundReply.authorId);
			const fetchedMember = guildId ? useMemberStore.getState().getMember(guildId, foundReply.authorId) ?? null : null;

			let roleData: { color: string; id: string } | null = null;

			if (fetchedMember) {
				const roles = useRoleStore.getState().getRoles(guildId ?? "");
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

			setReplyingAuthor({
				user: fetchedAuthor,
				member: fetchedMember,
				roleColor: roleData,
			});
		}
	}, [channelId, guildId, signal]);

	const [mentionTypes] = useState<{ type: string; name: string; color: number; id: string; avatar?: string }[]>([
		// 	{
		// 	type: "role",
		// 	name: "test",
		// 	color: 16753920,
		// 	id: "123"
		// }, {
		// 	type: "user",
		// 	name: "DarkerInk",
		// 	color: 16753920,
		// 	id: "456",
		// 	avatar: "/icon-1.png",
		// }
	]);

	return (
		<div
			className="flex h-screen flex-col overflow-x-hidden"
			style={{
				maxHeight: navBarLocation === NavBarLocation.Bottom ? "calc(100vh - 8rem)" : "calc(100vh - 4rem)",
			}}
		>
			{children}
			<div
				className={cn(
					"mb-0 ml-2 w-full",
					// membersBarOpen ? "max-w-[calc(100vw-28rem)]" : "max-w-[calc(100vw-19rem)]"
					membersBarOpen
						? navBarLocation === NavBarLocation.Bottom
							? "max-w-[calc(100vw-28rem)]"
							: "max-w-[calc(100vw-32rem)]"
						: navBarLocation === NavBarLocation.Bottom
							? "max-w-[calc(100vw-15rem)]"
							: "max-w-[calc(100vw-19rem)]",
				)}
			>
				{mentionTypes.length > 0 && (
					<div className="ml-1 flex w-full cursor-pointer select-none flex-col gap-1 rounded-md rounded-b-none bg-lightAccent p-2 dark:bg-darkAccent">
						{mentionTypes.map((item) => {
							const hex = `#${item.color?.toString(16)}`;

							return (
								<div
									key={item.id}
									style={{
										color: item.color ? hex : "",
									}}
									className="flex w-full items-center transition-all duration-150 ease-in hover:bg-darkBackground active:scale-[99%]"
								>
									{item.type === "role" ? "@" : <Avatar src={item.avatar} className="mr-1 h-5 w-5" />}
									<span>{item.name}</span>
									<span
										className="ml-auto mr-2 text-sm"
										style={{
											color: item.color ? hexOpacity(hex, 0.75) : hexOpacity("#CFDBFF", 0.75),
										}}
									>
										Mention everyone with this role
									</span>
								</div>
							);
						})}
					</div>
				)}
				{state.includes("replying") && (
					<div className="ml-1 flex w-full select-none rounded-md rounded-b-none bg-lightAccent dark:bg-darkAccent">
						<div className="p-2">
							{t("messageContainer.replying")}{" "}
							<span
								className="font-semibold text-white"
								style={{
									color: guildId
										? replyingAuthor.member
											? replyingAuthor.roleColor?.color
												? `#${replyingAuthor.roleColor.color}`
												: "#CFDBFF"
											: "#ACAEBF"
										: "#CFDBFF",
								}}
							>
								{replyingAuthor.member
									? replyingAuthor.member.nickname ??
										replyingAuthor.user?.globalNickname ??
										replyingAuthor.user?.username
									: replyingAuthor.user?.globalNickname ?? replyingAuthor.user?.username}
							</span>
						</div>
						<div className="ml-auto mr-2 flex items-center gap-2">
							<Tooltip content="Close Reply">
								<X
									size={22}
									color="#acaebf"
									className="cursor-pointer"
									onClick={() => {
										setState((prev) => prev.filter((v) => v !== "replying"));

										setReplyingAuthor({
											member: null,
											user: null,
											roleColor: null,
										});

										const channel = getChannel(channelIdRef.current);

										usePerChannelStore.getState().updateChannel(channelIdRef.current, {
											currentStates: channel.currentStates.filter((state) => state !== "replying") ?? [],
											editingStateId: null,
										});
									}}
								/>
							</Tooltip>
						</div>
					</div>
				)}

				<div
					className={cn(
						"ml-1 max-h-96 w-full overflow-y-auto overflow-x-hidden rounded-lg bg-gray-800 px-4 py-1",
						state ? "rounded-t-none" : "",
					)}
				>
					<div className="mb-3 mt-2">
						{files.length > 0 && (
							<div className="mb-4 mt-4 flex flex-wrap justify-start gap-2">
								{files.map((file, index) => (
									<FileComponent key={index} fileName={file.name} imageUrl={file.url} />
								))}
								<Divider className="mt-2" />
							</div>
						)}
						<div className={cn("flex", isReadOnly ? "cursor-not-allowed opacity-45" : "")}>
							<div className="relative mr-4 cursor-pointer">
								{/*// todo: File select */}
								<CirclePlus
									size={22}
									color="#acaebf"
									className={cn(isReadOnly ? "" : "cursor-pointer")}
									onClick={() => {
										if (isReadOnly) return;

										// setFiles((old) => [
										// 	...old,
										// 	{
										// 		name: "test.png",
										// 		url: "/icon-1.png",
										// 	},
										// ]);
									}}
								/>
								{!isReadOnly && (
									<input
										type="file"
										title="Files"
										className="absolute inset-0 h-full w-full !cursor-pointer opacity-0"
										multiple
										onChange={(e) => {
											for (const file of e.target.files ?? []) {
												console.log(file.name, file.size);
											}
										}}
									/>
								)}
							</div>
							<SlateEditor
								sendMessage={(msg) => {
									sendMessage(msg);

									setContent("");
									setMsgContent(channelId, "");
								}}
								placeholder={placeholder}
								isReadOnly={isReadOnly}
								initialText={content}
								readOnlyMessage={t("messageContainer.readOnly")}
								onType={(text) => {
									if (isReadOnly) return;

									setContent(text);
									setMsgContent(channelId, text);

									sendUserIsTyping();
								}}
							/>
							<div className="ml-4 flex gap-2">
								<SmilePlus size={22} color="#acaebf" className={cn(isReadOnly ? "" : "cursor-pointer")} />
								<SendHorizontal
									size={22}
									color="#008da5"
									className={cn("opacity-75", isReadOnly ? "" : "cursor-pointer")}
									onClick={async () => {
										if (isReadOnly) return;

										sendMessage(content);
										setContent("");
										setMsgContent(channelId, "");
									}}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="ml-2 mt-1 flex max-h-4 min-h-4 items-center gap-1">
					{typingUsers.length > 0 && (
						<>
							<TypingDots />
							{/*//? we show "is typing" when one person is typing, and then "User and User are typing" when its two */}
							{/*//? else we just show "User, User, User are typing" */}
							<span className="text-xs font-semibold text-gray-300">
								{typingUsers.length === 1
									? t("messageContainer.typing.singular", { user: typingUsers[0] })
									: typingUsers.length === 2
										? t("messageContainer.typing.double", {
												user1: typingUsers[0],
												user2: typingUsers[1],
											})
										: t("messageContainer.typing.multiple", {
												users: typingUsers.slice(0, 2).join(", "),
												count: typingUsers.length - 2,
											})}
							</span>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default MessageContainer;
