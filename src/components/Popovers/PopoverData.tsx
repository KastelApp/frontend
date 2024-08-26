import UserModal from "@/components/Modals/UserModal.tsx";
import UserPopover from "@/components/Popovers/UserPopover.tsx";
import { Member } from "@/wrapper/Stores/Members.ts";
import { Role } from "@/wrapper/Stores/RoleStore.ts";
import { User } from "@/wrapper/Stores/UserStore.ts";
import { Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@nextui-org/react";
import { useState } from "react";

const PopOverData = ({ children, member, user, onlyChildren }: {
    children: React.ReactElement | React.ReactElement[];
    user: User;
    member: (Omit<Member, "roles"> & {
        roles: Role[];
    }) | null;
    onlyChildren?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();

    if (onlyChildren) return <>{children}</>;

    return (
        <>
            <UserModal isOpen={isModalOpen} onClose={onClose} user={user} />
            <Popover
                placement="right"
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                shouldCloseOnInteractOutside={() => {
                    setIsOpen(false);
                    return false;
                }}
            >
                <PopoverTrigger>{children}</PopoverTrigger>
                <PopoverContent>
                    <UserPopover
                        member={{
                            user: user,
                            member: member ?? null
                        }}
                        onClick={() => {
                            onOpen();
                            setIsOpen(false);
                        }}
                    />
                </PopoverContent>
            </Popover>
        </>
    );
};

export default PopOverData;