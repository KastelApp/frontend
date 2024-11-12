import { Avatar, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { Pen, Reply, Trash2, Ellipsis } from "lucide-react";
import InviteEmbed from "./Embeds/InviteEmbed.tsx";
import { MessageStates, Message as MessageType, useMessageStore } from "@/wrapper/Stores/MessageStore.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { Member } from "@/wrapper/Stores/Members.ts";
import { usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useTranslationStore } from "@/wrapper/Stores.tsx";
import formatDate from "@/utils/formatDate.ts";
import { Invite } from "@/wrapper/Stores/InviteStore.ts";
import { Hub } from "@/wrapper/Stores/HubStore.ts";
import { Role } from "@/wrapper/Stores/RoleStore.ts";
import RichEmbed from "@/components/Message/Embeds/RichEmbed.tsx";
import IFrameEmbed from "@/components/Message/Embeds/IFrameEmbed.tsx";
import MessageMarkDown from "@/components/Message/Markdown/MarkDown.tsx";
import Constants from "@/data/constants.ts";
import cn from "@/utils/cn.ts";
import ImageEmbed from "@/components/Message/Embeds/Image.tsx";
import VideoEmbed from "@/components/Message/Embeds/Video.tsx";
import PopOverData from "@/components/Popovers/PopoverData.tsx";
// import ReactionBox from "@/components/Message/Reaction.tsx";
import UserTag from "@/components/UserTag.tsx";
import LiveDate from "@/components/LiveDate.tsx";

export type CustomizedMessage = Omit<MessageType, "invites"> & {
	invites: (
		| (Invite & {
				hub: Hub | null;
		  })
		| null
	)[];
	author: {
		user: User;
		member: (Omit<Member, "roles"> & { roles: Role[] }) | null;
		roleColor: { color: string | null; id: string } | null;
	};
};

export interface MessageProps {
	message: CustomizedMessage;
	className?: string;
	isButtonDisabled?: boolean;
	id?: string;
	isHighlighted: boolean;
	mentionsUser: boolean;
	replyMessage: {
		user: User;
		message: MessageType;
		member: (Omit<Member, "roles"> & { roles: Role[] }) | null;
		roleColor: { color: string | null; id: string } | null;
	} | null;
	inHub: boolean;
	isDeleteable?: boolean;
	isReplyable?: boolean;
	isEditable?: boolean;
	jumpToMessage?: (msgId: string) => void;
	isGrouped?: boolean;
	isParent?: boolean;
}

const Message = ({
	className,
	isButtonDisabled,
	message,
	id,
	isHighlighted: highlighted,
	mentionsUser,
	replyMessage,
	inHub,
	isDeleteable = false,
	isEditable = false,
	isReplyable = false,
	jumpToMessage,
	isGrouped = false,
	isParent = false,
}: MessageProps) => {
	const { t } = useTranslationStore();
	const phishing = (message.flags & Constants.messageFlags.Phishing) === Constants.messageFlags.Phishing;
	const [open, setOpen] = useState(false);

	const getAvatarUrl = useUserStore((s) => s.getAvatarUrl);
	const getDefaultAvatar = useUserStore((s) => s.getDefaultAvatar);

	return (
		<>
			{phishing && (
				<div
					className={cn(
						"group relative w-full max-w-full p-1 pb-0 transition-colors duration-300 ease-in hover:bg-msg-hover",
						open ? "bg-msg-hover" : "mb-2",
					)}
				>
					<div className="ml-12 flex items-center">
						<p className="mb-2 select-none text-gray-300">{t("messages.phishing")} —</p>
						<p
							className="mb-2 ml-1 cursor-pointer text-gray-500 transition-colors duration-100 ease-in-out hover:text-gray-400 hover:underline"
							onClick={() => {
								setOpen(!open);
							}}
						>
							{open ? t("messages.hideMessage") : t("messages.showMessage")}
						</p>
					</div>
				</div>
			)}
			{(!phishing || open) && (
				<div
					className={cn(
						"group relative w-full max-w-full pl-2 outline-none transition-colors duration-300 ease-in hover:bg-msg-hover",
						className,
						isParent && "mt-2",
						mentionsUser && "bg-mention hover:bg-mention-hover",
						highlighted && "bg-msg-jumped",
						message.state === MessageStates.SystemMessage && "bg-msg-system hover:bg-msg-system-hover",
						open && phishing && "bg-msg-hover",
						// todo: role check
					)}
					tabIndex={0}
					id={id ?? `chatmessage-${message.channelId}-${message.id}`}
				>
					{replyMessage && (
						<div className="mb-1 ml-4 flex items-center">
							<Reply
								size={22}
								color="#acaebf"
								className="cursor-pointer"
								style={{
									transform: "rotate(180deg) scale(1, -1)",
								}}
							/>
							<PopOverData user={replyMessage.user} member={replyMessage.member} onlyChildren={isButtonDisabled}>
								<div className="flex cursor-pointer items-center">
									<Avatar
										src={
											getAvatarUrl(replyMessage.user.id, replyMessage.user.avatar, {
												format: "webp",
												size: 32,
											}) ?? getDefaultAvatar(replyMessage.user.id ?? "")
										}
										alt="User Avatar"
										className="h-4 w-4 cursor-pointer rounded-full"
									/>
									<span
										className="ml-1 text-xs text-white"
										style={{
											// ? If the user is in the server but has no role color, the color should be white
											// ? If the user is not in the server anymore then the color should be gray
											// ? BUT if we are not in a server at all, then the color should be white
											// ? white = CFDBFF
											color: inHub
												? replyMessage.member
													? replyMessage.roleColor?.color
														? `#${replyMessage.roleColor.color}`
														: "#CFDBFF"
													: "#ACAEBF"
												: "#CFDBFF",
										}}
									>
										{message.mentions.users.includes(replyMessage.message.authorId) ? "@" : ""}
										{replyMessage.user.globalNickname ?? replyMessage.user.username}
									</span>
								</div>
							</PopOverData>
							<p
								className="ml-2 w-full max-w-[calc(100%-16rem)] cursor-pointer select-none truncate text-2xs text-white"
								onClick={() => {
									if (jumpToMessage) {
										jumpToMessage(replyMessage.message.id);
									}
								}}
							>
								{replyMessage.message.content}
							</p>
						</div>
					)}
					<div className="flex w-full max-w-full">
						{!isGrouped && (
							<PopOverData user={message.author.user} member={message.author.member} onlyChildren={isButtonDisabled}>
								<Avatar
									src={
										getAvatarUrl(message.authorId, message.author.user.avatar) ??
										getDefaultAvatar(message.author.user.id ?? "")
									}
									alt="User Avatar"
									className="ml-2 mt-1 max-h-9 min-h-9 min-w-9 max-w-9 cursor-pointer rounded-full"
									imgProps={{ className: "transition-none" }}
								/>
							</PopOverData>
						)}
						<div className={cn("relative ml-2 flex w-full flex-col", isGrouped && "pl-6")}>
							{!isGrouped && (
								<div className="flex">
									<PopOverData
										user={message.author.user}
										member={message.author.member}
										onlyChildren={isButtonDisabled}
									>
										<span
											className="inline cursor-pointer text-white"
											style={{
												// ? same as above
												color: inHub
													? message.author.member
														? message.author.roleColor?.color
															? `#${message.author.roleColor.color}`
															: "#CFDBFF"
														: "#ACAEBF"
													: "#CFDBFF",
											}}
										>
											{message.author.user?.globalNickname ?? message.author.user?.username}
										</span>
									</PopOverData>
									{message.author.user && (message.author.user.isBot || message.author.user.isSystem) && (
										<UserTag>{message.author.user.isBot ? t("tags.bot") : t("tags.system")}</UserTag>
									)}
									<Tooltip content={formatDate(message.creationDate, "dayTime")} placement="top" delay={500}>
										<span className="ml-1 mt-1 select-none text-2xs text-gray-400">
											<LiveDate date={message.creationDate} format="relative" />
										</span>
									</Tooltip>
								</div>
							)}
							<div className="relative flex">
								{isGrouped && (
									<Tooltip content={formatDate(message.creationDate, "dayTime")} placement="top" delay={500}>
										<div className="absolute -ml-8 flex select-none text-3xs text-gray-400 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
											{formatDate(message.creationDate, "short")}
										</div>
									</Tooltip>
								)}
								<div
									className={cn(
										"max-w-[calc(100%-5rem)] overflow-hidden whitespace-pre-wrap break-words text-white",
										message.state === MessageStates.Failed || message.state === MessageStates.Unknown
											? "text-red-500"
											: "",
										message.state === MessageStates.Sending ? "text-gray-400" : "",
										isGrouped && "ml-5",
									)}
								>
									<MessageMarkDown message={message}>{message.content}</MessageMarkDown>
								</div>
							</div>
							<div className={cn("flex flex-col", isGrouped && "pl-5")}>
								{message.invites.map((invite, index) => {
									if (!invite) {
										return (
											<div key={index} className="mt-2 inline-block max-w-full overflow-hidden">
												<InviteEmbed invite={null} skeleton userId={message.author.user.id} />
											</div>
										);
									}

									return (
										<div key={index} className="mt-2 inline-block max-w-full overflow-hidden">
											<InviteEmbed invite={invite} userId={message.author.user.id} />
										</div>
									);
								})}
								{message.embeds &&
									message.embeds.map((embed, index) => (
										<div key={index} className="mt-2 inline-block max-w-full overflow-hidden">
											{embed.type === "Image" && <ImageEmbed embed={embed} />}

											{(embed.type === "Rich" || embed.type === "Site") && <RichEmbed embed={embed} />}

											{embed.type === "Iframe" && <IFrameEmbed embed={embed} />}

											{embed.type === "Video" && <VideoEmbed embed={embed} />}
										</div>
									))}

								{/* <div className="flex space-x-1">
									<ReactionBox icon="👍" count={15} />
									<ReactionBox icon="👍" count={15} />
									<ReactionBox icon="👍" count={15} />
									<ReactionBox icon="👍" count={15} />
									<ReactionBox icon="👍" count={15} />
									<ReactionBox icon="👍" count={15} />
									<ReactionBox icon="👍" count={15} />
									<ReactionBox icon="👍" count={15} />
									<ReactionBox icon="👍" count={15} />
									<ReactionBox icon="👍" count={15} />
								</div> */}
							</div>
						</div>
					</div>
					{!isButtonDisabled && (
						<div className="absolute right-0 top-[-1rem] mr-2 hidden items-center gap-2 rounded-md bg-gray-800 p-1 group-hover:flex hover:flex">
							<Tooltip content="Reply">
								<Reply
									size={18}
									color="#acaebf"
									className={cn("hidden cursor-pointer", isReplyable && "block")}
									onClick={() => {
										usePerChannelStore.getState().updateChannel(message.channelId, {
											currentStates: [
												...usePerChannelStore.getState().getChannel(message.channelId).currentStates,
												"replying",
											],
											replyingStateId: message.id,
										});
									}}
								/>
							</Tooltip>
							<Tooltip content="Edit">
								<Pen size={18} color="#acaebf" className={cn("hidden cursor-pointer", isEditable && "block")} />
							</Tooltip>
							<Tooltip content="Delete">
								<Trash2
									size={18}
									className={cn("hidden cursor-pointer text-danger", isDeleteable && "block")}
									onClick={() => {
										useMessageStore.getState().deleteMessage(message.id);
									}}
								/>
							</Tooltip>
							<Tooltip content="More">
								<Ellipsis size={18} color="#acaebf" className="cursor-pointer" />
							</Tooltip>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default Message;

// ! Leaving the code behind for future refrence, in development you will defo have issues i.e it being slow etc, but in production it will be fine
// ! due to react 19's new compiler
// export default memo(Message, (prev, next) => {
// 	const prevFunctionless = Object.fromEntries(Object.entries(prev).filter(([, value]) => typeof value !== "function"));
// 	const nextFunctionless = Object.fromEntries(Object.entries(next).filter(([, value]) => typeof value !== "function"));

// 	return fastDeepEqual(prevFunctionless, nextFunctionless);
// });
