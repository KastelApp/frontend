import StaffBadge from "./Staff.tsx";
import BugHunterLevel1 from "./BugHunter1.tsx";
import BugHunterLevel2 from "./BugHunter2.tsx";
import BugHunterLevel3 from "./BugHunter3.tsx";
import { publicFlags } from "@/data/constants.ts";
import Contributor from "@/badges/Contributor.tsx";
import Moderator from "@/badges/Moderator.tsx";
import Partner from "@/badges/Partner.tsx";
import BotBadge from "@/badges/BotBadge.tsx";
import Sponsor from "@/badges/Sponsor.tsx";

const Badge = ({ flag, size = 24 }: { flag: keyof typeof publicFlags; size?: number }) => {
	switch (flag) {
		case "StaffBadge": {
			return <StaffBadge size={size} />;
		}

		case "BugHunterLevel1": {
			return <BugHunterLevel1 size={size} />;
		}

		case "BugHunterLevel2": {
			return <BugHunterLevel2 size={size} />;
		}

		case "BugHunterLevel3": {
			return <BugHunterLevel3 size={size} />;
		}

		case "DeveloperBadge": {
			return <Contributor size={size} />;
		}

		case "ModeratorBadge": {
			return <Moderator size={size} />;
		}

		case "PartnerBadge": {
			return <Partner size={size} />;
		}

		case "VerifiedBotDeveloperBadge": {
			return <BotBadge size={size} />;
		}

		case "SponsorBadge": {
			return <Sponsor size={size} />;
		}

		default: {
			return null;
		}
	}
};

export default Badge;
