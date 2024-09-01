import { Avatar, Button, Chip } from "@nextui-org/react";
import cn from "@/utils/cn.ts";
import { Skeleton } from "@nextui-org/react";
import { useTranslationStore } from "@/wrapper/Stores.ts";
import { Invite } from "@/wrapper/Stores/InviteStore.ts";
import { Guild } from "@/wrapper/Stores/GuildStore.ts";

const InviteEmbed = ({
	invite,
	skeleton,
}: {
	invite:
		| (Invite & {
				guild: Guild | null;
		  })
		| null;
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
		<div className="inline-block min-w-[28rem] max-w-[28rem] select-none rounded-md bg-lightAccent dark:bg-darkAccent">
			{!skeleton && (
				<p className={cn("pl-3 pr-3 pt-3", !invite?.valid ? "text-danger" : "text-white")}>
					{invite?.valid ? t("guilds.invites.validInvite") : t("guilds.invites.invalidInvite")}
				</p>
			)}
			{skeleton && <Skeleton className="ml-3 mt-3 max-h-4 min-h-4 max-w-64 cursor-pointer rounded-lg pl-3 pr-3 pt-3" />}
			<div className="flex items-center p-3">
				{!skeleton && (
					<Avatar
						name={invite?.guild?.name ?? "Invalid Invite"}
						src={"/icon-1.png"}
						className="max-h-10 min-h-10 min-w-10 max-w-10 rounded-xl"
						imgProps={{ className: "transition-none" }}
					/>
				)}
				{skeleton && (
					<Skeleton className="ml-2 mt-1 max-h-10 min-h-10 min-w-10 max-w-10 transform cursor-pointer rounded-xl transition-all duration-300 ease-in-out hover:scale-95" />
				)}
				<div className="ml-3 flex flex-col">
					<div className="flex items-center gap-1">
						{!skeleton && (
							<p className={cn("max-w-52 truncate font-semibold", !invite?.valid ? "text-danger" : "text-white")}>
								{invite?.valid ? invite.guild!.name : "Invalid Invite"}
							</p>
						)}
						{skeleton && (
							<Skeleton className="max-h-4 min-h-4 cursor-pointer rounded-lg" style={{ minWidth: 60, maxWidth: 60 }} />
						)}
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
								<Chip variant="dot" color="secondary" className="border-0 p-0 text-white">
									{invite.guild!.memberCount} {t("guilds.members")}
								</Chip>
							</>
						)}
						{!invite?.valid && <p className="text-white">Try asking for a new invite.</p>}
					</div>
				</div>
				<Button className="ml-auto h-8 rounded-md" color="success" isDisabled={!invite?.valid}>
					{t("guilds.invites.join")}
				</Button>
			</div>
		</div>
	);
};

export default InviteEmbed;
