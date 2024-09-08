import { useAPIStore, useGuildSettingsStore, useTranslationStore } from "@/wrapper/Stores.ts";
import {
	Avatar,
	Badge,
	Checkbox,
	Chip,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Spinner,
	useDisclosure,
} from "@nextui-org/react";
import { memo, useEffect, useRef, useState } from "react";
import cn from "@/utils/cn.ts";
import UserPopover from "../Popovers/UserPopover.tsx";
import UserModal from "../Modals/UserModal.tsx";
import { useRouter } from "next/router";
import { Role, useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import { Member, useMemberStore } from "@/wrapper/Stores/Members.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import deepEqual from "fast-deep-equal";
import TypingDots from "../MessageContainer/TypingDats.tsx";
import { usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import ContextMenuHandler from "@/components/ContextMenuHandler.tsx";
import { Hammer, Wine } from "lucide-react";

interface Section {
	name: string; // ? two defaults, "offline" and "online"
	members: {
		member: {
			member: Omit<Member, "roles"> & { roles: Role[] };
			user: User;
		};
		color: string | null;
	}[];
	position: number;
}

const MemberItem = memo(
	({
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
		const [loading, setLoading] = useState(false);
		const [isOpen, setIsOpen] = useState(false);

		const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
		const { t } = useTranslationStore();
		const [typing, setTyping] = useState(false);
		const { getChannel } = usePerChannelStore();

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
				<UserModal isOpen={isModalOpen} onClose={onClose} user={member.user} />
				<Popover
					showArrow
					placement="left"
					key={member.user.id}
					isOpen={isOpen}
					onOpenChange={setIsOpen}
					shouldCloseOnInteractOutside={() => {
						setIsOpen(false);
						return false;
					}}
					style={{
						zIndex: "15",
					}}
					radius="sm"
					className="rounded-lg"
				>
					<PopoverTrigger>
						<div
							className="justify-=between relative flex h-12 w-full max-w-48 cursor-pointer items-center rounded-lg px-2 hover:bg-slate-800"
							onClick={async () => {
								if (member.user.metaData.bioless || typeof member.user.bio === "string") {
									setLoading(false);

									return;
								}

								setLoading(true);

								const api = useAPIStore.getState().api;

								const profile = await api.get<
									unknown,
									{
										// TODO: Add connections (Discord, Twitter (X), Github, Steam, Spotify (Not sure if we can do this one), Reddit, Youtube, Twitch)
										bio: string | null;
										connections: unknown[];
										mutualFriends: string[];
										mutualGuilds: string[];
									}
								>({
									url: `/users/${member.user.id}/profile`,
								});

								if (profile.ok && profile.status === 200) {
									useUserStore.getState().updateUser({
										bio: profile.body.bio,
										id: member.user.id,
										metaData: {
											bioless: typeof profile.body.bio !== "string",
										},
									});
								}

								setTimeout(() => setLoading(false), 75);
							}}
						>
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
										src={
											useUserStore.getState().getAvatarUrl(member.user.id, member.user.avatar) ??
											useUserStore.getState().getDefaultAvatar(member.user.id)
										}
										size="sm"
										imgProps={{ className: "transition-none" }}
									/>
								</Badge>
								<div className="ml-1 flex flex-col">
									<div className={cn("flex items-center")}>
										<div className={cn("ml-2 flex flex-col", member.user.tag ? "max-w-[6.75rem]" : "max-w-36")}>
											<p
												className={cn("truncate text-sm", color ? "" : "text-white")}
												style={color !== null ? { color: `#${color}` } : {}}
											>
												{member.member.nickname ?? member.user.globalNickname ?? member.user.username}
											</p>
											{/* {member.customStatus && <p className="text-xs text-gray-500 truncate">{member.customStatus}</p>} */}
										</div>
										{(member.user.isBot || member.user.isSystem) && (
											<Chip
												color="success"
												variant="flat"
												className="ml-1 h-4 w-1 rounded-sm p-0 text-[10px]"
												radius="none"
											>
												{member.user.isBot ? t("tags.bot") : t("tags.system")}
											</Chip>
										)}
									</div>
								</div>
							</div>
						</div>
					</PopoverTrigger>
					<PopoverContent>
						{loading ? (
							<Spinner />
						) : (
							<UserPopover
								member={{
									user: member.user,
									member: member.member,
								}}
								onClick={() => {
									onOpen();
									setIsOpen(false);
								}}
							/>
						)}
					</PopoverContent>
				</Popover>
			</>
		);
	},
);

const MemberBar = () => {
	const router = useRouter();

	const { guildSettings: rawGuildSettings } = useGuildSettingsStore();

	const [currentGuildId, , channelId] = router?.query?.slug as string[];
	const guildSettings = rawGuildSettings[currentGuildId ?? ""] ?? { memberBarHidden: false };

	const roleRef = useRef<Role[] | null>(null);
	const memberRef = useRef<Member[] | null>(null);

	const { getUser } = useUserStore();

	const [sections, setSections] = useState<Section[]>([]);

	const sectionsRef = useRef<Section[]>([]);

	useEffect(() => {
		sectionsRef.current = sections;
	}, [sections]);

	useEffect(() => {
		const roleSubscribe = useRoleStore.subscribe((s) => {
			const roles = s.getRoles(currentGuildId);

			if (deepEqual(roles, roleRef.current)) return; // ? its the same nothing changed

			roleRef.current = roles;
		});

		const memberSubscribe = useMemberStore.subscribe((s) => {
			const members = s.getMembers(currentGuildId);

			if (deepEqual(members, memberRef.current)) return;

			memberRef.current = members;
		});

		const userSubscribe = useUserStore.subscribe((state) => {
			// ? in sections if we find a user that is changed, we update the user
			const newSections = [...sectionsRef.current];

			for (const section of newSections) {
				for (const member of section.members) {
					const oldUser = member.member.user;
					const newUser = state.users.find((user) => user.id === oldUser.id);

					if (!newUser) {
						// ? the user is uncached? we should remove them from the member list then
						section.members = section.members.filter((m) => m.member.user.id !== oldUser.id);

						continue;
					}

					if (deepEqual(oldUser, newUser)) continue; // ? the user is the same so we just skip

					member.member.user = newUser;
				}
			}

			if (deepEqual(newSections, sectionsRef.current)) return; // ? sections are the same nothing to change

			setSections(newSections);
		});

		return () => {
			roleSubscribe();
			memberSubscribe();
			userSubscribe();
		};
	}, []);

	const sort = async (members: Member[], roles: Role[]) => {
		const defaultSections: Section[] = [
			{
				name: "Offline",
				members: [],
				position: 0,
			},
			{
				name: "Online",
				members: [],
				position: 1,
			},
		];

		for (const member of members) {
			// ? defaultSections[0] = offline
			// ? defaultSections[1] = online
			// ? defaultSections[number] = role
			const foundUser = getUser(member.userId);

			const topColorRole = member.roles
				.map((roleId) => roles.find((role) => role.id === roleId))
				.filter((role) => role !== undefined && role.color !== 0)
				.sort((a, b) => a!.position - b!.position)
				.reverse()[0]?.color;

			member.status = "online";

			if (member.status === "offline") {
				defaultSections[0].members.push({
					color: topColorRole ? topColorRole.toString(16) : null,
					member: {
						member: {
							...member,
							roles: member.roles
								.map((roleId) => roles.find((role) => role.id === roleId))
								.filter((role) => role !== null && role !== undefined),
						},
						user: foundUser!,
					},
				});

				continue;
			}

			// ? if their only role is the everyone role push to online
			if (member.roles.length === 1 && member.roles[0] === "everyone") {
				defaultSections[1].members.push({
					color: topColorRole ? topColorRole.toString(16) : null,
					member: {
						member: {
							...member,
							roles: member.roles
								.map((roleId) => roles.find((role) => role.id === roleId))
								.filter((role) => role !== null && role !== undefined),
						},
						user: foundUser!,
					},
				});

				continue;
			}

			// ? get their top role, if its hoisted then push the role into sections if it does not exist, and then push the user there
			// ? If we could not find a hoisted role, push them to online
			const topRole = member.roles
				.map((roleId) => roles.find((role) => role.id === roleId))
				.filter((role) => role !== undefined && role.color !== 0)
				.sort((a, b) => a!.position - b!.position)
				.reverse()[0];

			if (!topRole) {
				defaultSections[1].members.push({
					color: topColorRole ? topColorRole.toString(16) : null,
					member: {
						member: {
							...member,
							roles: member.roles
								.map((roleId) => roles.find((role) => role.id === roleId))
								.filter((role) => role !== null && role !== undefined),
						},
						user: foundUser!,
					},
				});

				continue;
			}

			if (topRole.hoisted) {
				const section = defaultSections.find((section) => section.name === topRole?.name);

				if (!section) {
					defaultSections.push({
						name: topRole.name,
						members: [
							{
								color: topColorRole ? topColorRole.toString(16) : null,
								member: {
									member: {
										...member,
										roles: member.roles
											.map((roleId) => roles.find((role) => role.id === roleId))
											.filter((role) => role !== null && role !== undefined),
									},
									user: foundUser!,
								},
							},
						],
						position: topRole.position,
					});

					continue;
				}

				section.members.push({
					color: topColorRole ? topColorRole.toString(16) : null,
					member: {
						member: {
							...member,
							roles: member.roles
								.map((roleId) => roles.find((role) => role.id === roleId))
								.filter((role) => role !== null && role !== undefined),
						},
						user: foundUser!,
					},
				});

				continue;
			}

			let found = false;

			for (let i = topRole.position - 1; i >= 0; i--) {
				const role = roles.find((role) => role.position === i);

				if (!role) continue;

				const section = defaultSections.find((section) => section.name === role.name);

				if (!section) continue;

				section.members.push({
					color: topColorRole ? topColorRole.toString(16) : null,
					member: {
						member: {
							...member,
							roles: member.roles
								.map((roleId) => roles.find((role) => role.id === roleId))
								.filter((role) => role !== null && role !== undefined),
						},
						user: foundUser!,
					},
				});

				found = true;

				break;
			}

			if (!found) {
				defaultSections[1].members.push({
					color: topColorRole ? topColorRole.toString(16) : null,
					member: {
						member: {
							...member,
							roles: member.roles
								.map((roleId) => roles.find((role) => role.id === roleId))
								.filter((role) => role !== null && role !== undefined),
						},
						user: foundUser!,
					},
				});
			}
		}

		defaultSections.sort((a, b) => a.position - b.position).reverse();

		const filtered = defaultSections.filter((section) => section.members.length > 0);

		setSections((prev) => {
			if (deepEqual(prev, filtered)) return prev;

			return filtered;
		});
	};

	useEffect(() => {
		const roles = useRoleStore.getState().getRoles(currentGuildId);
		const members = useMemberStore.getState().getMembers(currentGuildId);

		if (!deepEqual(roles, roleRef.current) || !deepEqual(members, memberRef.current)) {
			roleRef.current = roles;
			memberRef.current = members;

			sort(members, roles);
		}
	}, [currentGuildId]);

	return (
		<div
			className={cn(
				"m-0 flex h-screen w-full flex-row justify-end overflow-y-auto",
				guildSettings.memberBarHidden ? "hidden" : "",
			)}
		>
			<div className="fixed m-0 h-screen w-52 overflow-y-auto !overflow-x-hidden bg-lightAccent transition-opacity duration-300 ease-in-out dark:bg-darkAccent">
				<div className="ml-2 flex w-full flex-col last:mb-12">
					{sections.map((section, index) => (
						<div key={index} className="last:mb-24">
							<p className="ml-2 mt-2 select-none text-xs text-white">
								{section.name} — {section.members.length}
							</p>
							{section.members.map((member, index) => (
								<ContextMenuHandler
									key={index}
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
											onClick: () => {
												navigator.clipboard.writeText(member.member.user.id);
											},
										},
									]}
								>
									<MemberItem key={index} member={member.member} color={member.color} channelId={channelId} />
								</ContextMenuHandler>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MemberBar;

export { MemberBar, MemberItem, type Section };
