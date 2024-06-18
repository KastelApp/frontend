import { useGuildSettingsStore, useTranslationStore } from "@/wrapper/Stores.ts";
import {
	Avatar,
	Badge,
	Chip,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Spinner,
	useDisclosure,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import UserPopover from "../Popovers/UserPopover.tsx";
import UserModal from "../Modals/UserModal.tsx";
import { useRouter } from "next/router";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import { Member, useMemberStore } from "@/wrapper/Stores/Members.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import deepEqual from "fast-deep-equal";

interface Section {
	name: string; // ? two defaults, "offline" and "online"
	members: {
		member: {
			member: Member;
			user: User;
		};
		color: string | null;
	}[];
	position: number;
}

const MemberItem = ({ member, color }: { member: {
	member: Member;
	user: User;
}; color: string | null; }) => {
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();

	const { t } = useTranslationStore();

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
			>
				<PopoverTrigger>
					<div
						className="flex items-center justify-between w-full h-12 px-2 cursor-pointer rounded-lg hover:bg-slate-800 relative max-w-48"
						onClick={() => {
							setLoading(true);

							setTimeout(() => {
								setLoading(false);
							}, 1000);
						}}
					>
						<div className="flex items-center">
							<Badge
								content={""}
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
								className="mb-1"
							>
								<Avatar src={member.user.avatar ?? useUserStore.getState().getDefaultAvatar(member.user.id)} size="sm" imgProps={{ className: "transition-none" }} />
							</Badge>
							<div className="flex flex-col ml-1">
								<div className={twMerge("flex items-center")}>
									<div className={twMerge("flex flex-col ml-2", member.user.tag ? "max-w-[6.75rem]" : "max-w-36")}>
										<p
											className={twMerge("truncate text-sm", color ? "" : "text-white")}
											style={color !== null ? { color } : {}}
										>
											{member.user.username}
										</p>
										{/* {member.customStatus && <p className="text-xs text-gray-500 truncate">{member.customStatus}</p>} */}
									</div>
									{(member.user.isBot || member.user.isSystem) && (
										<Chip
											color="success"
											variant="flat"
											className="ml-1 w-1 p-0 h-4 text-[10px] rounded-sm"
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
							member={member}
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
};

const MemberBar = () => {
	const router = useRouter();

	const { guildSettings: rawGuildSettings } = useGuildSettingsStore();

	const currentGuildId = router.query.guildId as string;

	const guildSettings = rawGuildSettings[currentGuildId ?? ""] ?? { memberBarHidden: false };

	const roleRef = useRef(useRoleStore.getState().getRoles(currentGuildId));
	const memberRef = useRef(useMemberStore.getState().getMembers(currentGuildId));

	const roles = roleRef.current;
	const members = memberRef.current;

	useEffect(() => {
		const roleSubscribe = useRoleStore.subscribe((s) => {
			const roles = s.getRoles(currentGuildId);

			if (deepEqual(roles, roleRef.current)) return;

			roleRef.current = roles;
		});

		const memberSubscribe = useMemberStore.subscribe((s) => {
			const members = s.getMembers(currentGuildId);

			if (deepEqual(members, memberRef.current)) return;

			memberRef.current = members;
		});

		return () => {
			roleSubscribe();
			memberSubscribe();
		};
	}, []);

	useEffect(() => {
		const roles = useRoleStore.getState().getRoles(currentGuildId);
		const members = useMemberStore.getState().getMembers(currentGuildId);

		if (!deepEqual(roles, roleRef.current)) {
			roleRef.current = roles;
		}

		if (!deepEqual(members, memberRef.current)) {
			memberRef.current = members;
		}
	}, [currentGuildId]);



	const { getUser } = useUserStore();

	const [sections, setSections] = useState<Section[]>();

	const sort = async () => {
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
			const foundUser = await getUser(member.userId);

			const topColorRole = member.roles
				.map((roleId) => roles.find((role) => role.id === roleId))
				.filter((role) => role !== undefined)
				.sort((a, b) => a!.position - b!.position)
				.reverse()[0]?.color;

			member.status = "online";

			if (member.status === "offline") {
				defaultSections[0].members.push({
					color: topColorRole ? topColorRole.toString(16) : null,
					member: {
						member,
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
						member,
						user: foundUser!,
					},
				});

				continue;
			}

			// ? get their top role, if its hoisted then push the role into sections if it does not exist, and then push the user there
			// ? If we could not find a hoisted role, push them to online
			const topRole = member.roles
				.map((roleId) => roles.find((role) => role.id === roleId))
				.filter((role) => role !== undefined && role.hoisted)
				.sort((a, b) => a!.position - b!.position)
				.reverse()[0];

			if (!topRole) {
				defaultSections[1].members.push({
					color: topColorRole ? topColorRole.toString(16) : null,
					member: {
						member,
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
									member,
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
						member,
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
						member,
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
						member,
						user: foundUser!,
					},
				});
			}
		}

		defaultSections.sort((a, b) => a.position - b.position).reverse();

		setSections(defaultSections.filter((section) => section.members.length > 0));
	};

	useEffect(() => {
		sort();
	}, [roles, members]);

	return (
		<div
			className={twMerge(
				"flex flex-row w-full h-screen m-0 overflow-y-auto justify-end",
				guildSettings.memberBarHidden ? "hidden" : "",
			)}
		>
			<div className="fixed w-52 h-screen m-0 overflow-y-auto bg-accent transition-opacity ease-in-out duration-300 !overflow-x-hidden">
				<div className="flex w-full flex-col ml-2 last:mb-12">
					{sections?.map((section, index) => (
						<div key={index}>
							<p className="text-white text-xs ml-2 mt-2">
								{section.name} — {section.members.length}
							</p>
							{section.members.map((member, index) => (
								<MemberItem key={index} member={member.member} color={member.color} />
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MemberBar;

export {
	MemberBar,
	MemberItem,
	type Section
}