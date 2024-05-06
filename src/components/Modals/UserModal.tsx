import AllBadges from "@/badges/AllBadges.tsx";
import { Modal, ModalContent, ModalBody, Button, Badge, Avatar, Divider, Card, CardBody, useDisclosure } from "@nextui-org/react";
import { EllipsisVertical } from "lucide-react";
import BaseContextMenu from "../Dropdowns/BaseContextMenu.tsx";

const UserModal = ({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {

    const member = {
        avatar: "https://development.kastelapp.com/icon-1.png",
        customStatus: "Hey",
        discriminator: "0001",
        id: "1",
        isOwner: false,
        roles: ["admin"],
        status: "online",
        tag: null,
        username: "DarkerInk"
    };

    return (
        <>
            <Modal
                size={"3xl"}
                isOpen={isOpen}
                onClose={onClose}
                hideCloseButton
                placement="top-center"
                className="z-50 w-[100vw]"
        
            >
                <ModalContent>
                    <ModalBody>
                        <div className="rounded-lg p-0 w-full min-w-full">
                            <div>
                                <div className="flex items-end justify-between p-2">
                                    <div className="flex items-end justify-between">
                                        <Badge
                                            content={""}
                                            placement="bottom-right"
                                            className="mb-2 mr-2 h-6 w-6"
                                            color={member.status === "online" ? "success" : member.status === "idle" ? "warning" : member.status === "dnd" ? "danger" : "default"}
                                        >
                                            <Avatar src={member.avatar ?? undefined} alt="User Avatar" className="h-24 w-24" />
                                        </Badge>
                                        <div className="bg-[#131315] rounded-md p-1">
                                            <AllBadges privateFlags="0" publicFlags="999999999999" size={20} />
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-start">
                                        <Button color="success" className="max-h-8 min-h-8 min-w-36 max-w-36 rounded-md text-charcoal-600" radius="none">Send Friend Request</Button>
                                        <BaseContextMenu inverse values={[
                                            {
                                                label: "Block",
                                                props: {
                                                    color: "danger",
                                                    variant: "flat",
                                                    className: "text-danger"
                                                }
                                            }
                                        ]} placement="right">
                                            <EllipsisVertical size={24} className="cursor-pointer mt-1" />
                                        </BaseContextMenu>
                                    </div>
                                </div>
                                <Divider className="mt-2" />
                                <div>
                                    <Card className="mt-2 mb-2" isBlurred>
                                        <CardBody className="overflow-y-auto max-h-[85vh]">
                                            <div>
                                                <p className="text-white text-xl font-semibold">{member.username}</p>
                                                <p className="text-gray-300 text-sm">{member.username}#{member.discriminator}</p>
                                                {member.customStatus && <p className="text-gray-200 text-md mt-2 ml-1">{member.customStatus}</p>}
                                            </div>
                                            <Divider className="mt-2" />
                                            <div className="mt-2">
                                                <span className="text-gray-400">About Me:</span>
                                                <p className="text-gray-300 mt-2">{"Hey"}</p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </ModalBody>

                </ModalContent>
            </Modal>

        </>
    );
};

const ControlledUserModal = ({
    children,
    onClick,
    className
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}) => {
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclosure();

    return (
        <>
            <div onClick={() => {
                onOpen()
                
                if (onClick) {
                    onClick();
                }
            }} className={className}>
                {children}
            </div>
            <UserModal isOpen={isOpen} onClose={onClose} />
        </>
    );
}

export default UserModal;

export {
    ControlledUserModal
}