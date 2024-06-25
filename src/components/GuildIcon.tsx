import StaffBadge from "@/badges/Staff.tsx";
import { GuildFeatures } from "@/utils/Constants.ts";
import { BadgeCheck } from "lucide-react";
import Tooltip from "./Tooltip.tsx";

const GetGuildText = ({ features }: { features: string[]; }) => {
    let texts = [];

    if (features.includes(GuildFeatures.Verified)) texts.push(GuildFeatures.Verified);

    if (features.includes(GuildFeatures.Partnered)) texts.push(GuildFeatures.Partnered);

    if (features.includes(GuildFeatures.Official)) {
        texts = [];

        texts.push(GuildFeatures.Official);
    }

    return texts.join(" & ");
};

const GuildIcon = ({ features }: { features: string[]; }) => {
    const text = GetGuildText({ features });

    if (features.includes(GuildFeatures.Official)) {
        return (
            <Tooltip content={text} showArrow>
                <div><StaffBadge size={18} /></div>
            </Tooltip>
        );
    }

    if (features.includes(GuildFeatures.Verified)) {
        return (
            <Tooltip content={text} showArrow>
                <div><BadgeCheck size={18} color="#17c964" strokeWidth={3} /></div>
            </Tooltip>
        );
    }
};

export default GuildIcon;