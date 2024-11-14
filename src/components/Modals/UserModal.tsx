import AllBadges from "@/badges/AllBadges.tsx";
import { Button, Badge, Avatar, Divider, Tabs, Tab, Spinner } from "@nextui-org/react";
import { Ellipsis, Send } from "lucide-react";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { Member } from "@/wrapper/Stores/Members.ts";
import UserTag from "@/components/UserTag.tsx";
import { useTranslationStore } from "@/wrapper/Stores.tsx";
import MessageMarkDown from "@/components/Message/Markdown/MarkDown.tsx";
import cn from "@/utils/cn.ts";
import { useEffect, useState } from "react";
import { useRelationshipsStore } from "@/wrapper/Stores/RelationshipsStore.ts";
import { useHubStore } from "@/wrapper/Stores/HubStore.ts";
import Link from "@/components/Link.tsx";
import { Routes } from "@/utils/Routes.ts";

const UserModal = ({ user, member }: { user: User; member?: Member; }) => {
	const hasBanner = true;

	const { t } = useTranslationStore();
	const getAvatarUrl = useUserStore((s) => s.getAvatarUrl);
	const getDefaultAvatar = useUserStore((s) => s.getDefaultAvatar);
	const fetchProfile = useUserStore((s) => s.fetchProfile);
	const relationships = useRelationshipsStore((s) => s.getFriendRelationships());
	const [loading, setLoading] = useState(!user.metaData.bioless);
	const foundFriend = relationships.find((r) => r.userId === user.id);
	const getHub = useHubStore((s) => s.getHub);

	useEffect(() => {
		if (loading) {
			fetchProfile(user.id).then(() => {
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
		<div className="z-[200]">
			{hasBanner && (
				<div>
					<div
						className="relative h-36 min-w-72 rounded-t-lg bg-cover bg-center"
						style={{ backgroundImage: "url(https://placehold.co/2048x2048)" }}
					/>

					<Ellipsis className="absolute right-1 top-1 cursor-pointer rounded-lg bg-darkAccent/50 p-1" />
				</div>
			)}

			<div className="relative z-50 flex items-center p-2">
				<Badge content={""} placement="bottom-right" color="success" className="mb-3 mr-1 mm-hw-5">
					<Avatar
						src={getAvatarUrl(user.id, user.avatar) ?? getDefaultAvatar(user.id)}
						alt="User Avatar"
						className={cn("inset-0 rounded-full border-3 border-transparent mm-hw-20", hasBanner ? "-mt-10" : "mb-0")}
						imgProps={{ className: "transition-none" }}
					/>
				</Badge>
				<div className="rounded-md">
					<AllBadges privateFlags={user.flags} publicFlags={user.publicFlags} size={18} />
				</div>

				{!user.isClient && (
					<div className="ml-auto flex items-center justify-center">
						{!foundFriend && (
							<Button size="sm" variant="flat" color="success">
								Send Friend Request
							</Button>
						)}
						<Button
							size="sm"
							variant="flat"
							color="primary"
							className="ml-1 flex min-w-8 items-center justify-center px-2"
						>
							<Send size={16} className="text-primary" />
							{foundFriend && "Send a message"}
						</Button>
					</div>
				)}
			</div>

			<div className="max-h-[85vh] overflow-y-auto p-3">
				<div>
					<span className="flex items-center text-lg font-semibold text-white">
						{member?.nickname ?? user.globalNickname ?? user.username}
						{(user.isBot || user.isSystem) && <UserTag>{user.isBot ? t("tags.bot") : t("tags.system")}</UserTag>}
					</span>
					<p className="text-sm text-gray-300">
						{user.username}#{user.tag}
					</p>
				</div>
			</div>

			<Divider className="mt-2" />
			<Tabs
				size="sm"
				classNames={{
					tab: "px-1 bg-background",
					tabList: "bg-background",
					cursor: "dark:bg-charcoal-500",
					panel: "ml-3 mr-3 rounded-md mb-3 bg-background mt-1",
				}}
				radius="sm"
				className="mt-2 flex items-center justify-center align-middle"
			>
				<Tab title="Profile">
					<span className="ml-2 overflow-hidden whitespace-pre-wrap break-words text-sm text-white">
						<MessageMarkDown disabledRules={["heading"]}>{user.bio ?? "No bio set."}</MessageMarkDown>
					</span>
				</Tab>
				{!user.isClient && (
					<Tab
						title={`Mutual Friends ${user.mutualFriends && user.mutualFriends?.length > 0 ? `(${user.mutualFriends.length})` : ""}`}
					>
						{JSON.stringify(user.mutualFriends)}
					</Tab>
				)}
				{!user.isClient && (
					<Tab
						title={`Mutual Hubs ${user.mutualHubs && user.mutualHubs.length > 0 ? `(${user.mutualHubs.length})` : ""}`}
					>
						<div className="flex flex-col items-start px-2">
							{user.mutualHubs?.map((hubId) => {
								const foundHub = getHub(hubId);

								return (
									<Link href={Routes.hubChannels(hubId)} key={hubId} className="active:scale-[0.98] transition-[transform,colors] cursor-pointer flex items-center space-x-2 rounded-md hover:bg-charcoal-600 w-full p-1 duration-300 ease-in-out">
										<Avatar
											src={"/icon.png"}
											alt={foundHub?.name}
											className="rounded-full border-2 border-transparent w-9 h-9"
										/>
										<p className="text-white font-medium">{foundHub?.name}</p>
									</Link>
								);
							})}
						</div>
					</Tab>

				)}
				<Tab title="Connections" isDisabled>
					hi4
				</Tab>
			</Tabs>
		</div>
	);
};

export default UserModal;
