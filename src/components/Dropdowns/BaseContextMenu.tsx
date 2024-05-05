import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface ModalOptions {
    close: () => void;
}

interface BaseContextMenuProps {
    values: {
        startContent?: React.ReactElement;
        endContent?: React.ReactElement;
        label: string;
        subValues?: { // ? we only allow for one recursion for now (maybe later if needed?)
            label: string;
            startContent?: React.ReactElement;
            endContent?: React.ReactElement;
            onClick: (modal: ModalOptions) => void;
        }[];
        onClick?: (modal: ModalOptions) => void;
    }[];
    children: React.ReactElement | React.ReactElement[];
}

const BaseContextMenu = ({
    values,
    children // ? this is the trigger
}: BaseContextMenuProps) => {
    const {
        isOpen,
        onClose,
        onOpen
    } = useDisclosure();

    const [data, setData] = useState<{
        isOpen: boolean,
        key: number;
    }>({
        isOpen: false,
        key: -1
    });

    return (
        <Dropdown isOpen={isOpen} onOpenChange={(v) => {
            if (!v) {
                onClose();

                setData({
                    isOpen: false,
                    key: -1
                });
            }
        }} placement="bottom-end" radius="md" closeOnSelect={false}>
            <DropdownTrigger>
                <div onContextMenu={(e) => {
                    e.preventDefault();

                    onOpen();
                }}>
                    {children}
                </div>
            </DropdownTrigger>
            <DropdownMenu onAction={(key) => {
                const found = values[key as number];

                if (!found.onClick) return;

                found.onClick({
                    close: () => {
                        onClose();
                    }
                });
            }}>
                {values.map((value, index) => {
                    const PossiblyDropdown = ({ children }: {
                        children: React.ReactElement | React.ReactElement[];
                    }) => {
                        if (!value.subValues) return children as React.ReactElement;

                        return (
                            <Dropdown isOpen={data.isOpen && data.key == index} onOpenChange={(v) => {
                                if (!v) {
                                    setData({
                                        isOpen: false,
                                        key: -1
                                    });
                                }
                            }} placement="right" offset={5} radius="md" closeOnSelect={false}>
                                <DropdownTrigger className="rounded-md aria-expanded:scale-100 aria-expanded:opacity-100" >
                                    <div>
                                        {children}
                                    </div>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    {value.subValues.map((subValue, subIndex) => (
                                        <DropdownItem key={subIndex} onClick={() => {
                                            subValue.onClick({
                                                close: () => {
                                                    setData({
                                                        isOpen: false,
                                                        key: -1
                                                    });
                                                }
                                            });
                                        }}>
                                            <div className="flex flex-row items-center">
                                                {subValue.startContent &&
                                                    <div className="mr-auto ml-2 my-auto">
                                                        {subValue.startContent}
                                                    </div>}
                                                <span>{subValue.label}</span>
                                                <div className="ml-auto">
                                                    {subValue.endContent}
                                                </div>
                                            </div>
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        );
                    };

                    return (
                        <DropdownItem key={index} onMouseEnter={() => {
                            if (data.isOpen) return;

                            setData({
                                isOpen: true,
                                key: index
                            });

                        }} onMouseLeave={() => {
                            setData({
                                isOpen: false,
                                key: -1
                            });
                        }} className="rounded-md">
                            <PossiblyDropdown>
                                <div className="flex items-center">
                                    <span>{value.label}</span>
                                    {value.subValues && <ChevronRight size={20} className="ml-auto" />}
                                </div>
                            </PossiblyDropdown>
                        </DropdownItem>
                    );
                })}
            </DropdownMenu>
        </Dropdown>
    );
};

export default BaseContextMenu;