import AllBadges from "@/badges/AllBadges.tsx";
import { Avatar, Badge, Card, CardBody, Chip, Divider } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";

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

const UserPopover = ({
    member
}: {
    member: Member;
}) => {
    return (
        <div>
            <div className="rounded-lg p-0 w-64">
                <div>
                    <div className="flex">
                        <Badge content={""} placement="bottom-right" size="lg" color={member.status === "online" ? "success" : member.status === "idle" ? "warning" : member.status === "dnd" ? "danger" : "default"} className="mb-2 right-1">
                            <Avatar src={member.avatar ?? undefined} alt="User Avatar" size="lg" />
                        </Badge>
                    </div>
                    <div className="flex items-end justify-end">
                        <div className="bg-[#131315] rounded-md p-1">
                            <AllBadges privateFlags="0" publicFlags="999999999999" size={18} />
                        </div>
                    </div>
                    <Divider className="mt-2" />
                </div>
                <div>
                    <Card className="mt-2 mb-2" isBlurred>
                        <CardBody>
                            <div>
                                <p className="text-white text-lg font-semibold">{member.username}</p>
                                <p className="text-gray-300 text-[0.7rem]">{member.username}#{member.discriminator}</p>
                                {member.customStatus && <p className="text-gray-200 text-md mt-2 ml-1">{member.customStatus}</p>}
                            </div>
                            <Divider className="mt-2" />
                            <div className="mt-2">
                                <span className="text-gray-400">About Me:</span>
                                <p className="text-gray-300 mt-2">{"Hey"}</p>
                            </div>
                            <div className="mt-2">
                                <span className="text-gray-400">Roles:</span>
                                <div className="flex flex-wrap">
                                    {/* todo: refactor to use chips / badges */}
                                    {member.roles.map((role) => (
                                        <span key={role} className="bg-gray-700 text-white rounded-full px-2 py-1 mt-2 mr-2">{role}</span>
                                    ))}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserPopover;