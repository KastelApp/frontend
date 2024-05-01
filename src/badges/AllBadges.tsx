import FlagFields from "@/utils/FlagFields.ts";
import StaffBadge from "./Staff.tsx";
import { Tooltip } from "@nextui-org/react";
import BugHunterLevel1 from "./BugHunter1.tsx";
import BugHunterLevel2 from "./BugHunter2.tsx";
import BugHunterLevel3 from "./BugHunter3.tsx";
import { publicFlags as pubFlags } from "@/utils/Constants.ts";
import Sponsor from "./Sponsor.tsx";

const AllBadges = ({
    privateFlags,
    publicFlags,
    size = 24
}: {
    publicFlags: string;
    privateFlags: string;
    size?: number;
}) => {
    const flags = new FlagFields(privateFlags, publicFlags);

    const badges = Object.entries(flags.PublicFlags.toJSON()).filter(([, value]) => value === true).map(([key]) => key) as (keyof typeof pubFlags)[];

    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            {badges.map((flag) => {
                switch (flag) {
                    case "StaffBadge": {
                        return (
                            <div className="relative">
                                <Tooltip content="Staff" color="warning">
                                    <span className="text-lg text-warning cursor-pointer hover:opacity-75">
                                        <StaffBadge size={size} />
                                    </span>
                                </Tooltip>
                            </div>
                        );
                    }

                    case "BugHunterLevel1": {
                        return (
                            <div className="relative">
                                <Tooltip content="Minor Bug Hunter" color="success">
                                    <span className="text-lg text-success cursor-pointer hover:opacity-75">
                                        <BugHunterLevel1 size={size} />
                                    </span>
                                </Tooltip>
                            </div>
                        );
                    }

                    case "BugHunterLevel2": {
                        return (
                            <div className="relative">
                                <Tooltip content="Intermediate Bug Hunter" color="warning">
                                    <span className="text-lg text-success cursor-pointer hover:opacity-75">
                                        <BugHunterLevel2 size={size} />
                                    </span>
                                </Tooltip>
                            </div>
                        );
                    }

                    case "BugHunterLevel3": {
                        return (
                            <div className="relative">
                                <Tooltip showArrow content="Major Bug Hunter" color="secondary">
                                    <span className="text-lg text-success cursor-pointer hover:opacity-75">
                                        <BugHunterLevel3 size={size} />
                                    </span>
                                </Tooltip>
                            </div>
                        );
                    }

                    case "SponsorBadge": {
                        return (
                            <div className="relative">
                                <Tooltip content="Has Sponsored Kastel" color="secondary">
                                    <span className="text-lg text-secondary cursor-pointer hover:opacity-75">
                                        <Sponsor size={size} />
                                    </span>
                                </Tooltip>
                            </div>
                        );
                    }

                    default: {
                        return null;
                    }
                }
            })}
        </div>
    );
};

export default AllBadges;