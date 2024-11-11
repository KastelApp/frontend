import { Avatar, Badge, Checkbox } from "@nextui-org/react";
import TypingDots from "@/components/MessageContainer/TypingDats.tsx";
import { usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import ContextMenuHandler from "@/components/ContextMenuHandler.tsx";
import { Hammer, Wine } from "lucide-react";
import UserTag from "@/components/UserTag.tsx";
import { useTranslationStore } from "@/wrapper/Stores.tsx";
import { useEffect, useState } from "react";
import { Member } from "@/wrapper/Stores/Members.ts";
import { Role } from "@/wrapper/Stores/RoleStore.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import cn from "@/utils/cn.ts";
import PopOverData from "@/components/Popovers/PopoverData.tsx";

const MemberItem = ({
	member,
	color,
	channelId,
}: {
	member: {
		member: Omit<Member, "roles"> & { roles: Role[] };
		user: User;
	};
	color: string | null;
	channelId: string;
}) => {
	const { t } = useTranslationStore();
	const [typing, setTyping] = useState(false);
	const { getChannel } = usePerChannelStore();
	const getAvatarUrl = useUserStore((s) => s.getAvatarUrl);
	const getDefaultAvatar = useUserStore((s) => s.getDefaultAvatar);

	useEffect(() => {
		const channel = getChannel(channelId);

		if (!channel) return;

		const foundUser = channel.typingUsers.find((user) => user.id === member.user.id);

		if (foundUser && Date.now() - foundUser.started < 7000) {
			setTyping(true);
		}

		const subscribed = usePerChannelStore.subscribe((state) => {
			const foundUser = state.getChannel(channelId)?.typingUsers.find((user) => user.id === member.user.id);

			if (foundUser && Date.now() - foundUser.started < 7000) {
				setTyping(true);
			} else {
				setTyping(false);
			}
		});

		return () => subscribed();
	}, [channelId]);

	return (
		<>
			<PopOverData member={member.member} user={member.user} key={member.user.id}>
				<div>
					<ContextMenuHandler
						items={[
							{
								label: "Profile",
							},
							{
								label: "Mention",
							},
							{
								label: "Message",
								divider: true,
							},
							{
								label: "Roles",
								subValues: [
									{
										label: "role 1",
										endContent: <Checkbox />,
										preventCloseOnClick: true,
									},
								],
							},
							{
								label: <p className="text-danger">Ban</p>,
								endContent: <Hammer className="text-danger" size={18} />,
							},
							{
								label: <p className="text-danger">Kick</p>,
								endContent: <Wine className="text-danger" size={18} />,
								divider: true,
							},
							{
								label: "Copy User ID",
								onPress: () => {
									navigator.clipboard.writeText(member.user.id);
								},
							},
						]}
					>
						<div className="relative flex h-12 w-full cursor-pointer items-center justify-between rounded-lg px-2 hover:bg-slate-800">
							<div className="flex items-center">
								<Badge
									content={typing ? <TypingDots className="mt-2.5 flex w-1 -rotate-90 flex-col gap-0.5" /> : ""}
									placement="bottom-right"
									// color={
									// 	member.status === "online"
									// 		? "success"
									// 		: member.status === "idle"
									// 			? "warning"
									// 			: member.status === "dnd"
									// 				? "danger"
									// 				: "default"
									// }
									color="success"
									className={cn("mb-1 transition-all duration-300 ease-out", typing ? "mr-1 h-4 w-8" : "")}
								>
									<Avatar
										src={getAvatarUrl(member.user.id, member.user.avatar) ?? getDefaultAvatar(member.user.id)}
										size="sm"
										imgProps={{ className: "transition-none" }}
									/>
								</Badge>
								<div className="ml-1 flex flex-col">
									<div className={cn("flex items-center")}>
										<div className={cn("ml-2 flex flex-col")}>
											<p
												className={cn("truncate text-sm", color ? "" : "text-white")}
												style={color !== null ? { color: `#${color}` } : {}}
											>
												{member.member.nickname ?? member.user.globalNickname ?? member.user.username}
											</p>
											{/* {member.customStatus && <p className="text-xs text-gray-500 truncate">{member.customStatus}</p>} */}
										</div>
										{(member.user.isBot || member.user.isSystem) && (
											<UserTag>{member.user.isBot ? t("tags.bot") : t("tags.system")}</UserTag>
										)}
									</div>
								</div>
							</div>
						</div>
					</ContextMenuHandler>
				</div>
			</PopOverData>
		</>
	);
};

export default MemberItem;
