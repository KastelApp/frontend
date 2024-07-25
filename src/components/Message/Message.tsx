import { Chip, Popover, PopoverContent, PopoverTrigger, Tooltip, useDisclosure } from "@nextui-org/react";
import UserPopover from "@/components/Popovers/UserPopover.tsx";
import { memo, useState } from "react";
import { Pen, Reply, Trash2, Ellipsis } from "lucide-react";
import { twMerge } from "tailwind-merge";
import UserModal from "@/components/Modals/UserModal.tsx";
// import RichEmbed, { Embed } from "./Embeds/RichEmbed.tsx";
// import IFrameEmbed from "./Embeds/IFrameEmbed.tsx";
import InviteEmbed from "./Embeds/InviteEmbed.tsx";
import { MessageStates, Message as MessageType } from "@/wrapper/Stores/MessageStore.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import fastDeepEqual from "fast-deep-equal";
import { Member } from "@/wrapper/Stores/Members.ts";
import { usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useTranslationStore } from "@/wrapper/Stores.ts";
import Image from "next/image";
import formatDate from "@/utils/formatDate.ts";
import { Invite } from "@/wrapper/Stores/InviteStore.ts";
import { Guild } from "@/wrapper/Stores/GuildStore.ts";

export interface MessageProps {
	message: Omit<MessageType, "invites"> & {
		invites: (Invite & {
			guild: Guild;
		} | null)[];
		author: {
			user: User;
			member: Member | null;
			roleColor: { color: string | null; id: string; } | null;
		};
	};
	className?: string;
	disableButtons?: boolean;
	id?: string;
	highlighted: boolean;
	mentionsUser: boolean;
	replyMessage: {
		user: User;
		message: MessageType;
		member: Member | null;
		roleColor: { color: string | null; id: string; } | null;
	} | null;
	inGuild: boolean;
}

const Message = ({
	className,
	disableButtons,
	message,
	id,
	highlighted,
	mentionsUser,
	replyMessage,
	inGuild
}: MessageProps) => {
	const { t } = useTranslationStore();

	const PopOverData = ({ children }: { children: React.ReactElement | React.ReactElement[]; }) => {
		const [isOpen, setIsOpen] = useState(false);

		const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();

		if (disableButtons) return children as React.ReactElement;

		return (
			<>
				<UserModal isOpen={isModalOpen} onClose={onClose} user={message.author.user} />
				<Popover
					placement="right"
					isOpen={isOpen}
					onOpenChange={setIsOpen}
					shouldCloseOnInteractOutside={() => {
						setIsOpen(false);
						return false;
					}}
				>
					<PopoverTrigger>{children}</PopoverTrigger>
					<PopoverContent>
						<UserPopover
							member={{
								user: message.author.user,
								member: message.author.member ? {
									member: message.author.member,
									roles: []
								} : null
							}}
							onClick={() => {
								onOpen();
								setIsOpen(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			</>
		);
	};

	const formattedDate = formatDate(message.creationDate);


	return (
		<div
			className={twMerge(
				"group w-full hover:bg-msg-hover mb-2 relative transition-all duration-300 ease-in",
				className,
				mentionsUser && "bg-mention hover:bg-mention-hover",
				highlighted && "bg-msg-jumped",
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
					<PopOverData>
						<div className="flex items-center cursor-pointer">
							<Image
								src={replyMessage.user.avatar ?? useUserStore.getState().getDefaultAvatar(replyMessage.user.id ?? "")}
								alt="User Avatar"
								width={32}
								height={32}
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
					<p className="text-gray-300 text-2xs ml-2 select-none">{replyMessage.message.content}</p>
				</div>
			)}
			<div className="flex">
				<PopOverData>
					<Image src={message.author.user.avatar ?? useUserStore.getState().getDefaultAvatar(message.author.user.id ?? "")} alt="User Avatar" width={32} height={32} className="rounded-full cursor-pointer w-8 h-8" />
				</PopOverData>
				<div className="relative flex flex-col ml-2">
					<div>
						<PopOverData>
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
						<Tooltip content="Saturday, May 11. 2024 12:00 PM" placement="top" delay={500}>
							<span className="text-gray-400 text-2xs mt-1 ml-1 select-none">{formattedDate}</span>
						</Tooltip>
					</div>
					<p
						className={
							twMerge("text-white whitespace-pre-line overflow-hidden break-words",
								message.state === MessageStates.Failed
									|| message.state === MessageStates.Unknown ? "text-red-500" : "",
								message.state === MessageStates.Sending ? "text-gray-400" : "",
							)
						}
					>
						{message.content}
					</p>
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
					{/* {embeds && embeds.map((embed, index) => (
                <div key={index} className="mt-2 inline-block max-w-full overflow-hidden">
                    {embed.type === "Rich" ?
                        <RichEmbed embed={embed} /> : embed.type === "Iframe" ? <IFrameEmbed embed={embed} /> : null}
                </div>
            ))} */}
				</div>
			</div>
			{!disableButtons && (
				<div className="z-10 items-center gap-2 bg-gray-800 absolute top-[-1rem] right-0 hidden group-hover:flex hover:flex p-1 rounded-md mr-2">
					<Tooltip content="Reply">
						<Reply size={18} color="#acaebf" className="cursor-pointer" onClick={() => {
							usePerChannelStore.getState().updateChannel(message.channelId, {
								currentStates: [...usePerChannelStore.getState().getChannel(message.channelId).currentStates, "replying"],
								replyingStateId: message.id
							});
						}} />
					</Tooltip>
					<Tooltip content="Edit">
						<Pen size={18} color="#acaebf" className="cursor-pointer" />
					</Tooltip>
					<Tooltip content="Delete">
						<Trash2 size={18} className="text-danger cursor-pointer" />
					</Tooltip>
					<Tooltip content="More">
						<Ellipsis size={18} color="#acaebf" className="cursor-pointer" />
					</Tooltip>
				</div>
			)}
		</div>
	);

};

export default memo(Message, (prev, next) => {
	return fastDeepEqual(prev, next);
});