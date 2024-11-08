import StaffBadge from "@/badges/Staff.tsx";
import { HubFeatures } from "@/utils/Constants.ts";
import { BadgeCheck } from "lucide-react";
import Tooltip from "./Tooltip.tsx";

const GetHubText = ({ features }: { features: string[] }) => {
	let texts = [];

	if (features.includes(HubFeatures.Verified)) texts.push(HubFeatures.Verified);

	if (features.includes(HubFeatures.Partnered)) texts.push(HubFeatures.Partnered);

	if (features.includes(HubFeatures.Official)) {
		texts = [];

		texts.push(HubFeatures.Official);
	}

	return texts.join(" & ");
};

const HubIcon = ({ features }: { features: string[] }) => {
	const text = GetHubText({ features });

	if (features.includes(HubFeatures.Official)) {
		return (
			<Tooltip content={text} showArrow>
				<div>
					<StaffBadge size={18} />
				</div>
			</Tooltip>
		);
	}

	if (features.includes(HubFeatures.Verified)) {
		return (
			<Tooltip content={text} showArrow>
				<div>
					<BadgeCheck size={18} color="#17c964" strokeWidth={3} />
				</div>
			</Tooltip>
		);
	}
};

export default HubIcon;
