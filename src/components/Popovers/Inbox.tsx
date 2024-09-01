import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useState } from "react";

const Inbox = ({ children }: { children: React.ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popover
			isOpen={isOpen}
			onOpenChange={setIsOpen}
			shouldCloseOnInteractOutside={() => {
				setIsOpen(false);
				return false;
			}}
			placement="bottom"
		>
			<PopoverTrigger>{children}</PopoverTrigger>
			<PopoverContent>hi</PopoverContent>
		</Popover>
	);
};

export default Inbox;
