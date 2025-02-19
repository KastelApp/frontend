import Link from "@/components/Link.tsx";
import HubModal from "@/components/Modals/CreateHub.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";
import { Routes } from "@/utils/Routes.ts";
import { useHubSettingsStore, useTranslationStore } from "@/wrapper/Stores.tsx";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { Hub, useHubStore } from "@/wrapper/Stores/HubStore.ts";
import {
	Avatar,
	Badge,
	Button,
	Chip,
	cn,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Tab,
	Tabs,
	useDisclosure,
} from "@nextui-org/react";
import { MoreHorizontal } from "lucide-react";
import { useCallback } from "react";

interface HubCardProps {
	href?: string;
	children?: React.ReactNode;
	hub?: Hub;
	badgeCount?: number;
}

const HubCard = ({ children, hub, href, badgeCount }: HubCardProps) => {
	const { t } = useTranslationStore();

	const PossiblyLink = ({ children }: { children: React.ReactNode }) => {
		if (!href) return <>{children}</>;

		return <Link href={href}>{children}</Link>;
	};

	return (
		<PossiblyLink>
			<div className="relative w-full rounded-lg bg-darkAccent p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl">
				<div className="flex flex-col items-center gap-4 sm:flex-row">
					{hub && (
						<div className="absolute right-3 top-3 cursor-pointer">
							<Dropdown className="bg-darkAccent">
								<DropdownTrigger>
									<MoreHorizontal
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										className="text-gray-300 transition-colors duration-200 hover:text-white"
										size={20}
									/>
								</DropdownTrigger>
								<DropdownMenu>
									<DropdownItem
										variant="flat"
										className="transition-colors duration-300 ease-in-out hover:bg-charcoal-700"
									>
										Invite Friends
									</DropdownItem>
									<DropdownItem
										variant="flat"
										className="transition-colors duration-300 ease-in-out hover:bg-charcoal-700"
									>
										Privacy Settings
									</DropdownItem>
									<DropdownItem
										variant="flat"
										className="transition-colors duration-300 ease-in-out hover:bg-charcoal-700"
									>
										Notification Settings
									</DropdownItem>
									<DropdownItem
										variant="flat"
										className="transition-colors duration-300 ease-in-out hover:bg-charcoal-700"
									>
										Edit Hub
									</DropdownItem>
									<DropdownItem
										color="danger"
										variant="flat"
										className="text-danger transition-colors duration-300 ease-in-out"
									>
										Leave
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</div>
					)}

					{!hub && children}
					{hub && (
						<>
							<Badge
								content={badgeCount ? (badgeCount > 9 ? "9+" : badgeCount) : undefined}
								color="danger"
								placement="bottom-right"
								className={cn("mb-2", badgeCount === 0 ? "hidden" : "")}
								size="md"
							>
								<Avatar
									src="/icon-1.png"
									alt="Avatar"
									className="mb-2 rounded-xl mm-hw-16 sm:mm-hw-12"
									imgProps={{ className: "transition-none" }}
								/>
							</Badge>
							<div className="w-full flex-1 text-center sm:text-left">
								<h3 className="max-w-[calc(100%-4rem)] truncate text-lg font-semibold text-white">{hub.name}</h3>
								<p className="mt-1 text-sm text-gray-300">{hub.description}</p>
								<div className="-ml-2 mt-2 flex justify-center sm:justify-start">
									<Chip variant="dot" color="success" size="sm" className="rounded-full border-0 px-2 py-1 text-white">
										30 {t("hubs.online")}
									</Chip>
									<Chip
										variant="dot"
										color="secondary"
										size="sm"
										className="rounded-full border-0 px-2 py-1 text-white"
									>
										{hub.memberCount} {t("hubs.members")}
									</Chip>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</PossiblyLink>
	);
};

const Hubs = () => {
	const hubs = useHubStore((s) => s.hubs);
	const getHubSettings = useHubSettingsStore((s) => s.getHubSettings);
	const { getChannelsWithValidPermissions, getTopChannel } = useChannelStore();

	const mappedHubs = useCallback(() => {
		return hubs.map((hub) => {
			let mentions = 0;

			const gotChannels = getChannelsWithValidPermissions(hub.id);
			const foundHubSettings = getHubSettings(hub.id);

			for (const channel of gotChannels) {
				const foundChannel = hub.channelProperties.find((channelProperty) => channelProperty.channelId === channel.id);

				mentions += foundChannel?.mentions?.length ?? 0;
			}

			const topChannel = getTopChannel(hub.id);

			return (
				<HubCard
					key={hub.id}
					hub={hub}
					badgeCount={mentions}
					href={
						foundHubSettings?.lastChannelId
							? Routes.hubChannel(hub.id, foundHubSettings.lastChannelId)
							: topChannel
								? Routes.hubChannel(hub.id, topChannel.id)
								: Routes.hub(hub.id)
					}
				/>
			);
		});
	}, [hubs, getHubSettings]);

	const { isOpen, onOpenChange } = useDisclosure();

	return (
		<AppLayout>
			<div />
			<HubModal isOpen={isOpen} onOpenChange={onOpenChange} />
			<div className="h-full w-full">
				<Tabs
					className="flex justify-center"
					classNames={{
						tab: "bg-darkAccent",
						tabList: "bg-darkAccent",
						cursor: "dark:bg-charcoal-500",
						panel: "rounded-md ",
					}}
				>
					<Tab title="My Hubs">
						<div className="grid grid-cols-1 gap-4 pl-4 pr-4 md:grid-cols-2 xl:grid-cols-4">
							<HubCard>
								<div className="flex h-full w-full flex-col items-center justify-center text-2xl font-semibold text-white">
									<h3 className="text-lg font-semibold text-white">Join or Create a Hub</h3>
									<p className="text-sm text-gray-300">Discover and join communities that share your interests.</p>
									<Button
										size="sm"
										className="mt-4"
										variant="flat"
										color="primary"
										onPress={() => {
											onOpenChange();
										}}
									>
										Join or Create
									</Button>
								</div>
							</HubCard>

							{mappedHubs()}
						</div>
					</Tab>
					<Tab title="Discover" isDisabled>
						Coming soon! How'd you get here?
					</Tab>
				</Tabs>
			</div>
		</AppLayout>
	);
};

export default Hubs;
