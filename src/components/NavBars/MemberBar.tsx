import { useGuildSettingsStore, useIsOpenStore } from "@/wrapper/Stores.ts";
import { Avatar, Badge, Chip, Popover, PopoverContent, PopoverTrigger, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import UserPopover from "../Popovers/UserPopover.tsx";

interface Role {
    name: string;
    position: number;
    color: string | null;
    hoisted: boolean;
    id: string;
}

interface Member {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    roles: string[];
    isOwner: boolean;
    tag: "Bot" | "System" | null;
    status: "online" | "idle" | "dnd" | "offline";
    customStatus?: string;
}

interface Section {
    name: string; // ? two defaults, "offline" and "online"
    members: {
        member: Member;
        color: string | null;
    }[];
    position: number;
}

const Member = ({ member, color }: { member: Member; color: string | null; }) => {
    const { values, setOpen } = useIsOpenStore();

    const [loading, setLoading] = useState(false);

    return (
        <Popover showArrow placement="left" key={member.id} isOpen={values[member.id] ?? false} onOpenChange={(v) => {
            setTimeout(() => setOpen(member.id, v), 25);
        }}>
            <PopoverTrigger>
                <div className="flex items-center justify-between w-full h-12 px-2 cursor-pointer rounded-lg hover:bg-slate-800 relative max-w-48" onClick={() => {
                    setOpen(member.id, !values[member.id] ?? false);

                    setTimeout(() => setLoading(true), 2000);
                }}>
                    <div className="flex items-center">
                        <Badge content={""} placement="bottom-right" color={member.status === "online" ? "success" : member.status === "idle" ? "warning" : member.status === "dnd" ? "danger" : "default"} className="mb-1">
                            <Avatar src={member.avatar ?? undefined} size="sm" className="" />
                        </Badge>
                        <div className="flex flex-col ml-1">
                            <div className={twMerge("flex items-center")}>
                                <div className={twMerge("flex flex-col ml-2", member.tag ? "max-w-[6.75rem]" : "max-w-36")}>
                                    <p className={twMerge("truncate text-sm", color ? "" : "text-white")} style={color !== null ? { color } : {}}>{member.username}</p>
                                    {member.customStatus && <p className="text-xs text-gray-500 truncate">{member.customStatus}</p>}
                                </div>
                                {member.tag && <Chip color="success" variant="flat" className="ml-1 w-1 p-0 h-4 text-[10px] rounded-md">{member.tag}</Chip>}
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                {!loading ? <Spinner /> : <UserPopover member={member} />}
            </PopoverContent>
        </Popover>
    );
};

const MemberBar = () => {
    const { guildSettings: rawGuildSettings } = useGuildSettingsStore();

    const guildSettings = rawGuildSettings["123"] ?? { memberBarHidden: false };


    const roles: Role[] = [
        {
            name: "everyone",
            id: "everyone",
            color: null,
            hoisted: false,
            position: 0 // ? 0 = bottom
        },
        {
            name: "Admin",
            id: "admin",
            color: "#FFA500",
            hoisted: true,
            position: 2 // ? 2 = top
        },
        {
            name: "Test",
            id: "test",
            color: "green",
            hoisted: false,
            position: 3 // ? 3 = top
        },
        {
            name: "Moderator",
            id: "moderator",
            color: "#0088ff",
            hoisted: false,
            position: 1 // ? 1 = middle
        }
    ];

    const members: Member[] = [
        {
            id: "1",
            username: "DarkerInk",
            discriminator: "0001",
            avatar: "https://development.kastelapp.com/icon-1.png",
            roles: ["everyone", "admin", "test", "Team", "Developers", "user", "announcements", "backend", "polls"],
            isOwner: true,
            status: "online",
            tag: null,
            customStatus: "Cats r cool"
        },
        {
            id: "2",
            username: "Cats",
            discriminator: "0002",
            avatar: null,
            roles: ["everyone", "moderator"],
            isOwner: false,
            status: "idle",
            tag: null
        },
        {
            id: "3",
            username: "Waffles",
            discriminator: "0003",
            avatar: null,
            roles: ["everyone"],
            isOwner: false,
            status: "dnd",
            tag: null
        },
        {
            id: "4",
            username: "Dogo",
            discriminator: "0004",
            avatar: null,
            roles: ["everyone", "moderator"],
            isOwner: false,
            status: "offline",
            tag: null
        },
        {
            id: "5",
            username: "Bot",
            discriminator: "0004",
            avatar: null,
            roles: ["everyone"],
            isOwner: false,
            status: "online",
            tag: "Bot"
        },
        {
            id: "6",
            username: "System",
            discriminator: "0006",
            avatar: null,
            roles: ["everyone"],
            isOwner: false,
            status: "idle",
            tag: "System" // ? NOTE: THIS WILL **NEVER** happen in production, if it does, then we should panic (i.e console log it)
        }
    ];

    const [sections, setSections] = useState<Section[]>();

    useEffect(() => {
        const defaultSections: Section[] = [
            {
                name: "Offline",
                members: [],
                position: 0
            },
            {
                name: "Online",
                members: [],
                position: 1
            }
        ];



        for (const member of members) {
            // ? defaultSections[0] = offline
            // ? defaultSections[1] = online
            // ? defaultSections[number] = role

            const topColorRole = member.roles.map(roleId => roles.find(role => role.id === roleId))
                .filter(role => role !== undefined)
                .sort((a, b) => a!.position - b!.position).reverse()[0]?.color;

            if (member.status === "offline") {
                defaultSections[0].members.push({
                    color: topColorRole ?? null,
                    member
                });

                continue;
            }

            // ? if their only role is the everyone role push to online
            if (member.roles.length === 1 && member.roles[0] === "everyone") {
                defaultSections[1].members.push({
                    color: topColorRole ?? null,
                    member
                });

                continue;
            }

            // ? get their top role, if its hoisted then push the role into sections if it does not exist, and then push the user there
            // ? If we could not find a hoisted role, push them to online
            const topRole = member.roles.map(roleId => roles.find(role => role.id === roleId))
                .filter(role => role !== undefined && role.hoisted)
                .sort((a, b) => a!.position - b!.position).reverse()[0];

            if (!topRole) {
                defaultSections[1].members.push({
                    color: topColorRole ?? null,
                    member
                });

                continue;
            }

            if (topRole.hoisted) {
                const section = defaultSections.find(section => section.name === topRole?.name);

                if (!section) {
                    defaultSections.push({
                        name: topRole.name,
                        members: [{
                            color: topColorRole ?? null,
                            member
                        }],
                        position: topRole.position
                    });

                    continue;
                }

                section.members.push({
                    color: topColorRole ?? null,
                    member
                });

                continue;
            }

            let found = false;

            for (let i = topRole.position - 1; i >= 0; i--) {
                const role = roles.find(role => role.position === i);

                if (!role) continue;

                const section = defaultSections.find(section => section.name === role.name);

                if (!section) continue;

                section.members.push({
                    color: topColorRole ?? null,
                    member
                });

                found = true;

                break;
            }

            if (!found) {
                defaultSections[1].members.push({
                    color: topColorRole ?? null,
                    member
                });
            }
        }

        defaultSections.sort((a, b) => a.position - b.position).reverse();

        setSections(defaultSections);
    }, []);

    return (
        <div className={twMerge("flex flex-row w-full h-screen m-0 overflow-y-auto justify-end", guildSettings.memberBarHidden ? "hidden" : "")}>
            <div
                className="fixed w-52 h-screen m-0 overflow-y-auto bg-accent transition-opacity ease-in-out duration-300 !overflow-x-hidden"
            >
                <div className="flex w-full flex-col ml-2 last:mb-12">
                    {sections?.map((section, index) => (
                        <div key={index}>
                            <p className="text-white text-xs ml-2 mt-2">{section.name} — {section.members.length}</p>
                            {section.members.map((member, index) => (
                                <Member key={index} member={member.member} color={member.color} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default MemberBar;