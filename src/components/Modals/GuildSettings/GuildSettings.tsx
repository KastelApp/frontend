import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import ConfirmDelete from "../ConfirmDelete.tsx";
import Overview from "./OverView.tsx";

interface Section {
    title: string | null;
    children: {
        title: string;
        id: string;
        startContent?: React.ReactElement | React.ReactElement[];
        endContent?: React.ReactElement | React.ReactElement[];
        disabled?: boolean;
        section?: React.ReactElement | React.ReactElement[];
        danager?: boolean;
        onClick?: () => void;
    }[];
}

const Section = ({
    title,
    children,
    setSection
}: {
    title: string | null;
    children: Section["children"];
    setSection: (section: string) => void;
}) => {
    return (
        <div className="flex flex-col gap-2 p-4">
            {title && <h2 className="text-md font-semibold select-none mb-4 text-white ml-4">{title}</h2>}
            {children.map((child) => (
                <div
                    key={child.title}
                    className={twMerge(
                        "flex items-center justify-between w-full h-14 cursor-pointer rounded-lg mb-0.5 transition-all duration-300 ease-in-out transform group active:scale-[.97]",
                        child.disabled ? "cursor-not-allowed" : "",
                        child.danager ? "bg-danger/20 hover:bg-danger/15 text-danger focus:bg-danger/20" : "text-white hover:bg-slate-800 bg-gray-900"
                    )}
                    onClick={() => {
                        if (child.onClick) {
                            child.onClick();
                        }

                        if (!child.disabled && child.section) {
                            setSection(child.id);
                        }
                    }}
                >
                    <div className="flex items-center">
                        {child.startContent}
                        <p className=" truncate ml-2 text-md">{child.title}</p>
                    </div>
                    {child.endContent}
                </div>
            ))}
        </div>
    );
};

const GuildSettings = ({
    isOpen,
    onOpenChange
}: {
    isOpen: boolean;
    onOpenChange: () => void;
    onClose: () => void;
}) => {

    const {
        isOpen: isConfirmDeleteOpen,
        onOpenChange: onOpenChangeConfirmDelete,
        onClose: onCloseConfirmDelete
    } = useDisclosure();

    const sections: Section[] = [
        {
            title: null,
            children: [
                {
                    title: "Overview",
                    id: "overview",
                    section: <Overview />,
                    disabled: false
                },
                {
                    title: "Roles",
                    id: "roles",
                    section: <div>Roles</div>,
                    disabled: false
                },
                {
                    title: "Emojis",
                    id: "emojis",
                    section: <div>Emojis</div>,
                    disabled: false
                },
                {
                    title: "Vanity URL",
                    id: "vanity-url",
                    section: <div>Vanity URL</div>,
                    disabled: false
                }
            ]
        },
        {
            title: "User Management",
            children: [
                {
                    title: "Co-Owners",
                    id: "co-owners",
                    section: <div>Co-Owners</div>,
                    disabled: false
                },
                {
                    title: "Members",
                    id: "members",
                    section: <div>Members</div>,
                    disabled: false
                },
                {
                    title: "Bans",
                    id: "bans",
                    section: <div>Bans</div>,
                    disabled: false
                },
                {
                    title: "Invites",
                    id: "invites",
                    section: <div>Invites</div>,
                    disabled: false
                }
            ]
        },
        {
            title: null,
            children: [
                {
                    title: "Delete",
                    id: "delete",
                    disabled: false,
                    danager: true,
                    onClick: () => {
                        onOpenChangeConfirmDelete();
                    }
                }
            ]
        }
    ];

    const [section, setSection] = useState("overview");

    return (
        <>
            <ConfirmDelete isOpen={isConfirmDeleteOpen} onOpenChange={onOpenChangeConfirmDelete} onClose={onCloseConfirmDelete} />
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="full"
                className="w-screen h-screen"
                isDismissable={false} isKeyboardDismissDisabled={true}
            >
                <ModalContent>
                    <div className="flex flex-row w-full h-full m-0 overflow-x-hidden">
                        <div
                            className={twMerge(
                                "w-60 h-full m-0 bg-accent overflow-y-auto overflow-x-hidden"
                            )}
                        >
                            <p className="text-white text-md font-semibold p-4">This is a test — Settings</p>
                            {sections.map((section) => (
                                // eslint-disable-next-line react/no-children-prop
                                <Section title={section.title} key={section.title} children={section.children} setSection={setSection} />
                            ))}
                        </div>
                        {/* {
                            sections.find((s) => s.children.find((c) => c.id === section))?.children.find((c) => c.id === section)?.section
                        } */}
                        <div className="flex flex-col w-full h-full">
                            <div className="flex flex-col w-full h-full p-12 pt-8">
                                {sections.find((s) => s.children.find((c) => c.id === section))?.children.find((c) => c.id === section)?.section}
                            </div>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GuildSettings;