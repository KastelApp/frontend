import { X, Pen, CirclePlus, SendHorizontal, SmilePlus, FileIcon } from "lucide-react";
import SlateEditor from "./SlateEditor.tsx";
import { Avatar, Divider, Image } from "@nextui-org/react";
import TypingDots from "./TypingDats.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useContentStore, usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { Member, useMemberStore } from "@/wrapper/Stores/Members.ts";
import { useMessageStore } from "@/wrapper/Stores/MessageStore.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import { useAPIStore, useTranslationStore } from "@/wrapper/Stores.tsx";
import Tooltip from "../Tooltip.tsx";
import useTypingIndicator from "@/hooks/useTypingIndicator.ts";
import hexOpacity from "@/utils/hexOpacity.ts";
import cn from "@/utils/cn.ts";
import { snowflake } from "@/utils/Constants.ts";

const FileComponent = ({ fileName, type, onDelete, onEdit, file }: { fileName?: string; type: "image" | "file"; file: File; onDelete: () => void; onEdit: () => void; }) => {
	const url = URL.createObjectURL(file);

	return (
		<div className="relative mt-2 flex h-44 w-44 flex-col justify-between rounded-md bg-lightAccent dark:bg-darkAccent p-2">
			{/* Top-right action buttons */}
			<div className="absolute right-0.5 top-0.5 z-10 flex gap-2 rounded-md bg-gray-800 p-1">
				<Tooltip content="Edit File Details">
					<Pen size={18} color="#acaebf" className="cursor-pointer" onClick={onEdit} />
				</Tooltip>
				<Tooltip content="Remove File">
					<X size={18} className="cursor-pointer text-danger" onClick={onDelete} />
				</Tooltip>
			</div>

			{/* File Preview */}
			<div
				className={cn(
					"flex h-full w-full items-center justify-center overflow-hidden rounded-md",
					type === "image" && "bg-gray-500"
				)}
			>
				{type === "image" ? (
					<Image
						src={url!}
						alt={fileName || "Uploaded file"}
						className="h-full w-full object-cover z-0 transition-none"
					/>
				) : (
					<FileIcon size={64} color="#acaebf" />
				)}
			</div>

			{/* Filename */}
			<div className="mt-2 truncate text-sm text-white">
				{fileName || "No file name"}
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
	hubId,
	onResize
}: {
	placeholder: string;
	children?: React.ReactNode;
	isReadOnly?: boolean;
	sendMessage: (content: string) => void;
	channelId: string;
	hubId: string | null;
	onResize?: (height: number) => void;
}) => {
	const { t } = useTranslationStore();
	const [files, setFiles] = useState<{ name: string; type: "image" | "file"; file: File; id: string; }[]>([]);
	const [state, setState] = useState<("replying" | "mentioning")[]>([]);
	const getPerChannel = usePerChannelStore((state) => state.getChannel);
    const updatePerChannel = usePerChannelStore((state) => state.updateChannel);
	const { getMessage } = useMessageStore();

	const [replyingAuthor, setReplyingAuthor] = useState<{
		user: User | null;
		member: Member | null;
		roleColor: { color: string | null; id: string; } | null;
	}>({
		member: null,
		user: null,
		roleColor: null,
	});

	const [content, setContent] = useState("");

	const { sendUserIsTyping, sentTypingEvent, shouldSendTypingEvent } = useTypingIndicator({
		onTypingStart: () => { },
		onTypingStop: () => { }
	});


	// useEffect(() => {
	// 	const gotChannel = getChannel(channelId);

	// 	let shouldUpdatingLastTyping = false;
	// 	let shouldUpdateStartedTyping = false;
	// 	let shouldUpdateLastSentTyping = false;

	// 	if (gotChannel.lastTyped !== lastTypedAt) {
	// 		shouldUpdatingLastTyping = true;
	// 	}

	// 	if (gotChannel.lastTypingSent !== lastSentTypingAt) {
	// 		shouldUpdateLastSentTyping = true;
	// 	}

	// 	if (gotChannel.typingStarted !== startedTypingAt) {
	// 		shouldUpdateStartedTyping = true;
	// 	}

	// 	updateChannel(channelId, {
	// 		...(shouldUpdatingLastTyping ? { lastTyped: lastTypedAt } : {}),
	// 		...(shouldUpdateLastSentTyping ? { lastTypingSent: lastSentTypingAt } : {}),
	// 		...(shouldUpdateStartedTyping ? { typingStarted: startedTypingAt } : {}),
	// 	});
	// }, [startedTypingAt, lastTypedAt, lastSentTypingAt]);

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
	}, [shouldSendTypingEvent]);

	const [signal, setSignal] = useState<number>(0);
	// ? the users usernames / nickname
	const [typingUsers, setTypingUsers] = useState<string[]>([]);

	useEffect(() => {
		const subscribed = usePerChannelStore.subscribe(() => setSignal((prev) => prev + 1));

		return () => subscribed();
	}, []);

	const { getContent, setContent: setMsgContent } = useContentStore();

	useEffect(() => {
		const channel = getPerChannel(channelId);

		setContent(getContent(channelId) ?? "");
		// setLastSentTypingAt(channel.lastTypingSent);
		// setLastTypedAt(channel.lastTyped);
		// setStartedTypingAt(channel.typingStarted);

		const filteredTypingUsers = channel.typingUsers.filter((user) => user.started > Date.now() - 7000);

		if (filteredTypingUsers.length !== channel.typingUsers.length) {
			updatePerChannel(channelId, {
				typingUsers: filteredTypingUsers,
			});
		}

		// ? we want to ignore ourselves
		const typingUsers = filteredTypingUsers
			.filter((typing) => typing.id !== useUserStore.getState().getCurrentUser()?.id)
			.map((typing) => {
				const user = useUserStore.getState().getUser(typing.id);
				const member = hubId ? useMemberStore.getState().getMember(hubId, typing.id) : null;

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
			const fetchedMember = hubId ? useMemberStore.getState().getMember(hubId, foundReply.authorId) ?? null : null;

			let roleData: { color: string; id: string; } | null = null;

			if (fetchedMember) {
				const roles = useRoleStore.getState().getRoles(hubId ?? "");
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
	}, [channelId, hubId, signal]);

	const [mentionTypes] = useState<{ type: string; name: string; color: number; id: string; avatar?: string; }[]>([
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

	const fileRef = useRef<HTMLInputElement>(null);

	const onCloseReply = useCallback(() => {
		setState((prev) => prev.filter((v) => v !== "replying"));

		setReplyingAuthor({
			member: null,
			user: null,
			roleColor: null,
		});

		const perChannel = getPerChannel(channelId);

		updatePerChannel(channelId, {
            replyingStateId: null,
            currentStates: perChannel.currentStates.filter((s) => s !== "replying"),
        });
	}, [channelId, state]);

	return (
		<div
			className="flex h-screen flex-col overflow-x-hidden"
			style={{
				// maxHeight: navBarLocation === NavBarLocation.Bottom ? "calc(100vh - 6rem)" : "calc(100vh - 4rem)",
				maxHeight: "calc(100vh - 4rem)",
			}}
		>
			{children}
			<div
				className={cn(
					"mb-0 ml-2 w-full pr-6",
					// membersBarOpen ? "max-w-[calc(100vw-28rem)]" : "max-w-[calc(100vw-19rem)]"
					// membersBarOpen
					// 	? navBarLocation === NavBarLocation.Bottom
					// 		? "max-w-[calc(100vw-28rem)]"
					// 		: "max-w-[calc(100vw-32rem)]"
					// 	: navBarLocation === NavBarLocation.Bottom
					// 		? "max-w-[calc(100vw-15rem)]"
					// 		: "max-w-[calc(100vw-19rem)]",
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
					<div className="ml-1 flex w-full select-none rounded-xl rounded-b-none bg-lightAccent dark:bg-darkAccent">
						<div className="p-2">
							{t("messageContainer.replying")}{" "}
							<span
								className="font-semibold text-white"
								style={{
									color: hubId
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
									onClick={onCloseReply}
								/>
							</Tooltip>
						</div>
					</div>
				)}

				<div
					className={cn(
						"ml-1 max-h-96 w-full overflow-y-auto overflow-x-hidden rounded-md bg-gray-800 px-4 py-1",
						state.includes("replying") ? "rounded-t-none" : "",
					)}
				>
					<div className="mb-3 mt-2">
						{files.length > 0 && (
							<div className="mb-4  flex flex-wrap justify-start gap-2">
								{files.map((file, index) => (
									<FileComponent
										key={index}
										fileName={file.name}
										type={file.type}
										file={file.file}
										onDelete={() => {
											setFiles((old) => old.filter((f) => f.id !== file.id));
										}}
										onEdit={() => { }}
									/>
								))}
								<Divider className="mt-2" />
							</div>
						)}
						<div className={cn("flex align-middle justify-center", isReadOnly ? "cursor-not-allowed opacity-45" : "")}>
							<div className="relative mr-4 cursor-pointer">
								<CirclePlus
									size={22}
									color="#acaebf"
									className={cn(isReadOnly ? "" : "cursor-pointer")}
									onClick={() => {
										if (isReadOnly) return;

										fileRef.current?.click();
									}}
								/>
								<input
									type="file"
									title="Files"
									className="absolute mm-hw-0 bottom-0 right-0 opacity-0"
									multiple
									ref={fileRef}
									onChange={(e) => {
										for (const file of e.target.files ?? []) {
											console.log(file.name, file.size);

											setFiles((old) => [
												...old,
												{
													name: file.name,
													type: file.type.startsWith("image") ? "image" : "file",
													file,
													id: snowflake.generate(),
													url: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
												}
											]);
										}
									}}
								/>
							</div>
							<SlateEditor
								sendMessage={(msg) => {
									sendMessage(msg);

									setMsgContent(channelId, "");
								}}
								placeholder={placeholder}
								isReadOnly={isReadOnly}
								// initialText={content}
								readOnlyMessage={t("messageContainer.readOnly")}
								onType={(text) => {
									if (isReadOnly) return;

									setContent(text);
									setMsgContent(channelId, text);

									sendUserIsTyping(text);
								}}
								onResize={onResize}
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
