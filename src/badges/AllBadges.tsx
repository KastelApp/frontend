import FlagFields from "@/utils/FlagFields.ts";
import StaffBadge from "./Staff.tsx";
import BugHunterLevel1 from "./BugHunter1.tsx";
import BugHunterLevel2 from "./BugHunter2.tsx";
import BugHunterLevel3 from "./BugHunter3.tsx";
import { badgeOrder, publicFlags as pubFlags } from "@/data/constants.ts";
import Sponsor from "./Sponsor.tsx";
import Moderator from "@/badges/Moderator.tsx";
import Contributor from "@/badges/Contributor.tsx";
import Partner from "@/badges/Partner.tsx";
import BotBadge from "@/badges/BotBadge.tsx";
import { useTranslationStore } from "@/wrapper/Stores.tsx";
import cn from "@/utils/cn.ts";
import { Tooltip } from "@nextui-org/react";

/**
 * Just a small helper component to display all badges a user has.
 */
const AllBadges = ({
	privateFlags,
	publicFlags,
	size = 24,
}: {
	publicFlags: string;
	privateFlags: string;
	size?: number;
}) => {
	const { t } = useTranslationStore();

	const flags = new FlagFields(privateFlags, publicFlags);

	const badges = Object.entries(flags.PublicFlags.toJSON())
		.filter(([, value]) => value === true)
		.map(([key]) => key)
		.sort(
			(a, b) =>
				badgeOrder.indexOf(pubFlags[a as keyof typeof pubFlags]) -
				badgeOrder.indexOf(pubFlags[b as keyof typeof pubFlags]),
		);

	return (
		<div
			className={cn(
				"flex w-fit max-w-48 flex-wrap justify-end rounded-md p-1",
				badges.length > 0 ? "bg-[#131315]" : "",
			)}
		>
			{badges.map((flag, index) => {
				switch (flag) {
					case "StaffBadge":
						return (
							<div key={index} className="relative w-1/5 flex-none p-1">
								<Tooltip content={t("badges.staff.tooltip")}>
									<span className="cursor-pointer text-lg text-warning hover:opacity-75">
										<StaffBadge size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "BugHunterLevel1":
						return (
							<div key={index} className="relative w-1/5 flex-none p-1">
								<Tooltip content={t("badges.bug1.tooltip")}>
									<span className="cursor-pointer text-lg text-success hover:opacity-75">
										<BugHunterLevel1 size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "BugHunterLevel2":
						return (
							<div key={index} className="relative w-1/5 flex-none p-1">
								<Tooltip content={t("badges.bug2.tooltip")}>
									<span className="cursor-pointer text-lg text-success hover:opacity-75">
										<BugHunterLevel2 size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "BugHunterLevel3":
						return (
							<div key={index} className="relative w-1/5 flex-none p-1">
								<Tooltip showArrow content={t("badges.bug3.tooltip")}>
									<span className="cursor-pointer text-lg text-success hover:opacity-75">
										<BugHunterLevel3 size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "SponsorBadge":
						return (
							<div key={index} className="relative w-1/5 flex-none p-1">
								<Tooltip content={t("badges.sponsor.tooltip")}>
									<span className="cursor-pointer text-lg text-secondary hover:opacity-75">
										<Sponsor size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "ModeratorBadge":
						return (
							<div key={index} className="relative w-1/5 flex-none p-1">
								<Tooltip content={t("badges.moderator.tooltip")}>
									<span className="text-info cursor-pointer text-lg hover:opacity-75">
										<Moderator size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "DeveloperBadge":
						return (
							<div key={index} className="relative w-1/5 flex-none p-1">
								<Tooltip content={t("badges.contributor.tooltip")}>
									<span className="cursor-pointer text-lg text-danger hover:opacity-75">
										<Contributor size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "PartnerBadge":
						return (
							<div key={index} className="relative w-1/5 flex-none p-1">
								<Tooltip content={t("badges.partner.tooltip")}>
									<span className="cursor-pointer text-lg text-success hover:opacity-75">
										<Partner size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "VerifiedBotDeveloperBadge":
						return (
							<div key={index} className="relative w-1/5 flex-none p-1">
								<Tooltip content={t("badges.trustedBotDeveloper.tooltip")}>
									<span className="cursor-pointer text-lg text-danger hover:opacity-75">
										<BotBadge size={size} />
									</span>
								</Tooltip>
							</div>
						);
					default:
						return null;
				}
			})}
		</div>
	);
};

export default AllBadges;
