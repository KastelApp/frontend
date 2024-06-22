import { Avatar, Chip, Popover, PopoverContent, PopoverTrigger, Tooltip, useDisclosure } from "@nextui-org/react";
import UserPopover from "@/components/Popovers/UserPopover.tsx";
import { memo, useEffect, useState } from "react";
import { Pen, Reply, Trash2, Ellipsis } from "lucide-react";
import { twMerge } from "tailwind-merge";
import UserModal from "@/components/Modals/UserModal.tsx";
import RichEmbed, { Embed } from "./Embeds/RichEmbed.tsx";
import IFrameEmbed from "./Embeds/IFrameEmbed.tsx";
import InviteEmbed from "./Embeds/InviteEmbed.tsx";
import { MessageStates, Message as MessageType, useMessageStore } from "@/wrapper/Stores/MessageStore.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import fastDeepEqual from "fast-deep-equal";
import { Member, useMemberStore } from "@/wrapper/Stores/Members.ts";
import { useChannelStore, usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";

const Message = memo(({
	className,
	disableButtons,
	message
}: {
	message: MessageType;
	className?: string;
	disableButtons?: boolean;
}) => {
	const guildId = useChannelStore.getState().getGuildId(message.channelId);

	const [author, setAuthor] = useState<{
		user: User | null;
		member: Member | null;
		roleColor: { color: string | null; id: string; } | null;
	}>({
		member: guildId ? useMemberStore.getState().getMember(guildId, message.authorId) ?? null : null,
		user: useUserStore.getState().getUser(message.authorId),
		roleColor: null
	});
	const [replyingMessage, setReplyingMessage] = useState<MessageType | null>(null);
	const [replyingAuthor, setReplyingAuthor] = useState<{
		user: User | null;
		member: Member | null;
		roleColor: { color: string | null; id: string; } | null;
	}>({
		user: null,
		member: null,
		roleColor: null
	});


	useEffect(() => {
		if (message.replyingTo) {
			const foundReply = useMessageStore.getState().getMessage(message.replyingTo);

			if (foundReply) {
				setReplyingMessage(foundReply);

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
		}

		const messageSubscribed = useMessageStore.subscribe(async (state) => {
			if (!message.replyingTo) return;

			const msg = state.messages.find((msg) => msg.id === message.replyingTo);

			if (!msg) return;

			// ? only update if they are different

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


		return () => {
			messageSubscribed();
			authorsSubscribed();
			membersSubscribed();
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
								member: author.member
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

	return (
		<div
			className={twMerge(
				"group w-full hover:bg-msg-hover mb-2 relative",
				className,
				// mention ? "bg-mention hover:bg-mention-hover" : "",
				message.mentions.users.includes(useUserStore.getState().getCurrentUser()?.id ?? "") ? "bg-mention hover:bg-mention-hover" : "",
				// todo: role check
			)}
			tabIndex={0}
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
							<Avatar
								src="https://development.kastelapp.com/icon-1.png"
								className="ml-2 cursor-pointer w-4 h-4"
								imgProps={{ className: "transition-none" }}
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
					<p className="text-gray-300 text-2xs ml-2">{replyingMessage.content}</p>
				</div>
			)}
			<div className="flex">
				<PopOverData>
					<Avatar
						src="https://development.kastelapp.com/icon-1.png"
						className=" mt-1 ml-2 cursor-pointer min-w-8 min-h-8 w-8 h-8 hover:scale-95 transition-all duration-300 ease-in-out transform"
						imgProps={{ className: "transition-none" }}
					/>
				</PopOverData>
				<div className="relative">
					<div className="flex flex-col ml-2">
						<span>
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
							{/* {tag && (
								<Chip color="success" variant="flat" className="ml-1 w-1 p-0 h-4 text-[10px] rounded-sm" radius="none">
									{tag}
								</Chip>
							)} */}
							<Tooltip content="Saturday, May 11. 2024 12:00 PM" placement="top">
								<span className="text-gray-400 text-2xs mt-1 ml-1 select-none">{new Date(message.creationDate).toLocaleString()}</span>
							</Tooltip>
						</span>
						<div
							className={
								twMerge("text-white whitespace-pre-line overflow-hidden break-words",
									message.state === MessageStates.Failed
										|| message.state === MessageStates.Unknown ? "text-red-500" : "",
									message.state === MessageStates.Sending ? "text-gray-400" : "",
								)
							}
						>
							<p>{message.content}</p>
						</div>
						{/* {invites && invites.map((invite, index) => (
							<div key={index} className="mt-2 inline-block max-w-full overflow-hidden">
								<InviteEmbed invite={invite} />
							</div>
						))}
						{embeds && embeds.map((embed, index) => (
							<div key={index} className="mt-2 inline-block max-w-full overflow-hidden">
								{embed.type === "Rich" ?
									<RichEmbed embed={embed} /> : embed.type === "Iframe" ? <IFrameEmbed embed={embed} /> : null}
							</div>
						))} */}
					</div>
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
