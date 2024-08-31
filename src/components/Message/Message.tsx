import { Avatar, Chip, Tooltip } from "@nextui-org/react";
import { memo, useState } from "react";
import { Pen, Reply, Trash2, Ellipsis } from "lucide-react";
import { twMerge } from "tailwind-merge";
import InviteEmbed from "./Embeds/InviteEmbed.tsx";
import { MessageStates, Message as MessageType, useMessageStore } from "@/wrapper/Stores/MessageStore.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import fastDeepEqual from "fast-deep-equal";
import { Member } from "@/wrapper/Stores/Members.ts";
import { usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useTranslationStore } from "@/wrapper/Stores.ts";
import formatDate from "@/utils/formatDate.ts";
import { Invite } from "@/wrapper/Stores/InviteStore.ts";
import { Guild } from "@/wrapper/Stores/GuildStore.ts";
import { Role } from "@/wrapper/Stores/RoleStore.ts";
import RichEmbed from "@/components/Message/Embeds/RichEmbed.tsx";
import IFrameEmbed from "@/components/Message/Embeds/IFrameEmbed.tsx";
import MessageMarkDown from "@/components/Message/Markdown/MarkDown.tsx";
import Constants from "@/utils/Constants.ts";
import cn from "@/utils/cn.ts";
import ImageEmbed from "@/components/Message/Embeds/Image.tsx";
import VideoEmbed from "@/components/Message/Embeds/Video.tsx";
import PopOverData from "@/components/Popovers/PopoverData.tsx";

