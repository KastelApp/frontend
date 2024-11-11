import UserModal from "@/components/Modals/UserModal.tsx";
import UserPopover from "@/components/Popovers/UserPopover.tsx";
import { modalStore } from "@/wrapper/Stores/GlobalModalStore.ts";
import { Member } from "@/wrapper/Stores/Members.ts";
import { Role } from "@/wrapper/Stores/RoleStore.ts";
import { User } from "@/wrapper/Stores/UserStore.ts";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useState } from "react";

const PopOverData = ({
	children,
	member,
	user,
	onlyChildren,
}: {
	children: React.ReactElement | React.ReactElement[];
	user: User;
	member:
		| (Omit<Member, "roles"> & {
				roles: Role[];
		  })
		| null;
	onlyChildren?: boolean;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	if (onlyChildren) return <>{children}</>;

	return (
		<>
			<Popover
				placement="right"
				isOpen={isOpen}
				onOpenChange={setIsOpen}
				shouldCloseOnInteractOutside={(e) => {
					const identifier = e.getAttribute("data-identifier");

					if (identifier === "role") {
						return false;
					}

					// ? get its parent if it has one and check
					const parent = e.parentElement;

					if (!parent) {
						setIsOpen(false);

						return false;
					}

					const parentIdentifier = parent.getAttribute("data-identifier");

					if (parentIdentifier === "role") {
						return false;
					}

					setIsOpen(false);

					return false;
				}}
				classNames={{
					trigger: "z-0",
				}}
			>
				<PopoverTrigger>{children}</PopoverTrigger>
				<PopoverContent className="z-50 rounded-lg border-3 border-charcoal-700 bg-darkAccent px-0 py-0">
					<UserPopover
						member={{
							user: user,
							member: member ?? null,
						}}
						onPress={() => {
							modalStore.getState().createModal({
								id: `user-modal-${user.id}`,
								body: <UserModal user={user} />,
								hideCloseButton: true,
								props: {
									modalSize: "lg",
									radius: "none",
									classNames: {
										body: "p-0",
									},
								},
							});
							setIsOpen(false);
						}}
					/>
				</PopoverContent>
			</Popover>
		</>
	);
};

export default PopOverData;
