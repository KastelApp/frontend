import { Button } from "@/components/ui/button";
import { Search, MessageSquare, LayoutGrid, InboxIcon } from "lucide-react";
import { Avatar, Badge, Divider, Tooltip } from "@nextui-org/react";
import { useHubSettingsStore } from "@/wrapper/Stores.tsx";
import { useHubStore } from "@/wrapper/Stores/HubStore.ts";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import arrayify from "@/utils/arrayify.ts";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { useCallback } from "react";
import Draggables from "@/components/DraggableComponent.tsx";
import { snowflake } from "@/data/constants.ts";
import cn from "@/utils/cn.ts";
import UserOptions from "@/components/Dropdowns/UserOptions.tsx";
import { Routes } from "@/utils/Routes.ts";
import { useRouter } from "@/hooks/useRouter.ts";
import Link from "@/components/Link.tsx";

const LeftNavBar = () => {
    const { hubs } = useHubStore();
    const getHubSettings = useHubSettingsStore((s) => s.getHubSettings);
    const { getChannelsWithValidPermissions, getTopChannel } = useChannelStore();
    const router = useRouter();

    const [hubId] = arrayify(router.params?.slug);
    const currentUser = useUserStore((s) => s.getCurrentUser());
    const orientation = "vertical";
    const getAvatarUrl = useUserStore((s) => s.getAvatarUrl);
    const getDefaultAvatar = useUserStore((s) => s.getDefaultAvatar);

    const mappedHubs = useCallback(() => {
        return (
            <Draggables
                disableGhostElement
                items={hubs.filter((hub) => !hub.unavailable && !hub.partial)}
                onDrop={console.log}
                render={(item, index, props) => {
                    let hasUnread = false;
                    let mentions = 0;

                    const gotChannels = getChannelsWithValidPermissions(item.id);
                    const foundHubSettings = getHubSettings(item.id)

                    for (const channel of gotChannels) {
                        const foundChannel = item.channelProperties.find(
                            (channelProperty) => channelProperty.channelId === channel.id,
                        );

                        mentions += foundChannel?.mentions?.length ?? 0;

                        if (channel.lastMessageId && foundChannel?.lastMessageAckId !== channel.lastMessageId) {
                            if (
                                foundChannel?.lastMessageAckId &&
                                channel.lastMessageId &&
                                snowflake.timeStamp(foundChannel.lastMessageAckId) > snowflake.timeStamp(channel.lastMessageId)
                            ) {
                                continue;
                            }

                            hasUnread = true;

                            break;
                        }
                    }

                    const topChannel = getTopChannel(item.id);

                    return (
                        <Link
                            className="group mb-3 ml-3 relative flex items-center cursor-pointer hover:bg-charcoal-600 rounded-md transition-all duration-300 ease-in-out"
                            key={index}
                            href={foundHubSettings?.lastChannelId
                                ? Routes.hubChannel(item.id, foundHubSettings.lastChannelId) : topChannel ?
                                    Routes.hubChannel(item.id, topChannel.id) : Routes.hub(item.id)}
                            {...props}
                        >
                            <div
                                className={cn(
                                    "absolute z-20 bg-white transition-all duration-300 ease-in-out",
                                    orientation === "vertical"
                                        ? "-left-2 h-0 w-1 rounded-r-lg group-hover:h-4"
                                        : "-bottom-2 h-1 w-0 rounded-b-lg group-hover:w-4",
                                    hasUnread ? (orientation === "vertical" ? "h-2" : "w-2") : "",
                                    item.id === hubId ? (orientation === "vertical" ? "!h-6" : "!w-6") : ""
                                )}
                            />
                            <div className="flex items-center">
                                <Badge
                                    content={mentions === 0 ? undefined : mentions > 9 ? "9+" : String(mentions)}
                                    color="danger"
                                    placement="bottom-right"
                                    className={cn("mb-1", mentions === 0 ? "hidden" : "")}
                                    size="sm"
                                >
                                    <Tooltip
                                        content={item.name}
                                        placement={orientation === "vertical" ? "right" : "top"}
                                        delay={750}
                                    >
                                        <Avatar
                                            name={item.name}
                                            src={item.icon ?? undefined}
                                            className="h-10 w-10 transform rounded-3xl transition-all duration-300 ease-in-out group-hover:rounded-xl"
                                            imgProps={{ className: "transition-none" }}
                                        />
                                    </Tooltip>
                                </Badge>
                            </div>
                            <div className="ml-3 flex flex-col justify-center">
                                <div className="text-sm font-medium text-white mm-w-36">{item.name}</div>
                                <div className="text-xs text-gray-400 mm-w-36">
                                    {item.memberCount} Members • {1} Online
                                </div>
                            </div>
                        </Link>
                    );
                }}
            />
        );
    }, [hubs, hubId]);


    return (
        <div className="h-screen flex flex-col py-3 overflow-hidden bg-darkAccent">
            <Link href={Routes.app()} className={"group transition-all duration-300 ease-in-out px-3 mb-3 flex items-center ml-2 rounded-md cursor-pointer hover:bg-charcoal-600 mr-2"}>
                <div className=" group-active:scale-[.98] flex items-center">
                    <Button variant="ghost" size="icon" className={"rounded-3xl group-hover:rounded-xl transition-all duration-300 ease-in-out mm-hw-10 p-0 bg-gray-600 group-hover:bg-gray-700 -ml-2"}>
                        <MessageSquare className="mm-hw-5 text-gray-400" />
                    </Button>
                    <span className="text-gray-300 text-sm ml-3">Messages</span>
                </div>
                <div
                    className={cn(
                        "absolute z-10 bg-white transition-height !w-1 duration-300 ease-in-out left-0 rounded-r-lg",
                        router.pathname === Routes.app() ? "!h-6" : "h-0"
                    )}
                />
            </Link>
            <div className={"group transition-all duration-300 ease-in-out px-3 mb-3 flex items-center ml-2 rounded-md cursor-pointer hover:bg-charcoal-600 mr-2 active:scale-[.98]"}>
                <Button variant="ghost" size="icon" className={"rounded-3xl group-hover:rounded-xl transition-all duration-300 ease-in-out mm-hw-10 p-0 bg-gray-600 group-hover:bg-gray-700 -ml-2"}>
                    <Search className="h-5 w-5 text-gray-400" />
                </Button>
                <span className="text-gray-300 text-sm ml-3">Search</span>
            </div>
            {/* <div className="px-3 mb-3 flex items-center"> dm example, will be used in the future.
                <Avatar className="mm-hw-10" src="https://placehold.co/48x48" />
                <div className="ml-3 overflow-hidden">
                    <div className="text-sm font-medium text-white mm-w-36">Test (DM)</div>
                    <div className="text-xs text-gray-400 truncate">that's awesome</div>
                </div>
            </div> */}
            <Divider className="my-3 bg-gray-700" />
            <Link href={Routes.hubs()} className={"group transition-all duration-300 ease-in-out px-3 mb-3 flex items-center ml-2 rounded-md cursor-pointer hover:bg-charcoal-600 mr-2"}>
                <div className=" group-active:scale-[.98] flex items-center">
                    <Button variant="ghost" size="icon" className={"rounded-3xl group-hover:rounded-xl transition-all duration-300 ease-in-out mm-hw-10 p-0 bg-gray-600 group-hover:bg-gray-700 -ml-2"}>
                        <LayoutGrid className="h-5 w-5 text-gray-400" />
                    </Button>
                    <span className="text-gray-300 text-sm ml-3">Hubs</span>
                </div>
                <div
                    className={cn(
                        "absolute z-10 bg-white transition-height !w-1 duration-300 ease-in-out left-0 rounded-r-lg",
                        router.pathname === Routes.hubs() ? "!h-6" : "h-0"
                    )}
                />
            </Link>
            <div className="flex-grow w-full pr-2">
                {mappedHubs()}
            </div>
            <Divider className="my-3 bg-gray-700" />
            <div className={"group transition-all duration-300 ease-in-out px-3 mb-3 flex items-center ml-2 rounded-md cursor-pointer hover:bg-charcoal-600 mr-2 active:scale-[.98]"}>
                <Button variant="ghost" size="icon" className={"rounded-3xl group-hover:rounded-xl transition-all duration-300 ease-in-out mm-hw-10 p-0 bg-gray-600 group-hover:bg-gray-700 -ml-2"}>
                    <InboxIcon className="h-5 w-5 text-gray-400" />
                </Button>
                <span className="text-gray-300 text-sm ml-3">Inbox</span>
            </div>
            <UserOptions orientation="horizontal" type="normal">
                <div className="group flex transition-all duration-300 ease-in-out px-3 mb-3 ml-2 items-center rounded-md cursor-pointer hover:bg-charcoal-600 mr-2 pb-1 pt-1 active:scale-[0.98]">
                    <div className="max-h-9 min-h-9 min-w-9 max-w-9 -ml-2">
                        <Avatar
                            src={getAvatarUrl(currentUser!.id, currentUser!.avatar) ?? getDefaultAvatar(currentUser!.id)}
                            className="rounded-3xl group-hover:rounded-xl group-aria-expanded:rounded-xl max-h-9 min-h-9 min-w-9 max-w-9 transform transition-all duration-300 ease-in-out"
                            imgProps={{ className: "transition-none" }}
                            radius="none"
                        />
                    </div>
                    <div className="ml-3 flex-grow overflow-hidden">
                        <div className="text-sm font-medium text-white truncate">{currentUser?.username}</div>
                        <div className="text-xs text-gray-400 truncate">Online</div>
                    </div>
                </div>
            </UserOptions>
        </div>

    );
};

export default LeftNavBar;