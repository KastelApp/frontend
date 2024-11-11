import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown } from "lucide-react";
import cn from "@/utils/cn.ts";
import { useEffect, useRef, useState } from "react";
import { Role, useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import { Member, useMemberStore } from "@/wrapper/Stores/Members.ts";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import deepEqual from "fast-deep-equal";
import arrayify from "@/utils/arrayify.ts";
import MemberItem from "@/components/NavBars/MemberNavBar/MemberItem.tsx";
import { useRouter } from "@/hooks/useRouter.ts";

interface Section {
    name: string; // ? two defaults, "offline" and "online"
    id: string;
    members: {
        member: {
            member: Omit<Member, "roles"> & { roles: Role[]; };
            user: User;
        };
        color: string | null;
    }[];
    position: number;
    color?: string;
    collapsed?: boolean;
}



const MembersNavBar = ({
    className
}: {
    className?: string;
}) => {
    const router = useRouter();
    const [currentHubId, , channelId] = arrayify(router.params?.slug);
    const { getUser } = useUserStore();
    const roleRef = useRef<Role[] | null>(null);
    const memberRef = useRef<Member[] | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const sectionsRef = useRef<Section[]>([]);

    useEffect(() => {
        sectionsRef.current = sections;
    }, [sections]);

    useEffect(() => {
        const roleSubscribe = useRoleStore.subscribe((s) => {
            const roles = s.getRoles(currentHubId);

            if (deepEqual(roles, roleRef.current)) return; // ? its the same nothing changed

            roleRef.current = roles;
        });

        const memberSubscribe = useMemberStore.subscribe((s) => {
            const members = s.getMembers(currentHubId);

            if (deepEqual(members, memberRef.current)) return;

            memberRef.current = members;
        });

        const userSubscribe = useUserStore.subscribe((state) => {
            // ? in sections if we find a user that is changed, we update the user
            const newSections = [...sectionsRef.current];

            for (const section of newSections) {
                for (const member of section.members) {
                    const oldUser = member.member.user;
                    const newUser = state.users.find((user) => user.id === oldUser.id);

                    if (!newUser) {
                        // ? the user is uncached? we should remove them from the member list then
                        section.members = section.members.filter((m) => m.member.user.id !== oldUser.id);

                        continue;
                    }

                    if (deepEqual(oldUser, newUser)) continue; // ? the user is the same so we just skip

                    member.member.user = newUser;
                }
            }

            if (deepEqual(newSections, sectionsRef.current)) return; // ? sections are the same nothing to change

            setSections(newSections);
        });

        return () => {
            roleSubscribe();
            memberSubscribe();
            userSubscribe();
        };
    }, []);

    const sort = async (members: Member[], roles: Role[]) => {
        const defaultSections: Section[] = [
            {
                name: "Offline",
                members: [],
                position: 0,
                id: "offline",
            },
            {
                name: "Online",
                members: [],
                position: 1,
                id: "online",
            },
        ];

        for (const member of members) {
            // ? defaultSections[0] = offline
            // ? defaultSections[1] = online
            // ? defaultSections[number] = role
            const foundUser = getUser(member.userId);

            const topColorRole = member.roles
                .map((roleId) => roles.find((role) => role.id === roleId))
                .filter((role) => role !== undefined && role.color !== 0)
                .sort((a, b) => a!.position - b!.position)
                .reverse()[0]?.color;

            // ? note: these are expected to error for now. Ignore them please

            member.status = "online";

            if (member.status === "offline") {
                defaultSections[0].members.push({
                    color: topColorRole ? topColorRole.toString(16) : null,
                    member: {
                        member: {
                            ...member,
                            roles: member.roles
                                .map((roleId) => roles.find((role) => role.id === roleId))
                                .filter((role) => role !== null && role !== undefined),
                        },
                        user: foundUser!,
                    },
                });

                continue;
            }

            // ? if their only role is the everyone role push to online
            if (member.roles.length === 1 && member.roles[0] === "everyone") {
                defaultSections[1].members.push({
                    color: topColorRole ? topColorRole.toString(16) : null,
                    member: {
                        member: {
                            ...member,
                            roles: member.roles
                                .map((roleId) => roles.find((role) => role.id === roleId))
                                .filter((role) => role !== null && role !== undefined),
                        },
                        user: foundUser!,
                    },
                });

                continue;
            }

            // ? get their top role, if its hoisted then push the role into sections if it does not exist, and then push the user there
            // ? If we could not find a hoisted role, push them to online
            const topRole = member.roles
                .map((roleId) => roles.find((role) => role.id === roleId))
                .filter((role) => role !== undefined && role.color !== 0)
                .sort((a, b) => a!.position - b!.position)
                .reverse()[0];

            if (!topRole) {
                defaultSections[1].members.push({
                    color: topColorRole ? topColorRole.toString(16) : null,
                    member: {
                        member: {
                            ...member,
                            roles: member.roles
                                .map((roleId) => roles.find((role) => role.id === roleId))
                                .filter((role) => role !== null && role !== undefined),
                        },
                        user: foundUser!,
                    },
                });

                continue;
            }

            if (topRole.hoisted) {
                const section = defaultSections.find((section) => section.name === topRole?.name);

                if (!section) {
                    defaultSections.push({
                        name: topRole.name,
                        id: topRole.id,
                        members: [
                            {
                                color: topColorRole ? topColorRole.toString(16) : null,
                                member: {
                                    member: {
                                        ...member,
                                        roles: member.roles
                                            .map((roleId) => roles.find((role) => role.id === roleId))
                                            .filter((role) => role !== null && role !== undefined),
                                    },
                                    user: foundUser!,
                                },
                            },
                        ],
                        position: topRole.position,
                    });

                    continue;
                }

                section.members.push({
                    color: topColorRole ? topColorRole.toString(16) : null,
                    member: {
                        member: {
                            ...member,
                            roles: member.roles
                                .map((roleId) => roles.find((role) => role.id === roleId))
                                .filter((role) => role !== null && role !== undefined),
                        },
                        user: foundUser!,
                    },
                });

                continue;
            }

            let found = false;

            for (let i = topRole.position - 1; i >= 0; i--) {
                const role = roles.find((role) => role.position === i);

                if (!role) continue;

                const section = defaultSections.find((section) => section.name === role.name);

                if (!section) continue;

                section.members.push({
                    color: topColorRole ? topColorRole.toString(16) : null,
                    member: {
                        member: {
                            ...member,
                            roles: member.roles
                                .map((roleId) => roles.find((role) => role.id === roleId))
                                .filter((role) => role !== null && role !== undefined),
                        },
                        user: foundUser!,
                    },
                });

                found = true;

                break;
            }

            if (!found) {
                defaultSections[1].members.push({
                    color: topColorRole ? topColorRole.toString(16) : null,
                    member: {
                        member: {
                            ...member,
                            roles: member.roles
                                .map((roleId) => roles.find((role) => role.id === roleId))
                                .filter((role) => role !== null && role !== undefined),
                        },
                        user: foundUser!,
                    },
                });
            }
        }

        defaultSections.sort((a, b) => a.position - b.position).reverse();

        const filtered = defaultSections.filter((section) => section.members.length > 0);

        setSections((prev) => {
            if (deepEqual(prev, filtered)) return prev;

            return filtered;
        });
    };

    useEffect(() => {
        const roles = useRoleStore.getState().getRoles(currentHubId);
        const members = useMemberStore.getState().getMembers(currentHubId);

        if (!deepEqual(roles, roleRef.current) || !deepEqual(members, memberRef.current)) {
            roleRef.current = roles;
            memberRef.current = members;

            sort(members, roles);
        }
    }, [currentHubId]);

    const toggleSection = (roleId: string) => {
        setSections((prev) =>
            prev.map((section) => {
                if (section.id !== roleId) return section;

                return {
                    ...section,
                    collapsed: !section.collapsed,
                };
            })
        );
    }

    return (
        <div className={cn("w-60 bg-darkAccent ", className)}>
            <div className="flex-grow">
                <div className="p-2">
                    {sections.map((section) => (
                        <div key={section.id} className="mb-4">
                            <Button
                                variant="ghost"
                                onClick={() => toggleSection(section.id)}
                                className="w-full justify-between px-2 py-1"
                            >
                                <span className="text-xs font-semibold uppercase text-white" style={{
                                    color: section.color ? `#${section.color}` : ""
                                }}>
                                    {section.name} — {section.members.length}
                                </span>
                                {section.collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                            {section.collapsed ? section.members.some((member) => member.member.user.isClient) ? (
                                <div className="ml-1">
                                    {section.members.filter((member) => member.member.user.isClient).map((member) => (
                                        <MemberItem
                                            key={member.member.user.id}
                                            member={member.member}
                                            channelId={channelId}
                                            color={member.color}
                                        />
                                    ))}
                                </div>
                            ) : null : (
                                <div className="ml-1">
                                    {section.members.map((member) => (
                                        <MemberItem
                                            key={member.member.user.id}
                                            member={member.member}
                                            channelId={channelId}
                                            color={member.color}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MembersNavBar;