import { Avatar, Button, Chip } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "@nextui-org/react";
import { useTranslationStore } from "@/wrapper/Stores.ts";
import { Invite } from "@/wrapper/Stores/InviteStore.ts";
import { Guild } from "@/wrapper/Stores/GuildStore.ts";

const InviteEmbed = ({
    invite,
    skeleton
}: {
    invite: Invite & {
        guild: Guild | null;
    } | null;
    skeleton?: boolean;
}) => {
    const { t } = useTranslationStore();

    // const currentGuild = {
    //     name: "Kastel Development",
    //     owner: true,
    //     icon: {
    //         text: "Official & Partnered",
    //         icon: <BadgeCheck size={18} color="#17c964" strokeWidth={3} />,
    //     }
    // };

    return (
        <div className="rounded-md inline-block bg-lightAccent dark:bg-darkAccent select-none min-w-[28rem] max-w-[28rem]">
            {!skeleton && <p className={twMerge("pl-3 pr-3 pt-3", !invite?.valid ? "text-danger" : "text-white")}>{invite?.valid ? t("guilds.invites.validInvite") : t("guilds.invites.invalidInvite")}</p>}
            {skeleton && <Skeleton className="rounded-lg cursor-pointer max-h-4 min-h-4 pt-3 pl-3 pr-3 max-w-64 mt-3 ml-3" />}
            <div className="flex items-center p-3">
                {!skeleton && <Avatar
                    name={invite?.guild?.name ?? "Invalid Invite"}
                    src={"/icon-1.png"}
                    className="min-w-10 max-w-10 max-h-10 min-h-10 rounded-xl"
                    imgProps={{ className: "transition-none" }}
                />}
                {skeleton && <Skeleton className="mt-1 ml-2 cursor-pointer min-w-10 max-w-10 max-h-10 min-h-10 rounded-xl hover:scale-95 transition-all duration-300 ease-in-out transform" />}
                <div className="flex flex-col ml-3">
                    <div className="flex items-center gap-1">
                        {!skeleton && <p className={twMerge("truncate font-semibold max-w-52", !invite?.valid ? "text-danger" : "text-white")}>{invite?.valid ? invite.guild!.name : "Invalid Invite"}</p>}
                        {skeleton && <Skeleton className="rounded-lg cursor-pointer max-h-4 min-h-4" style={{ minWidth: 60, maxWidth: 60 }} />}
                        {/* {currentGuild.icon && (
                            <Tooltip content={currentGuild.icon.text} showArrow>
                                <div>{currentGuild.icon.icon}</div>
                            </Tooltip>
                        )} */}
                    </div>
                    <div className="flex">
                        {invite?.valid && (
                            <>
                                {/* <Chip variant="dot" color="success" className="border-0 p-0 text-white">{invite.guild.members.online} {t("guilds.online")}</Chip> */}
                                <Chip variant="dot" color="secondary" className="border-0 p-0 text-white">{invite.guild!.memberCount} {t("guilds.members")}</Chip>
                            </>
                        )}
                        {!invite?.valid && <p className="text-white">Try asking for a new invite.</p>}
                    </div>
                </div>
                <Button className="rounded-md h-8 ml-auto" color="success" isDisabled={!invite?.valid}>{t("guilds.invites.join")}</Button>
            </div>
        </div>
    );
};

export default InviteEmbed;