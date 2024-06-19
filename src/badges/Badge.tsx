import StaffBadge from "./Staff.tsx";
import BugHunterLevel1 from "./BugHunter1.tsx";
import BugHunterLevel2 from "./BugHunter2.tsx";
import BugHunterLevel3 from "./BugHunter3.tsx";
import { publicFlags } from "@/utils/Constants.ts";

const Badge = ({ flag, size = 24 }: { flag: keyof typeof publicFlags; size?: number; }) => {
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

		default: {
			return null;
		}
	}
};

export default Badge;
