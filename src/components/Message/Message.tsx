import { Avatar, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import UserPopover from "../Popovers/UserPopover.tsx";
import { useState } from "react";

import { Reply } from "lucide-react";

const Message = ({ content, replying }: { content: string; replying: boolean; }) => {
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
        <div className="w-full hover:bg-msg-hover flex flex-col mb-2">
            <div className="ml-4">
                {replying && <div className="flex items-center ml-4">
                    <Reply size={22} color="#acaebf" className="cursor-pointer" style={{
                        transform: "rotate(180deg) scale(1, -1)"
                    }} />
                    <PopOverData>
                        <div className="flex items-center cursor-pointer">
                            <Avatar src="https://development.kastelapp.com/icon-1.png" className="ml-2 cursor-pointer w-4 h-4" />
                            <p className="text-orange-500 font-semibold text-xs ml-1">DarkerInk</p>
                        </div>
                    </PopOverData>
                    <p className="text-gray-300 text-2xs ml-2">Hello World</p>
                </div>}
                <div className="flex items-center justify-between">
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
        </div>
    );
};

export default Message;