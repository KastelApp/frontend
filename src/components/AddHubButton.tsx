import { useDisclosure } from "@nextui-org/react";
import { memo } from "react";
import { NavBarIcon } from "./NavBars/NavBarIcon.tsx";
import { Plus } from "lucide-react";
import HubModal from "./Modals/CreateHub.tsx";

const AddHubButton = memo(({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	return (
		<>
			<HubModal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
			<NavBarIcon
				onClick={() => {
					onOpenChange();
				}}
				icon={<Plus className="mt-1.5" color="#acaebf" absoluteStrokeWidth />}
				description="Add Hub"
				isNormalIcon
				orientation={orientation}
			/>
		</>
	);
});

export default AddHubButton;
