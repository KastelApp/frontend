import { Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react";
import { ArrowRight, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import CustomStatus from "../Modals/CustomStatus.tsx";

const UserOptions = ({
    children
}: {
    children: React.ReactElement | React.ReactElement[];
}) => {
    const [statusOpen, setStatusOpen] = useState(false);
    const [status, setStatus] = useState<"Online" | "Invisible" | "DND" | "Idle">("Invisible");

    const color = status === "Online" ? "success" : status === "Idle" ? "warning" : status === "DND" ? "danger" : "gray-500";

    const {
        isOpen,
        onOpenChange,
        onClose
    } = useDisclosure();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div onContextMenu={(e) => {
            e.preventDefault();

            setDropdownOpen(!dropdownOpen);

            if (!dropdownOpen) {
                setStatusOpen(false);
            }
        }}>
            <CustomStatus isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
            <Dropdown placement="right" closeOnSelect={false} onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setDropdownOpen(false);
                    setStatusOpen(false);
                }
            }} isOpen={dropdownOpen}>
                <DropdownTrigger>
                    <div>
                        {children}
                    </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions" onAction={(key) => {
                    switch (key) {
                        case "changeStatus": {
                            setStatusOpen(!statusOpen);

                            break;
                        }

                        case "customStatus": {
                            onOpenChange();
                            setDropdownOpen(false);

                            break;
                        }
                    }
                }}>
                    <DropdownItem closeOnSelect={false} key="changeStatus" variant="flat" endContent={<ArrowRight size={20} className={twMerge("transition-transform duration-300", statusOpen ? "rotate-90" : "")} />}>
                        <p>Status</p>
                        <p className={twMerge("text-xs mt-1", `text-${color}`)}>{status}</p>
                        <motion.div
                            className="grid grid-cols-[repeat(2,minmax(0px,1fr))] items-center mt-2"
                            initial="collapsed"
                            animate={statusOpen ? "expanded" : "collapsed"}
                            variants={{
                                collapsed: { height: 0, opacity: 0 },
                                expanded: { height: "auto", opacity: 1 },
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <Chip onClick={() => {
                                setStatusOpen(true);
                                setStatus("Online");
                            }} variant="flat" className="mb-2 min-w-[60px]" radius="sm" size="sm" color="success">Online</Chip>
                            <Chip onClick={() => {
                                setStatusOpen(true);
                                setStatus("Idle");
                            }} variant="flat" className="right-2 mb-2 min-w-[60px]" radius="sm" size="sm" color="warning">Idle</Chip>
                            <Chip onClick={() => {
                                setStatusOpen(true);
                                setStatus("DND");
                            }} variant="flat" className="mb-2 min-w-[60px]" radius="sm" size="sm" color="danger">DND</Chip>
                            <Chip onClick={() => {
                                setStatusOpen(true);
                                setStatus("Invisible");
                            }} variant="flat" className="right-2 mb-2 min-w-[60px]" radius="sm" size="sm" color="default">Invisible</Chip>
                        </motion.div>
                    </DropdownItem>

                    <DropdownItem closeOnSelect={true} key="customStatus" variant="flat">
                        <p>Custom Status</p>
                        <p className="text-xs text-gray-500">My Custom Status</p>
                    </DropdownItem>
                    <DropdownItem key="edit" variant="flat" endContent={<Settings size={20} />}>Settings</DropdownItem>
                    <DropdownItem key="delete" variant="flat" className="text-danger" color="danger" endContent={<LogOut size={20} />}>
                        Logout
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

export default UserOptions;