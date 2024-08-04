import FlagFields from "@/utils/FlagFields.ts";
import StaffBadge from "./Staff.tsx";
import BugHunterLevel1 from "./BugHunter1.tsx";
import BugHunterLevel2 from "./BugHunter2.tsx";
import BugHunterLevel3 from "./BugHunter3.tsx";
import { badgeOrder, publicFlags as pubFlags } from "@/utils/Constants.ts";
import Sponsor from "./Sponsor.tsx";
import { twMerge } from "tailwind-merge";
import Tooltip from "@/components/Tooltip.tsx";
import Moderator from "@/badges/Moderator.tsx";
import Contributor from "@/badges/Contributor.tsx";
import Partner from "@/badges/Partner.tsx";
import BotBadge from "@/badges/BotBadge.tsx";
import { useTranslationStore } from "@/wrapper/Stores.ts";

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
		.sort((a, b) => badgeOrder.indexOf(pubFlags[a as keyof typeof pubFlags]) - badgeOrder.indexOf(pubFlags[b as keyof typeof pubFlags]));

	return (
		<div className={twMerge("rounded-md pt-1.5 pr-1.5 bg-charcoal-600 flex flex-wrap justify-end max-w-48 w-fit")}>
			{badges.map((flag, index) => {
				switch (flag) {
					case "StaffBadge":
						return (
							<div key={index} className="relative flex-none w-1/5 p-1">
								<Tooltip content="Staff" color="secondary">
									<span className="text-lg text-warning cursor-pointer hover:opacity-75">
										<StaffBadge size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "BugHunterLevel1":
						return (
							<div key={index} className="relative flex-none w-1/5 p-1">
								<Tooltip content="Minor Bug Hunter" color="success">
									<span className="text-lg text-success cursor-pointer hover:opacity-75">
										<BugHunterLevel1 size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "BugHunterLevel2":
						return (
							<div key={index} className="relative flex-none w-1/5 p-1">
								<Tooltip content="Intermediate Bug Hunter" color="warning">
									<span className="text-lg text-success cursor-pointer hover:opacity-75">
										<BugHunterLevel2 size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "BugHunterLevel3":
						return (
							<div key={index} className="relative flex-none w-1/5 p-1">
								<Tooltip showArrow content="Major Bug Hunter" color="secondary">
									<span className="text-lg text-success cursor-pointer hover:opacity-75">
										<BugHunterLevel3 size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "SponsorBadge":
						return (
							<div key={index} className="relative flex-none w-1/5 p-1">
								<Tooltip content="Has Sponsored Kastel" color="secondary">
									<span className="text-lg text-secondary cursor-pointer hover:opacity-75">
										<Sponsor size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "ModeratorBadge":
						return (
							<div key={index} className="relative flex-none w-1/5 p-1">
								<Tooltip content="Moderator Program" color="primary">
									<span className="text-lg text-info cursor-pointer hover:opacity-75">
										<Moderator size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "DeveloperBadge":
						return (
							<div key={index} className="relative flex-none w-1/5 p-1">
								<Tooltip content="Developer" color="danger">
									<span className="text-lg text-danger cursor-pointer hover:opacity-75">
										<Contributor size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "PartnerBadge":
						return (
							<div key={index} className="relative flex-none w-1/5 p-1">
								<Tooltip content="Partner" color="success">
									<span className="text-lg text-success cursor-pointer hover:opacity-75">
										<Partner size={size} />
									</span>
								</Tooltip>
							</div>
						);
					case "VerifiedBotDeveloperBadge":
						return (
							<div key={index} className="relative flex-none w-1/5 p-1">
								<Tooltip content="Verified Bot Developer" color="danger">
									<span className="text-lg text-danger cursor-pointer hover:opacity-75">
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
