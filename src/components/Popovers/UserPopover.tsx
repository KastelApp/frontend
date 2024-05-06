import AllBadges from "@/badges/AllBadges.tsx";
import { Avatar, Badge, Card, CardBody, Divider } from "@nextui-org/react";
import { X } from "lucide-react";

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
    member,
    onClick
}: {
    member: Member;
    onClick?: () => void;
}) => {
    return (
        <div>
            <div className="rounded-lg p-0 w-[18.70rem]">
                <div>
                    <div className="flex items-end justify-between p-2">
                        <Badge
                            content={""}
                            placement="bottom-right"
                            size="lg"
                            color={member.status === "online" ? "success" : member.status === "idle" ? "warning" : member.status === "dnd" ? "danger" : "default"}
                            className="mb-2 right-1"
                        >
                            <div className="avatar-container relative cursor-pointer transition-opacity duration-300 ease-in-out group" onClick={onClick}>
                                <Avatar src={member.avatar ?? undefined} alt="User Avatar" className="w-16 h-16 inset-0" />
                                <p className="hidden group-hover:block text-white font-bold text-2xs absolute inset-0 ml-1 mt-5 w-full min-w-full items-center justify-center !z-20">View Profile</p>
                                <div className="group-hover:bg-opacity-50 rounded-full absolute inset-0 bg-black bg-opacity-0"></div>
                            </div>
                        </Badge>
                        <div className="flex items-end justify-end">
                            <div className="bg-[#131315] rounded-md p-1 ml-[-10px]">
                                <AllBadges privateFlags="0" publicFlags="999999999999" size={18} />
                            </div>
                        </div>
                    </div>
                    <Divider className="mt-2" />
                </div>

                <div>
                    <Card className="mt-2 mb-2" isBlurred>
                        <CardBody className="overflow-y-auto max-h-[85vh]">
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
                                <div className="flex flex-wrap select-none">
                                    {member.roles.map((role) => (
                                        <div className="flex flex-wrap bg-accent border-gray-400 border  rounded-md px-2 py-0 mt-2 mr-1 group" key={role}>
                                            {/* todo: fix, for some reason the X gets smaller when changing the px */}
                                            <span
                                                className="flex box-border rounded-full border-background bg-warning w-3.5 h-3.5 min-w-3.5 min-h-3.5 px-1 mt-[0.1rem] mr-1"
                                            >
                                                <X size={14} className="hidden group-hover:block" strokeWidth={8} color="gray" />
                                            </span>
                                            <span className=" text-white text-xs">{role}</span>
                                        </div>
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