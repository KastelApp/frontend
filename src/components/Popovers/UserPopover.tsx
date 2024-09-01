import AllBadges from "@/badges/AllBadges.tsx";
import { Member } from "@/wrapper/Stores/Members.ts";
import { Role } from "@/wrapper/Stores/RoleStore.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { Avatar, Badge, Card, CardBody, Divider, Input } from "@nextui-org/react";
import { X } from "lucide-react";

const UserPopover = ({
	member,
	onClick,
}: {
	member: {
		member: (Omit<Member, "roles"> & { roles: Role[] }) | null;
		user: User;
	};
	onClick?: () => void;
}) => {
	return (
		<div>
			<div className="z-[200] w-[18.70rem] rounded-sm p-0">
				<div>
					<div className="flex items-end justify-between p-2">
						<Badge
							content={""}
							placement="bottom-right"
							size="lg"
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
							className="right-1 mb-2"
						>
							<div
								className="group relative cursor-pointer transition-opacity duration-300 ease-in-out"
								onClick={onClick}
							>
								<Avatar
									src={
										useUserStore.getState().getAvatarUrl(member.user.id, member.user.avatar) ??
										useUserStore.getState().getDefaultAvatar(member.user.id)
									}
									alt="User Avatar"
									className="inset-0 h-16 w-16"
									imgProps={{ className: "transition-none" }}
								/>
								<p className="absolute inset-0 !z-20 ml-1 mt-5 hidden w-full min-w-full items-center justify-center text-2xs font-bold text-white group-hover:block">
									View Profile
								</p>
								<div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50"></div>
							</div>
						</Badge>
						<div className="rounded-md bg-[#131315] p-1">
							<AllBadges privateFlags={member.user.flags} publicFlags={member.user.publicFlags} size={18} />
						</div>
					</div>
					<Divider className="mt-2" />
				</div>

				<div>
					<Card className="mb-2 mt-2 rounded-sm" isBlurred radius="none">
						<CardBody className="p-0">
							<div className="max-h-[85vh] overflow-y-auto p-3">
								<div>
									<p className="text-lg font-semibold text-white">
										{member.member?.nickname ?? member.user.globalNickname ?? member.user.username}
									</p>
									<p className="text-sm text-gray-300">
										{member.user.username}#{member.user.tag}
									</p>
									{/* {member.customStatus && <p className="text-gray-200 text-md mt-2">{member.customStatus}</p>} */}
								</div>
								{(member.user.bio || (member.member && member.member.roles.length > 1)) && <Divider className="mt-2" />}
								{member.user.bio && (
									<div className="mt-2">
										<span className="font-bold text-white">About Me</span>
										<p className="mt-2 overflow-hidden whitespace-pre-line break-words text-gray-300">
											{member.user.bio}
										</p>
									</div>
								)}
								{member.member && member.member.roles.length > 1 && (
									<div className="mt-2">
										<span className="font-bold text-white">Roles</span>
										<div className="flex select-none flex-wrap">
											{member.member.roles.map((role) => (
												<div
													className="group mr-1 mt-2 flex flex-wrap items-center rounded-md border border-gray-400 bg-lightAccent px-2 dark:bg-darkAccent"
													key={role.id}
												>
													<span
														className="mr-1 box-border flex h-3 min-h-3 w-3 min-w-3 items-center rounded-full border-background"
														style={{
															backgroundColor: role.color ? `#${role.color.toString(16).padStart(6, "0")}` : "gray",
														}}
													>
														<X size={14} className="hidden group-hover:block" strokeWidth={3} color="white" />
													</span>
													<span className="text-xs text-white">{role.name}</span>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
							{!member.user.isClient && !member.user.isSystem && !member.user.isGhost && (
								<Input
									placeholder={`Message @${member.user.username}`}
									className="mt-2 p-1.5"
									// value={message}
									// onChange={(e) => setMessage(e.target.value)}
									// onKeyDown={handleKeyDown}
									radius="sm"
								/>
							)}
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default UserPopover;