export type CustomizedMessage = Omit<MessageType, "invites"> & {
	invites: (Invite & {
		guild: Guild;
	} | null)[];
	author: {
		user: User;
		member: Omit<Member, "roles"> & { roles: Role[]; } | null;
		roleColor: { color: string | null; id: string; } | null;
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
		member: Member | null;
		roleColor: { color: string | null; id: string; } | null;
	} | null;
	inGuild: boolean;
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
	inGuild,
	isDeleteable = false,
	isEditable = false,
	isReplyable = false,
	jumpToMessage,
	isGrouped = false,
	isParent = false
}: MessageProps) => {
	const { t } = useTranslationStore();
	const formattedDate = formatDate(message.creationDate);
	const phishing = ((message.flags & Constants.messageFlags.Phishing) === Constants.messageFlags.Phishing);
	const [open, setOpen] = useState(false);

	return (
		<>
			{phishing && (
				<div className={cn("group w-full hover:bg-msg-hover relative transition-colors duration-300 ease-in max-w-full p-1 pb-0", open ? "bg-msg-hover" : "mb-2")}>
					<div className="flex items-center ml-12">
						<p className="text-gray-300 select-none mb-2">{t("messages.phishing")} —</p>
						<p className="mb-2 transition-colors duration-100 ease-in-out ml-1 text-gray-500 cursor-pointer hover:text-gray-400 hover:underline" onClick={() => {
							setOpen(!open);
						}}>{open ? t("messages.hideMessage") : t("messages.showMessage")}</p>
					</div>
				</div>
			)}
			{(!phishing || open) && (
				<div
					className={twMerge(
						"group w-full hover:bg-msg-hover relative transition-all duration-300 ease-in max-w-full",
						className,
						isParent && "mt-2",
						mentionsUser && "bg-mention hover:bg-mention-hover",
						highlighted && "bg-msg-jumped",
						message.state === MessageStates.SystemMessage && "bg-msg-system hover:bg-msg-system-hover",
						open && phishing && "bg-msg-hover"
						// todo: role check
					)}
					tabIndex={0}
					id={id ?? `chatmessage-${message.channelId}-${message.id}`}
				>
					{replyMessage && (
						<div className="flex items-center ml-4 mb-1">
							<Reply
								size={22}
								color="#acaebf"
								className="cursor-pointer"
								style={{
									transform: "rotate(180deg) scale(1, -1)",
								}}
							/>
							<PopOverData user={message.author.user} member={message.author.member} onlyChildren={isButtonDisabled}>
								<div className="flex items-center cursor-pointer">
									<Avatar
										src={useUserStore.getState().getAvatarUrl(replyMessage.user.id, replyMessage.user.avatar) ?? useUserStore.getState().getDefaultAvatar(replyMessage.user.id ?? "")}
										alt="User Avatar"
										className="rounded-full cursor-pointer w-4 h-4"
									/>
									<span className="text-xs ml-1 text-white" style={{
										// ? If the user is in the server but has no role color, the color should be white
										// ? If the user is not in the server anymore then the color should be gray
										// ? BUT if we are not in a server at all, then the color should be white
										// ? white = CFDBFF
										color: inGuild ?
											replyMessage.member ?
												replyMessage.roleColor?.color ? `#${replyMessage.roleColor.color}` : "#CFDBFF"
												: "#ACAEBF"
											: "#CFDBFF"
									}}>{message.mentions.users.includes(replyMessage.message.authorId) ? "@" : ""}{replyMessage.user.globalNickname ?? replyMessage.user.username}</span>
								</div>
							</PopOverData>
							<p className="text-white text-2xs ml-2 select-none cursor-pointer w-full max-w-[calc(100%-16rem)] truncate" onClick={() => {
								if (jumpToMessage) {
									jumpToMessage(replyMessage.message.id);
								}
							}} >{replyMessage.message.content}</p>
						</div>
					)}
					<div className="flex w-full max-w-full">
						{!isGrouped && (
							<PopOverData user={message.author.user} member={message.author.member} onlyChildren={isButtonDisabled}>
								<Avatar src={useUserStore.getState().getAvatarUrl(message.authorId, message.author.user.avatar) ?? useUserStore.getState().getDefaultAvatar(message.author.user.id ?? "")} alt="User Avatar" className="ml-2 mt-1 min-w-9 max-w-9 max-h-9 min-h-9 rounded-full cursor-pointer" imgProps={{ className: "transition-none" }} />
							</PopOverData>
						)}
						<div className="relative flex flex-col ml-2 w-full">
							{!isGrouped && (
								<div>
									<PopOverData user={message.author.user} member={message.author.member} onlyChildren={isButtonDisabled}>
										<span className="inline cursor-pointer text-white" style={{
											// ? same as above
											color: inGuild ?
												message.author.member ?
													message.author.roleColor?.color ? `#${message.author.roleColor.color}` : "#CFDBFF"
													: "#ACAEBF"
												: "#CFDBFF"
										}}>{message.author.user?.globalNickname ?? message.author.user?.username}</span>
									</PopOverData>
									{message.author.user && (message.author.user.isBot || message.author.user.isSystem) && (
										<Chip color="success" variant="flat" className="ml-1 w-1 p-0 h-4 text-[10px] rounded-sm" radius="none">
											{message.author.user.isBot ? t("tags.bot") : t("tags.system")}
										</Chip>
									)}
									<Tooltip content={formatDate(message.creationDate, false, true)} placement="top" delay={500}>
										<span className="text-gray-400 text-2xs mt-1 ml-1 select-none">{formattedDate}</span>
									</Tooltip>
								</div>
							)}
							<div className={cn("flex", isGrouped && "pl-0.5")}>
								{isGrouped && (
									<Tooltip content={formatDate(message.creationDate, false, true)} placement="top" delay={500}>
										<div className="select-none flex text-gray-400 items-center group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out text-3xs mr-2">
											{formatDate(message.creationDate, true)}
										</div>
									</Tooltip>
								)}
								<div
									className={twMerge(
										"text-white whitespace-pre-line overflow-hidden break-words max-w-[calc(100%-5rem)]",
										message.state === MessageStates.Failed || message.state === MessageStates.Unknown
											? "text-red-500"
											: "",
										message.state === MessageStates.Sending ? "text-gray-400" : ""
									)}
								>
									<MessageMarkDown message={message}>{message.content}</MessageMarkDown>
								</div>
							</div>
							{message.invites.map((invite, index) => {
								if (!invite) {
									return (
										<div key={index} className="mt-2 inline-block max-w-full overflow-hidden">
											<InviteEmbed invite={null} skeleton />
										</div>
									);
								}

								return (
									<div key={index} className="mt-2 inline-block max-w-full overflow-hidden">
										<InviteEmbed invite={invite ? {
											code: invite.code,
											guild: {
												icon: invite.guild.icon,
												name: invite.guild.name,
												members: {
													online: 0,
													total: invite.guild?.memberCount ?? 0
												}
											}
										} : null} />
									</div>
								);
							})}
							{message.embeds && message.embeds.map((embed, index) => (
								<div key={index} className="mt-2 inline-block max-w-full overflow-hidden">
									{embed.type === "Image" && (
										<ImageEmbed embed={embed} />
									)}

									{(embed.type === "Rich" || embed.type === "Site") && (
										<RichEmbed embed={embed} />
									)}

									{embed.type === "Iframe" && (
										<IFrameEmbed embed={embed} />
									)}

									{embed.type === "Video" && (
										<VideoEmbed embed={embed} />
									)}
								</div>
							))}
						</div>
					</div>
					{!isButtonDisabled && (
						<div className="z-10 items-center gap-2 bg-gray-800 absolute top-[-1rem] right-0 hidden group-hover:flex hover:flex p-1 rounded-md mr-2">
							<Tooltip content="Reply">
								<Reply size={18} color="#acaebf" className={twMerge("cursor-pointer hidden", isReplyable && "block")} onClick={() => {
									usePerChannelStore.getState().updateChannel(message.channelId, {
										currentStates: [...usePerChannelStore.getState().getChannel(message.channelId).currentStates, "replying"],
										replyingStateId: message.id
									});
								}} />
							</Tooltip>
							<Tooltip content="Edit">
								<Pen size={18} color="#acaebf" className={twMerge("cursor-pointer hidden", isEditable && "block")} />
							</Tooltip>
							<Tooltip content="Delete">
								<Trash2 size={18} className={twMerge("text-danger cursor-pointer hidden", isDeleteable && "block")} onClick={() => {
									useMessageStore.getState().deleteMessage(message.id);
								}} />
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

export default memo(Message, (prev, next) => {
	const prevFunctionless = Object.fromEntries(Object.entries(prev).filter(([, value]) => typeof value !== "function"));
	const nextFunctionless = Object.fromEntries(Object.entries(next).filter(([, value]) => typeof value !== "function"));

	return fastDeepEqual(prevFunctionless, nextFunctionless);
});