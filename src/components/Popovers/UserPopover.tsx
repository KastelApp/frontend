import AllBadges from "@/badges/AllBadges.tsx";
import ContextMenuHandler from "@/components/ContextMenuHandler.tsx";
import UserTag from "@/components/UserTag.tsx";
import { useTranslationStore } from "@/wrapper/Stores.tsx";
import { Member } from "@/wrapper/Stores/Members.ts";
import { Role } from "@/wrapper/Stores/RoleStore.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { Avatar, Badge, Divider, Input, Spinner } from "@nextui-org/react";
import { SendHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";

const UserPopover = ({
	member,
	onClick,
}: {
	member: {
		member: (Omit<Member, "roles"> & { roles: Role[]; }) | null;
		user: User;
	};
	onClick?: () => void;
}) => {
	const hasBanner = true;

	const { t } = useTranslationStore();
	const fetchProfile = useUserStore((s) => s.fetchProfile);
	const [loading, setLoading] = useState(!member.user.metaData.bioless);
	const getAvatarUrl = useUserStore((s) => s.getAvatarUrl);
	const getDefaultAvatar = useUserStore((s) => s.getDefaultAvatar);

	useEffect(() => {
		if (loading) {
			fetchProfile(member.user.id).then(() => {
				setTimeout(() => {
					setLoading(false);
				}, 75);
			});
		}
	}, []);

	if (loading) {
		return <Spinner />;
	}

	return (
		<div className="z-[200] w-72 rounded-sm">
			{hasBanner && (
				<div
					className="relative h-24 bg-cover bg-center min-w-72 rounded-t-lg"
					style={{ backgroundImage: "url(https://placehold.co/2048x2048)" }}
				/>
			)}
			<div className="relative flex items-end justify-between p-2 z-50">
				<Badge
					content={""}
					placement="bottom-right"
					color="success"
					className=" mb-3 mr-1 mm-hw-4"
				>
					<div
						className="group relative cursor-pointer transition-opacity duration-300 ease-in-out -mt-10"
						onClick={onClick}
					>
						<Avatar
							src={getAvatarUrl(member.user.id, member.user.avatar) ?? getDefaultAvatar(member.user.id)}
							alt="User Avatar"
							className="inset-0 mm-hw-20 border-3 border-transparent rounded-full"
							imgProps={{ className: "transition-none" }}
						/>
						<p className="absolute inset-0 !z-20 ml-1 mt-5 hidden w-full min-w-full items-center justify-center text-2xs font-bold text-white group-hover:block">
							View Profile
						</p>
						<div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50"></div>
					</div>
				</Badge>
				<div className="rounded-md">
					<AllBadges privateFlags={member.user.flags} publicFlags={member.user.publicFlags} size={18} />
				</div>
			</div>
			<Divider className="mt-2" />
			<div className="mb-2 mt-2 ml-2 mr-2 bg-background p-0 rounded-md">
				<div className="max-h-[85vh] overflow-y-auto p-3">
					<div>
						<span className="text-lg font-semibold text-white flex items-center">
							{member.member?.nickname ?? member.user.globalNickname ?? member.user.username}
							{(member.user.isBot || member.user.isSystem) && (
								<UserTag>
									{member.user.isBot ? t("tags.bot") : t("tags.system")}
								</UserTag>
							)}
						</span>
						<p className="text-sm text-gray-300">
							{member.user.username}#{member.user.tag}
						</p>
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
							<div className="flex select-none flex-wrap -ml-1 mt-2">
								{member.member.roles.map((role) => {

									const color = role.color === 0 ? "CFDBFF" : role.color.toString(16).padStart(6, "0");

									return (
										<ContextMenuHandler identifier="role" key={role.id} items={[{
											label: <p className="text-danger">Remove role</p>,
											onClick: () => console.log("Remove Role"),
										}, {
											label: "Copy Role ID",
											onClick: () => {
												navigator.clipboard.writeText(role.id);
											}
										}]}>

											<div
												className="border-1 group ml-1 mb-2 inline-flex items-center rounded-sm text-sm font-medium transition-all duration-200 ease-in-out hover:opacity-80"
												style={{
													borderColor: color ? `#${color}` : undefined,
												}}
											>
												<span className="rounded-full mm-hw-3 ml-1 mr-1" style={{
													backgroundColor: color ? `#${color}` : undefined,
												}} />
												<span className="mr-1 truncate max-w-[100px]" style={{
													color: color ? `#${color}` : undefined,
												}}>{role.name}</span>
												<X
													size={14}
													className="mr-1 cursor-pointer opacity-0 transition-opacity duration-200 group-hover:opacity-100"
												/>
											</div>
										</ContextMenuHandler>
									);
								})}
							</div>
						</div>
					)}
				</div>
				{!member.user.isClient && !member.user.isSystem && !member.user.isGhost && (
					<Input
						placeholder={`Message @${member.user.username}`}
						className="mt-2 p-1.5"
						radius="sm"
						endContent={<SendHorizontal color="#008da5" className="cursor-pointer" />}
					/>
				)}
			</div>
		</div>
	);
};

export default UserPopover;