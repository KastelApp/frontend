// import Tooltip from "@/components/Tooltip.tsx";
import { Avatar, Button, Chip } from "@nextui-org/react";
// import { BadgeCheck } from "lucide-react";
import { twMerge } from "tailwind-merge";

const InviteEmbed = ({
    invite
}: {
    invite: {
        code: string;
        guild: {
            name: string;
            icon: string | null;
            members: {
                online: number;
                total: number;
            };
        };
    } | null;
}) => {

    // const currentGuild = {
    //     name: "Kastel Development",
    //     owner: true,
    //     icon: {
    //         text: "Official & Partnered",
    //         icon: <BadgeCheck size={18} color="#17c964" strokeWidth={3} />,
    //     }
    // };

    return (
        <div className="rounded-md inline-block bg-accent select-none min-w-[28rem] max-w-[28rem]">
            <p className={twMerge("pl-3 pr-3 pt-3", !invite ? "text-danger" : "text-white")}>{invite ? "You received an invite to join a guild!" : "Sorry, this invite is invalid or expired."}</p>
            <div className="flex items-center p-3">
                <Avatar
                    name={invite?.guild.name ?? "Invalid Invite"}
                    src={"https://development.kastelapp.com/icon-1.png"}
                    className="min-w-10 max-w-10 max-h-10 min-h-10 rounded-xl"
                    imgProps={{ className: "transition-none" }}
                />
                <div className="flex flex-col ml-3">
                    <div className="flex items-center gap-1">
                        <p className={twMerge("truncate font-semibold max-w-52", !invite ? "text-danger" : "text-white")}>{invite?.guild.name ?? "Invalid Invite"}</p>
                        {/* {currentGuild.icon && (
                            <Tooltip content={currentGuild.icon.text} showArrow>
                                <div>{currentGuild.icon.icon}</div>
                            </Tooltip>
                        )} */}
                    </div>
                    {invite && (
                        <div className="flex">
                            <Chip variant="dot" color="success" className="border-0 p-0 text-white">{invite.guild.members.online} Online</Chip>
                            <Chip variant="dot" color="default" className="border-0 p-0 text-white">{invite.guild.members.total} Members</Chip>
                        </div>
                    )}
                </div>
                <Button className="rounded-md h-8 ml-auto" color="success" isDisabled={!invite}>Join</Button>
            </div>
        </div>
    );
};

export default InviteEmbed;