import { Chip, Popover, PopoverContent, PopoverTrigger, Tooltip, useDisclosure } from "@nextui-org/react";
import UserPopover from "@/components/Popovers/UserPopover.tsx";
import { memo, useEffect, useState } from "react";
import { Pen, Reply, Trash2, Ellipsis } from "lucide-react";
import { twMerge } from "tailwind-merge";
import UserModal from "@/components/Modals/UserModal.tsx";
// import RichEmbed, { Embed } from "./Embeds/RichEmbed.tsx";
// import IFrameEmbed from "./Embeds/IFrameEmbed.tsx";
import InviteEmbed from "./Embeds/InviteEmbed.tsx";
import { MessageStates, Message as MessageType, useMessageStore } from "@/wrapper/Stores/MessageStore.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import fastDeepEqual from "fast-deep-equal";
import { Member, useMemberStore } from "@/wrapper/Stores/Members.ts";
import { useChannelStore, usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import { useTranslationStore } from "@/wrapper/Stores.ts";
import Image from "next/image";
import formatDate from "@/utils/formatDate.ts";
import { useInviteStore } from "@/wrapper/Stores/InviteStore.ts";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";

const Message = memo(({
	className,
	disableButtons,
	message,
	id,
}: {
	message: MessageType;
	className?: string;
	disableButtons?: boolean;
	id?: string;
}) => {
	const guildId = useChannelStore.getState().getGuildId(message.channelId);
	const { messages } = useMessageStore();
	const { t } = useTranslationStore();

	const [author, setAuthor] = useState<{
		user: User | null;
		member: Member | null;
		roleColor: { color: string | null; id: string; } | null;
	}>({
		member: guildId ? useMemberStore.getState().getMember(guildId, message.authorId) ?? null : null,
		user: useUserStore.getState().getUser(message.authorId),
		roleColor: null
	});
	const [replyingAuthor, setReplyingAuthor] = useState<{
		user: User | null;
		member: Member | null;
		roleColor: { color: string | null; id: string; } | null;
	}>({
		user: null,
		member: null,
		roleColor: null
	});

	const { fetchInvite, getInvite } = useInviteStore();
	const { getGuild } = useGuildStore();
	const [fetchedInvites, setFetchedInvites] = useState(false);

	const fetchInvites = async () => {
		for (const invite of message.invites) {
			await fetchInvite(invite);
		}

		setFetchedInvites(true);
	};

	useEffect(() => {
		setFetchedInvites(false);
		fetchInvites();
	}, [message.invites]);

	const [replyingMessage, setReplyingMessage] = useState<MessageType | null | undefined>(() => {
		const foundReply = messages.find((msg) => msg.id === message.replyingTo);

		if (foundReply) {
			if (!replyingAuthor.user) {
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
		}

		return foundReply ?? null;
	});

	const [highlighted, setHighlighted] = useState(false);

	useEffect(() => {
		const messageSubscribed = useMessageStore.subscribe(async (state) => {
			if (!message.replyingTo) return;

			const msg = state.messages.find((msg) => msg.id === message.replyingTo);

			if (!msg) return;

			if (fastDeepEqual(msg, replyingMessage)) return;

			setReplyingMessage(msg);

			if (!replyingAuthor) {
				const fetchedAuthor = useUserStore.getState().getUser(msg.authorId);
				const fetchedMember = guildId ? useMemberStore.getState().getMember(guildId, msg.authorId) ?? null : null;

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
		});

		const authorsSubscribed = useUserStore.subscribe(async (state) => {
			const originalAuthor = state.getUser(message.authorId);

			if (!fastDeepEqual(originalAuthor, author)) {
				setAuthor((prev) => ({
					...prev,
					user: originalAuthor
				}));
			}

			if (!message.replyingTo || !replyingMessage) return;

			const replyingToAuthor = state.getUser(replyingMessage.authorId);

			if (!fastDeepEqual(replyingToAuthor, replyingAuthor)) {
				setReplyingAuthor((prev) => ({
					...prev,
					user: replyingToAuthor
				}));
			}
		});

		const membersSubscribed = useMemberStore.subscribe(async (state) => {
			if (!guildId) return;

			const member = state.getMember(guildId, message.authorId)!;

			if (!fastDeepEqual(member, author.member)) {
				const roles = useRoleStore.getState().getRoles(guildId);

				const topColorRole = member.roles
					.map((roleId) => roles.find((role) => role.id === roleId))
					.filter((role) => role !== undefined)
					.sort((a, b) => a!.position - b!.position)
					.reverse()[0];

				setAuthor((prev) => ({
					...prev,
					member,
					roleColor: {
						color: topColorRole ? topColorRole.color.toString(16) : "",
						id: topColorRole ? topColorRole.id : ""
					}
				}));
			}

			if (!message.replyingTo || !replyingMessage) return;

			const replyingToMember = state.getMember(guildId, replyingMessage.authorId)!;

			if (!fastDeepEqual(replyingToMember, replyingAuthor?.member)) {
				const roles = useRoleStore.getState().getRoles(guildId);

				const topColorRole = replyingToMember.roles
					.map((roleId) => roles.find((role) => role.id === roleId))
					.filter((role) => role !== undefined)
					.sort((a, b) => a!.position - b!.position)
					.reverse()[0];

				setReplyingAuthor((prev) => ({
					...prev,
					member: replyingToMember,
					roleColor: {
						color: topColorRole ? topColorRole.color.toString(16) : "",
						id: topColorRole ? topColorRole.id : ""
					}
				}));
			}
		});

		const perChannelSubscribed = usePerChannelStore.subscribe((state) => {
			const currentChannel = state.getChannel(message.channelId);

			if (!currentChannel.currentStates.includes("jumped") || currentChannel.jumpingStateId !== message.id) {
				setHighlighted(false);

				return;
			}

			setHighlighted(true);
		});

		return () => {
			messageSubscribed();
			authorsSubscribed();
			membersSubscribed();
			perChannelSubscribed();
		};
	}, []);

	const PopOverData = ({ children }: { children: React.ReactElement | React.ReactElement[]; }) => {
		const [isOpen, setIsOpen] = useState(false);

		const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();

		if (disableButtons) return children as React.ReactElement;

		return (
			<>
				<UserModal isOpen={isModalOpen} onClose={onClose} user={author.user!} />
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
								user: author.user!,
								member: author.member ? {
									member: author.member,
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
				message.mentions.users.includes(useUserStore.getState().getCurrentUser()?.id ?? "") ? "bg-mention hover:bg-mention-hover" : "",
				highlighted ? "bg-msg-jumped" : "",
				// todo: role check
			)}
			tabIndex={0}
			id={id ?? `chatmessage-${message.channelId}-${message.id}`}
		>
			{replyingMessage && (
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
								src={replyingAuthor.user?.avatar ?? useUserStore.getState().getDefaultAvatar(replyingAuthor.user?.id ?? "")}
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
								color: guildId ?
									replyingAuthor.member ?
										replyingAuthor.roleColor?.color ? `#${replyingAuthor.roleColor.color}` : "#CFDBFF"
										: "#ACAEBF"
									: "#CFDBFF"
							}}>{message.mentions.users.includes(replyingMessage.authorId) ? "@" : ""}{replyingAuthor.user?.globalNickname ?? replyingAuthor?.user?.username}</span>
						</div>
					</PopOverData>
					<p className="text-gray-300 text-2xs ml-2 select-none">{replyingMessage.content}</p>
				</div>
			)}
			<div className="flex">
				<PopOverData>
					<Image src={author.user?.avatar ?? useUserStore.getState().getDefaultAvatar(author.user?.id ?? "")} alt="User Avatar" width={32} height={32} className="rounded-full cursor-pointer w-8 h-8" />
				</PopOverData>
				<div className="relative flex flex-col ml-2">
					<div>
						<PopOverData>
							<span className="inline cursor-pointer text-white" style={{
								// ? same as above
								color: guildId ?
									author.member ?
										author.roleColor?.color ? `#${author.roleColor.color}` : "#CFDBFF"
										: "#ACAEBF"
									: "#CFDBFF"
							}}>{author.user?.globalNickname ?? author.user?.username}</span>
						</PopOverData>
						{author.user && (author.user.isBot || author.user.isSystem) && (
							<Chip color="success" variant="flat" className="ml-1 w-1 p-0 h-4 text-[10px] rounded-sm" radius="none">
								{author.user.isBot ? t("tags.bot") : t("tags.system")}
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
					{fetchedInvites && message.invites.map((invite, index) => {
						const fetchedInvite = getInvite(invite);

						const guild = fetchedInvite ? getGuild(fetchedInvite.guildId) : null

						return (
							<div key={index} className="mt-2 inline-block max-w-full overflow-hidden">
								<InviteEmbed invite={fetchedInvite ? {
									code: fetchedInvite.code,
									guild: {
										icon: guild!.icon,
										name: guild!.name,
										members: {
											online: 0,
											total: guild?.memberCount ?? 0
										}
									}
								} : null} />
							</div>
						)
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
});

export default Message;
