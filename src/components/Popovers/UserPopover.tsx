import AllBadges from "@/badges/AllBadges.tsx";
import { Member } from "@/wrapper/Stores/Members.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { Avatar, Badge, Card, CardBody, Divider, Input } from "@nextui-org/react";
import { X } from "lucide-react";

const UserPopover = ({ member, onClick }: {
	member: {
		member: Member;
		user: User;
	}; onClick?: () => void;
}) => {
	return (
		<div>
			<div className="rounded-sm p-0 w-[18.70rem]">
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
							className="mb-2 right-1"
						>
							<div
								className="relative cursor-pointer transition-opacity duration-300 ease-in-out group"
								onClick={onClick}
							>
								<Avatar src={member.user.avatar ?? useUserStore.getState().getDefaultAvatar(member.user.id)} alt="User Avatar" className="w-16 h-16 inset-0" imgProps={{ className: "transition-none" }} />
								<p className="hidden group-hover:block text-white font-bold text-2xs absolute inset-0 ml-1 mt-5 w-full min-w-full items-center justify-center !z-20">
									View Profile
								</p>
								<div className="group-hover:bg-opacity-50 rounded-full absolute inset-0 bg-black bg-opacity-0"></div>
							</div>
						</Badge>
						<div className="flex items-end justify-end">
							<div className="bg-[#131315] rounded-md p-1 ml-[-10px]">
								<AllBadges privateFlags={member.user.flags} publicFlags={member.user.publicFlags} size={18} />
							</div>
						</div>
					</div>
					<Divider className="mt-2" />
				</div>

				<div>
					<Card className="mt-2 mb-2 rounded-sm" isBlurred radius="none">
						<CardBody className="p-0">
							<div className="overflow-y-auto p-3 max-h-[85vh]">
								<div>
									<p className="text-white text-lg font-semibold">{member.user.username}</p>
									<p className="text-gray-300 text-sm">
										{member.user.username}#{member.user.tag}
									</p>
									{/* {member.customStatus && <p className="text-gray-200 text-md mt-2">{member.customStatus}</p>} */}
								</div>
								<Divider className="mt-2" />
								<div className="mt-2">
									<span className="text-white font-bold">About Me</span>
									<p className="text-gray-300 mt-2">{"Hey"}</p>
								</div>
								{member.member.roles.length > 1 && (
									<div className="mt-2">
										<span className="text-white font-bold">Roles</span>
										<div className="flex flex-wrap select-none">
											{/* {member.roles.map((role) => (
										<div
											className="flex flex-wrap bg-accent border-gray-400 border rounded-md px-2 py-0 mt-2 mr-1 group"
											key={role}
										>
											<span className="flex box-border rounded-full border-background w-3.5 h-3.5 min-w-3.5 min-h-3.5 px-1 mt-[0.1rem] mr-1" style={{
												backgroundColor: "green",
											}}>
												<X size={14} className="hidden group-hover:block" strokeWidth={8} color="gray" />
											</span>
											<span className="text-white text-xs">{role}</span>
										</div>
									))} */}
										</div>
									</div>
								)}
							</div>
							{!member.user.isClient && (
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
