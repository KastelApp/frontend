import { NavBarLocation } from "@/types/payloads/ready.ts";
import { useSelectedTab, useSettingsStore } from "@/wrapper/Stores.ts";
import { Avatar, Badge, Chip } from "@nextui-org/react";
import { Backpack, Home, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import HomeContent from "./DmContent/Home.tsx";
import Library from "./DmContent/Library.tsx";
import Friends from "./DmContent/Friends.tsx";
import TopNavBar from "./TopNavBar.tsx";
import { useRouter } from "next/router";
import Link from "next/link";

const DmNavBarItem = ({
    isActive,
    name,
    icon,
    onClick,
    endContent,
    isDisabled,
    underName,
    className,
    textSize = "md",
    href
}: {
    icon?: React.ReactElement | React.ReactElement[];
    name: string;
    isActive?: boolean;
    onClick?: () => void;
    endContent?: React.ReactElement | React.ReactElement[];
    isDisabled?: boolean;
    underName?: string | null;
    textSize?: "sm" | "md" | "lg";
    className?: string;
    href?: string;
}) => {

    const LinkMaybe = ({
        children
    }: {
        children: React.ReactNode;
    }) => href ? <Link href={href} passHref>{children}</Link> : <>{children}</>;

    return (
        <div className={twMerge("transition-all duration-300 ease-in-out transform group select-none flex items-center justify-start w-[12rem] ml-2 mt-2 h-10 cursor-pointer rounded-lg", isActive ? "bg-slate-700" : "hover:bg-slate-800", isDisabled ? "cursor-not-allowed" : "")} onClick={!isDisabled ? onClick : undefined}>
            <LinkMaybe>
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        {icon}
                        <div className={twMerge("flex flex-col ml-2", className)}>
                            <p className={twMerge("text-white truncate", isDisabled ? "text-gray-500" : "", textSize ? `text-${textSize}` : "")}>{name}</p>
                            {underName && <p className="text-xs text-gray-500 truncate">{underName}</p>}
                        </div>
                    </div>
                    {endContent}
                </div>
            </LinkMaybe>
        </div>

    );
};

const DmNavBar = ({
    children,
    title
}: {
    children?: React.ReactNode;
    title?: string | null | React.ReactElement;
}) => {
    const { navBarLocation, isSideBarOpen, setIsSideBarOpen } = useSettingsStore();
    const { selectedTab, setSelectedTab } = useSelectedTab();

    const router = useRouter();

    const tabs = [
        {
            name: "Home",
            id: "home",
            disabled: false,
            icon: <Home color="#acaebf" size={20} className="ml-2" />
        },
        {
            name: "Friends",
            id: "friends",
            disabled: false,
            icon: <UserRound color="#acaebf" size={20} className="ml-2" />
        },
        {
            name: "Library",
            id: "game-library",
            disabled: true,
            icon: <Backpack size={20} className="ml-2" color="gray" />,
            endContent: <Chip classNames={{
                base: "bg-gradient-to-br from-orange-500 to-purple-500 shadow-pink-500/30 mr-2",
                content: "drop-shadow shadow-black text-white",
            }} size="sm" className="text-xs">Coming Soon</Chip>
        }
    ];

    const dms = [
        {
            username: "DarkerInkDarkerInkDarkerInkDarkerInkDarkerInkDarkerInkDarkerInkDarkerInk",
            avatar: "https://development.kastelapp.com/icon-1.png",
            status: "Online",
            customStatus: "Testing",
        },
        {
            username: "Cats",
            avatar: null,
            status: "Idle",
            customStatus: "Testing",
        },
        {
            username: "Waffles",
            avatar: null,
            status: "DND",
            customStatus: null,
        },
        {
            username: "Dogo",
            avatar: null,
            status: "Invisible",
            customStatus: null,
        }
    ];

    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

    useEffect(() => {
        if (!router.isReady) return;

        setSelectedChannel(router.query.channelId as string ?? null);

        if (!router.query.channelId && !selectedTab) {
            setSelectedTab(tabs[0].id)
        }
    }, [router]);

    return (
        <div className="flex flex-row w-full h-screen m-0 overflow-hidden">
            <div className={twMerge("fixed w-52 h-screen m-0 overflow-hidden bg-accent", isSideBarOpen ? navBarLocation === NavBarLocation.Left ? "ml-16" : "" : "hidden")}>
                <div className="flex w-full flex-col">
                    {tabs.map((tab, index) => (
                        <DmNavBarItem
                            key={index}
                            name={tab.name}
                            isActive={selectedTab === tab.id}
                            onClick={() => {
                                setSelectedTab(tab.id);

                                window.history.replaceState({
                                    ...window.history.state,
                                    as: "/app",
                                    url: "/app"
                                }, "", "/app");

                                setSelectedChannel(null);
                            }}
                            icon={tab.icon}
                            endContent={tab.endContent}
                            isDisabled={tab.disabled}
                            textSize="sm"
                        />
                    ))}
                </div>
                <div className="flex flex-col">
                    <p className="text-white text-xs ml-2 mt-2">Direct Messages</p>
                    {dms.map((dm, index) => (
                        <DmNavBarItem
                            key={index}
                            name={dm.username}
                            underName={dm.customStatus}
                            textSize="sm"
                            icon={
                                <>
                                    <Badge content={""} placement="bottom-right" color={dm.status === "Online" ? "success" : dm.status === "Idle" ? "warning" : dm.status === "DND" ? "danger" : "default"} className="mb-1">
                                        <Avatar src={dm.avatar ?? undefined} size="sm" name={dm.username} className="ml-1" imgProps={{ className: "transition-none" }} />
                                    </Badge>
                                </>
                            }
                            endContent={<X color="#c7c7c7" size={20} className="scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out mr-2" />}
                            className="truncate w-28"
                            href={`/app/@me/messages/${dm.username}`}
                            isActive={selectedChannel === dm.username}
                            onClick={() => {
                                setSelectedTab(null);
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className={twMerge("w-full", isSideBarOpen ? "ml-[17rem]" : "")}>
                <TopNavBar
                    startContent={<div className="text-gray-300 font-semibold">{selectedTab === null && title ? title : tabs.find(tab => tab.id === selectedTab)?.name}</div>}
                    isOpen={isSideBarOpen}
                    setIsOpen={setIsSideBarOpen}
                />
                <div className="ml-2 ">
                    {
                        selectedTab === null && children ? children : selectedTab === "game-library" ? <Library /> : selectedTab === "friends" ? <Friends /> : <HomeContent />
                    }
                </div>
            </div>
        </div>
    );
};

export default DmNavBar;