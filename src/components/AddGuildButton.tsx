import { useDisclosure } from "@nextui-org/react";
import { memo } from "react";
import { NavBarIcon } from "./NavBars/NavBarIcon.tsx";
import { Plus } from "lucide-react";
import GuildModal from "./Modals/CreateGuild.tsx";

const AddGuildButton = memo(({
    orientation = "vertical"
}: {
    orientation?: "vertical" | "horizontal";
}) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	return (
		<>
			<GuildModal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
			<NavBarIcon
				onClick={() => {
					onOpenChange();
				}}
				icon={<Plus className="mt-1.5" color="#acaebf" absoluteStrokeWidth />}
				description="Add Guild"
                isNormalIcon
                orientation={orientation}
			/>
		</>
	);
});

export default AddGuildButton;