import AllBadges from "@/badges/AllBadges.tsx";
import {
	Modal,
	ModalContent,
	ModalBody,
	Button,
	Badge,
	Avatar,
	Divider,
	Card,
	CardBody,
	useDisclosure,
} from "@nextui-org/react";
import { EllipsisVertical } from "lucide-react";
import BaseContextMenu from "../Dropdowns/BaseContextMenu.tsx";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";

const UserModal = ({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user: User }) => {
	const userId = useUserStore((s) => s.getCurrentUser()?.id);

	if (!user) return null;

	return (
		<>
			<Modal
				size={"2xl"}
				isOpen={isOpen}
				onClose={onClose}
				hideCloseButton
				placement="top-center"
				className="z-50 w-[100vw]"
			>
				<ModalContent>
					<ModalBody>
						<div className="w-full min-w-full rounded-lg p-0">
							<div>
								<div className="flex items-end justify-between p-2">
									<div className="flex items-end justify-between">
										<Badge
											content={""}
											placement="bottom-right"
											className="mb-2 mr-2 h-6 w-6"
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
										>
											<Avatar
												src={
													useUserStore.getState().getAvatarUrl(user.id, user.avatar) ??
													useUserStore.getState().getDefaultAvatar(user.id)
												}
												alt="User Avatar"
												className="mt-4 h-24 w-24"
												imgProps={{
													className: "transition-none",
												}}
											/>
										</Badge>
										<div>
											<AllBadges privateFlags={user.flags} publicFlags={user.publicFlags} size={20} />
										</div>
									</div>
									{userId !== user.id && (
										<div className="flex items-start justify-start">
											<Button
												color="success"
												className="max-h-8 min-h-8 min-w-36 max-w-36 rounded-md text-charcoal-600"
												radius="none"
											>
												Send Friend Request
											</Button>
											<BaseContextMenu
												inverse
												values={[
													{
														label: "Block",
														props: {
															color: "danger",
															variant: "flat",
															className: "text-danger",
														},
													},
												]}
												placement="right"
											>
												<EllipsisVertical size={24} className="mt-1 cursor-pointer" />
											</BaseContextMenu>
										</div>
									)}
								</div>
								<Divider className="mb-4 mt-2" />
								<div>
									<Card className="mb-2 mt-2" isBlurred>
										<CardBody className="max-h-[85vh] overflow-y-auto">
											<div>
												<p className="text-xl font-semibold text-white">{user.username}</p>
												<p className="text-sm text-gray-300">
													{user.username}#{user.tag}
												</p>
												{/* {member.customStatus && <p className="text-gray-200 text-md mt-2">{member.customStatus}</p>} */}
											</div>
											{user.bio && (
												<>
													<Divider className="mt-2" />
													<div className="mt-2">
														<span className="font-bold text-white">About Me</span>
														<p className="overflow-hidden whitespace-pre-line break-words text-gray-300">{user.bio}</p>
													</div>
												</>
											)}
										</CardBody>
									</Card>
								</div>
							</div>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

const ControlledUserModal = ({
	children,
	onClick,
	className,
	user,
}: {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
	user: User;
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<div
				onClick={() => {
					onOpen();

					if (onClick) {
						onClick();
					}
				}}
				className={className}
			>
				{children}
			</div>
			<UserModal isOpen={isOpen} onClose={onClose} user={user} />
		</>
	);
};

export default UserModal;

export { ControlledUserModal };
