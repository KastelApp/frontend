import { Avatar, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import UserPopover from "../Popovers/UserPopover.tsx";
import { useState } from "react";

const Message = ({ content }: { content: string; }) => {
    const PopOverData = ({ children }: {
        children: React.ReactElement | React.ReactElement[];
    }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <Popover placement="right" isOpen={isOpen}
                onOpenChange={setIsOpen}
                shouldCloseOnInteractOutside={() => {
                    setIsOpen(false);
                    return false;
                }}
            >
                <PopoverTrigger>
                    {children}
                </PopoverTrigger>
                <PopoverContent>
                    <UserPopover member={{
                        avatar: "https://development.kastelapp.com/icon-1.png",
                        customStatus: "Hey",
                        discriminator: "0001",
                        id: "1",
                        isOwner: false,
                        roles: ["admin"],
                        status: "online",
                        tag: null,
                        username: "DarkerInk"
                    }} />
                </PopoverContent>
            </Popover>
        );
    };

    return (
        <div className="w-full hover:bg-msg-hover flex flex-col">
            <div className="flex items-center justify-between p-2">
                <div className="flex items-center">
                    <PopOverData>
                        <Avatar src="https://development.kastelapp.com/icon-1.png" className="cursor-pointer w-9 h-9 hover:scale-95 transition-all duration-300 ease-in-out transform" imgProps={{ className: "transition-none" }} />
                    </PopOverData>
                    <div className="ml-2">
                        <span className="flex">
                            <PopOverData>
                                <p className="text-orange-500 font-semibold cursor-pointer">DarkerInk</p>
                            </PopOverData>
                            <p className="text-gray-400 text-xs mt-1 ml-2">Today at 12:00 PM</p>
                        </span>
                        <p className="text-white">{content}</p>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Message;