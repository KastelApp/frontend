import { NavBarLocation } from "@/types/payloads/ready.ts";
import { useGuildSettingsStore, useSettingsStore } from "@/wrapper/Stores.ts";
import { Chip, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip, useDisclosure } from "@nextui-org/react";
import { AlignJustify, BadgeCheck, BookA, ChevronDown, ChevronRight, Hash, Mail, Pencil, Settings, UserRound, UsersRound, Volume2, X } from "lucide-react";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import TopNavBar from "./TopNavBar.tsx";
import { motion } from "framer-motion";
import MemberBar from "./MemberBar.tsx";
import ChangeNickname from "../Modals/ChangeNickname.tsx";
import ConfirmLeave from "../Modals/ConfirmLeave.tsx";
import BaseSettings from "../Modals/BaseSettings.tsx";
import Overview from "../Settings/Guild/OverView.tsx";
import ConfirmDelete from "../Modals/ConfirmDelete.tsx";

const ChannelIcon = ({
    icon,
    text,
    onlyShowOnHover,
    rightIcon,
    divider,
    shouldHideHover
}: {
    text: string;
    icon?: React.ReactElement | React.ReactElement[];
    rightIcon?: React.ReactElement | React.ReactElement[];
    onlyShowOnHover?: boolean;
    divider?: boolean;
    shouldHideHover?: boolean;
}) => {
    return (
        <div className="first:mt-2">
            <div className={twMerge("flex items-center gap-1 p-1 cursor-pointer group rounded-md w-48 mb-1 text-white ", !shouldHideHover ? "hover:bg-slate-500" : "hover:text-slate-400")}>
                {icon}
                <p className=" text-sm truncate">{text}</p>
                {rightIcon && <div className={twMerge("ml-auto", onlyShowOnHover ? "scale-0 group-hover:scale-100" : "")}>{rightIcon}</div>}
            </div>
            {divider && <Divider />}

        </div>
    );
};

interface Channel {
    name: string;
    icon?: React.ReactElement | React.ReactElement[];
    description?: string;
    channels?: Channel[];
}

const HandleChannels = ({
    channel
}: {
    channel: Channel;
}) => {
    return (
        <div>
            <ChannelIcon
                text={channel.name}
                rightIcon={channel.channels && <ChevronDown size={20} color="#acaebf" />}
                icon={channel.icon}
                shouldHideHover={Boolean(channel.channels)}
            />
            {channel.channels && (
                <div className="ml-1">
                    {
                        channel.channels?.map((subChannel, index) => (
                            <ChannelIcon
                                key={index}
                                text={subChannel.name}
                                icon={subChannel.icon}
                            />
                        ))
                    }
                </div>
            )}
        </div>
    );
};

