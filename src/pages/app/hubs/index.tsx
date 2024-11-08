import { Routes } from "@/utils/Routes.ts";
import { useHubSettingsStore, useTranslationStore } from "@/wrapper/Stores.tsx";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { Hub, useHubStore } from "@/wrapper/Stores/HubStore.ts";
import { Avatar, Badge, Button, Chip, cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tab, Tabs } from "@nextui-org/react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

interface HubCardProps {
    href?: string;
    children?: React.ReactNode;
    hub?: Hub;
    badgeCount?: number;
}

const HubCard = ({
    children,
    hub,
    href,
    badgeCount
}: HubCardProps) => {
    const { t } = useTranslationStore();

    const PossiblyLink = ({ children }: { children: React.ReactNode; }) => {
        if (!href) return <>{children}</>;

        return <Link href={href}>{children}</Link>;
    };

    return (
        <PossiblyLink>
            <div className="bg-darkAccent p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full relative">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {hub && (
                        <div className="absolute top-3 right-3 cursor-pointer">
                            <Dropdown className="bg-darkAccent">
                                <DropdownTrigger>
                                    <MoreHorizontal onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }} className="text-gray-300 hover:text-white transition-colors duration-200" size={20} />
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem variant="flat" className="hover:bg-charcoal-700 transition-colors duration-300 ease-in-out">
                                        Invite Friends
                                    </DropdownItem>
                                    <DropdownItem variant="flat" className="hover:bg-charcoal-700 transition-colors duration-300 ease-in-out">
                                        Privacy Settings
                                    </DropdownItem>
                                    <DropdownItem variant="flat" className="hover:bg-charcoal-700 transition-colors duration-300 ease-in-out">
                                        Notification Settings
                                    </DropdownItem>
                                    <DropdownItem variant="flat" className="hover:bg-charcoal-700 transition-colors duration-300 ease-in-out">
                                        Edit Hub
                                    </DropdownItem>
                                    <DropdownItem color="danger" variant="flat" className="text-danger transition-colors duration-300 ease-in-out">
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
                                content={badgeCount ? badgeCount > 9 ? "9+" : badgeCount : undefined}
                                color="danger"
                                placement="bottom-right"
                                className={cn("mb-2", badgeCount === 0 ? "hidden" : "")}
                                size="md"
                            >
                                <Avatar
                                    src="/icon-1.png"
                                    alt="Avatar"
                                    className="rounded-xl mm-hw-16 sm:mm-hw-12 mb-2"
                                    imgProps={{ className: "transition-none" }}
                                />
                            </Badge>
                            <div className="flex-1 text-center sm:text-left w-full">
                                <h3 className="text-white text-lg font-semibold truncate max-w-[calc(100%-4rem)]">{hub.name}</h3>
                                <p className="text-gray-300 text-sm mt-1">{hub.description}</p>
                                <div className="flex justify-center sm:justify-start mt-2 -ml-2">
                                    <Chip
                                        variant="dot"
                                        color="success"
                                        size="sm"
                                        className="border-0 text-white px-2 py-1 rounded-full"
                                    >
                                        30 {t("hubs.online")}
                                    </Chip>
                                    <Chip
                                        variant="dot"
                                        color="secondary"
                                        size="sm"
                                        className="border-0 text-white px-2 py-1 rounded-full"
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
    const { hubs } = useHubStore();
    const { hubSettings } = useHubSettingsStore();
    const { getChannelsWithValidPermissions, getTopChannel } = useChannelStore();

    const mappedHubs = useCallback(() => {
        return hubs.map((hub) => {
            let mentions = 0;

            const gotChannels = getChannelsWithValidPermissions(hub.id);
            const foundHubSettings = hubSettings[hub.id];

            for (const channel of gotChannels) {
                const foundChannel = hub.channelProperties.find(
                    (channelProperty) => channelProperty.channelId === channel.id,
                );

                mentions += foundChannel?.mentions?.length ?? 0;
            }

            const topChannel = getTopChannel(hub.id);

            return (
                <HubCard
                    key={hub.id}
                    hub={hub}
                    badgeCount={mentions}
                    href={foundHubSettings?.lastChannelId
                        ? Routes.hubChannel(hub.id, foundHubSettings.lastChannelId) : topChannel ?
                            Routes.hubChannel(hub.id, topChannel.id) : Routes.hub(hub.id)}
        />
            );
        });
    }, [hubs, hubSettings]);

    return (
        <>
            <div />
            <div className="w-full h-full">
                <Tabs className="flex justify-center"
                

                classNames={{
                    tab: "bg-darkAccent",
                    tabList: "bg-darkAccent",
                    cursor: "dark:bg-charcoal-500",
                    panel: "rounded-md "    
                }}
                >
                    <Tab title="My Hubs">
                        <div className="pl-4 pr-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            <HubCard>
                                <div className="flex flex-col items-center justify-center w-full h-full text-white text-2xl font-semibold">
                                    <h3 className="text-white text-lg font-semibold">Join or Create a Hub</h3>
                                    <p className="text-gray-300 text-sm">Discover and join communities that share your interests.</p>
                                    <Button size="sm" className="mt-4" variant="flat" color="primary">
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
        </>
    );
};

Hubs.shouldHaveLayout = true;

export default Hubs;