const
    ChannelNavBar = ({
        children
    }: {
        children?: React.ReactElement | React.ReactElement[];
    }) => {
        const { navBarLocation, isSideBarOpen, setIsSideBarOpen } = useSettingsStore();

        const { guildSettings: rawGuildSettings, setGuildSettings } = useGuildSettingsStore();
        const guildSettings = rawGuildSettings["123"] ?? { memberBarHidden: false };

        const {
            isOpen: isNicknameOpen,
            onOpenChange,
            onClose
        } = useDisclosure();

        const {
            isOpen: isConfirmLeaveOpen,
            onOpenChange: onOpenChangeConfirmLeave,
            onClose: onCloseConfirmLeave
        } = useDisclosure();

        const {
            isOpen: isGuildSettingsOpen,
            onOpenChange: onOpenChangeGuildSettings,
            onClose: onCloseGuildSettings
        } = useDisclosure();

        const currentGuild = {
            name: "This is a test",
            owner: true,
            icon: {
                text: "Official & Partnered",
                icon: <BadgeCheck size={18} color="#17c964" strokeWidth={3} />
            },
            dropDownTabs: [
                {
                    name: "Invite Friends",
                    icon: <UserRound size={20} color="#acaebf" />,
                    onClick: () => { },
                    end: true // ? if end is true, then we have a divider
                },
                {
                    name: "Guild Settings",
                    icon: <Settings size={20} color="#acaebf" />,
                    onClick: () => {
                        onOpenChangeGuildSettings();
                    },
                    end: false
                },
                {
                    name: "Create Channel",
                    icon: <Hash size={20} color="#acaebf" />,
                    onClick: () => { },
                    end: false
                },
                {
                    name: "Change Nickname",
                    icon: <Pencil size={20} color="#acaebf" />,
                    onClick: () => {
                        onOpenChange();
                    },
                    end: true
                },
                {
                    name: "Leave Guild",
                    icon: <X size={20} color="#acaebf" />,
                    onClick: () => {
                        onOpenChangeConfirmLeave();
                    },
                    end: false,
                    color: "danger"
                }
            ]
        };

        const builtInChannels = [
            {
                name: "Channels",
                icon: <AlignJustify size={18} color="#acaebf" />,
            },
            {
                name: "ModMail",
                icon: <Mail size={18} color="#acaebf" />,
                rightIcon: <Chip classNames={{
                    base: "bg-gradient-to-br from-orange-500 to-purple-500 shadow-pink-500/30 mr-2 p-0 h-5 w-4",
                    content: "drop-shadow shadow-black text-white",
                }} className="text-xs">Coming Soon</Chip>
            }
        ];

        const normalChannels: Channel[] = [
            {
                name: "Uncategorized",
                icon: <Hash size={18} color="#acaebf" />
            },
            {
                name: "Welcome",
                channels: [
                    {
                        name: "info",
                        icon: <BookA size={18} color="#acaebf" />
                    },
                    {
                        name: "announcements",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                    {
                        name: "updates",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                    {
                        name: "todos",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                    {
                        name: "github",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                    {
                        name: "welcome",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                    {
                        name: "polls",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                ]
            },
            {
                name: "Messaging",
                channels: [
                    {
                        name: "lounge",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                    {
                        name: "bots",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                    {
                        name: "media",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                    {
                        name: "stream",
                        icon: <Volume2 size={18} color="#acaebf" />
                    },
                    {
                        name: "priv",
                        icon: <Volume2 size={18} color="#acaebf" />
                    },
                ]
            },
            {
                name: "Alpha",
                channels: [
                    {
                        name: "alpha-info",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                    {
                        name: "alpha-updates",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                    {
                        name: "known-issues",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                    {
                        name: "alpha-chat",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                    {
                        name: "server-invites",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                    {
                        name: "unofficial-bot-development",
                        icon: <Hash size={18} color="#acaebf" />
                    },
                ]
            },
        ];

        const [isOpen, setIsOpen] = useState(false);

        const variants = {
            open: { rotate: 90 },
            closed: { rotate: 0 }
        };

        const {
            isOpen: isConfirmDeleteOpen,
            onOpenChange: onOpenChangeConfirmDelete,
            onClose: onCloseConfirmDelete
        } = useDisclosure();

        return (
            <>
                {/* the modals we use for the buttons */}
                <ChangeNickname isOpen={isNicknameOpen} onOpenChange={onOpenChange} onClose={onClose} />
                <ConfirmLeave isOpen={isConfirmLeaveOpen} onOpenChange={onOpenChangeConfirmLeave} onClose={onCloseConfirmLeave} />
                <BaseSettings title="This is a test — Settings" isOpen={isGuildSettingsOpen} onOpenChange={onOpenChangeGuildSettings} onClose={onCloseGuildSettings} sections={[{
                    title: null,
                    children: [
                        {
                            title: "Overview",
                            id: "overview",
                            section: <Overview />,
                            disabled: false
                        },
                        {
                            title: "Roles",
                            id: "roles",
                            section: <div>Roles</div>,
                            disabled: false
                        },
                        {
                            title: "Emojis",
                            id: "emojis",
                            section: <div>Emojis</div>,
                            disabled: true
                        },
                        {
                            title: "Vanity URL",
                            id: "vanity-url",
                            section: <div>Vanity URL</div>,
                            disabled: true
                        }
                    ]
                },
                {
                    title: "Community",
                    children: [
                        {
                            title: "Discovery",
                            id: "discovery",
                            section: <div>Discovery</div>,
                            disabled: true
                        },
                        {
                            title: "Partner & Verification",
                            id: "partner",
                            section: <div>Partner</div>,
                            disabled: true
                        }
                    ]
                },
                {
                    title: "User Management",
                    children: [
                        {
                            title: "Co-Owners",
                            id: "co-owners",
                            section: <div>Co-Owners</div>,
                            disabled: true
                        },
                        {
                            title: "Members",
                            id: "members",
                            section: <div>Members</div>,
                            disabled: false
                        },
                        {
                            title: "Bans",
                            id: "bans",
                            section: <div>Bans</div>,
                            disabled: true
                        },
                        {
                            title: "Invites",
                            id: "invites",
                            section: <div>Invites</div>,
                            disabled: false
                        }
                    ]
                },
                {
                    title: null,
                    children: [
                        {
                            title: "Delete",
                            id: "delete",
                            disabled: false,
                            danger: true,
                            onClick: () => {
                                onOpenChangeConfirmDelete();
                            }
                        }
                    ]
                }
                ]} initialSection={"overview"} />
                <ConfirmDelete isOpen={isConfirmDeleteOpen} onOpenChange={onOpenChangeConfirmDelete} onClose={onCloseConfirmDelete} />

                <div className="flex flex-row w-full h-screen m-0 overflow-x-auto">
                    <div
                        className={twMerge(
                            "fixed w-52 h-screen m-0  bg-accent overflow-y-auto",
                            isSideBarOpen ? navBarLocation === NavBarLocation.Left ? "ml-16" : "" : "hidden"
                        )}
                    >
                        <div className="flex items-center gap-1 mt-3 select-none border-b-2 border-slate-800">
                            <Dropdown onOpenChange={setIsOpen}>
                                <DropdownTrigger>
                                    <div className="flex items-center justify-between w-full mb-2 ml-3 cursor-pointer">
                                        <div className="flex items-center gap-1">
                                            {currentGuild.icon && (
                                                <Tooltip content={currentGuild.icon.text} showArrow>
                                                    <div>
                                                        {currentGuild.icon.icon}
                                                    </div>
                                                </Tooltip>
                                            )}
                                            <p className="text-white text-sm truncate">{currentGuild.name}</p>
                                        </div>
                                        <motion.div
                                            animate={isOpen ? "open" : "closed"}
                                            variants={variants}
                                        >
                                            <ChevronRight size={20} color="#acaebf" />
                                        </motion.div>
                                    </div>
                                </DropdownTrigger>
                                <DropdownMenu variant="faded" aria-label="Dropdown menu with description" onAction={(k) => {
                                    const found = currentGuild.dropDownTabs[k as number];

                                    if (found) {
                                        found.onClick();
                                    }
                                }}>
                                    {
                                        currentGuild.dropDownTabs.map((tab, index) => (
                                            <DropdownItem
                                                key={index}
                                                color={tab.color as "danger" | undefined}
                                                endContent={tab.icon}
                                                showDivider={tab.end}
                                            >
                                                {tab.name}
                                            </DropdownItem>
                                        ))
                                    }
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div className="flex flex-col items-center justify-start p-1 m-0 overflow-y-auto">
                            {
                                builtInChannels.map((channel, index) => (
                                    <ChannelIcon
                                        key={index}
                                        text={channel.name}
                                        icon={channel.icon}
                                        rightIcon={channel.rightIcon}
                                        divider={index === builtInChannels.length - 1}
                                    />
                                ))
                            }
                            {
                                normalChannels.map((channel, index) => (
                                    <HandleChannels
                                        key={index}
                                        channel={channel}
                                    />
                                ))
                            }
                        </div>
                    </div>
                    <div className={twMerge("w-full overflow-hidden", isSideBarOpen ? "ml-[17rem]" : "")}>
                        <TopNavBar
                            startContent={<div className="flex items-center gap-1 select-none">
                                <Hash size={20} color="#acaebf" />
                                <p className="text-gray-300 font-semibold">Test</p>
                                <Divider orientation="vertical" className="h-6 ml-2 mr-2 w-[3px]" />
                                <p className="text-gray-400 text-sm cursor-pointer truncate w-96">Welcome</p>
                            </div>}
                            isOpen={isSideBarOpen}
                            setIsOpen={setIsSideBarOpen}
                            icons={[
                                {
                                    icon: <UsersRound size={22} color="#acaebf" />,
                                    tooltip: guildSettings.memberBarHidden ? "Show Members" : "Hide Members",
                                    onClick: () => {
                                        setGuildSettings("123", {
                                            memberBarHidden: !guildSettings.memberBarHidden
                                        });
                                    }
                                }
                            ]}
                        />
                        <div className="flex flex-row overflow-y-auto w-full">
                            <div className="flex-grow overflow-y-auto">
                                {children}
                            </div>
                            <div className={twMerge(guildSettings.memberBarHidden ? "ml-1" : "ml-[13.2rem]")}>
                                <MemberBar />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

export default ChannelNavBar;