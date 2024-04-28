import { Divider, Tooltip } from "@nextui-org/react";
import { CircleHelp, Inbox, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

interface Icon {
    icon: React.ReactNode;
    tooltip: string;
    onClick?: () => void;
}

const TopNavBar = ({
    beforeIcons,
    icons,
    endContent,
    startContent,
    isOpen,
    setIsOpen
}: {
    icons?: Icon[];
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    beforeIcons?: boolean;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}) => {

    const TooltipOrNot = ({ children, tooltip }: {
        children: React.ReactNode;
        tooltip: string;
    }) => tooltip ? <Tooltip className="select-none" content={tooltip} placement="bottom">{children}</Tooltip> : children;

    const baseIcons: Icon[] = [
        {
            icon: <Inbox color="#acaebf" size={22} strokeWidth={3} />,
            tooltip: "Inbox",
        },
        {
            icon: <CircleHelp color="#acaebf" size={20} strokeWidth={3} />,
            tooltip: "Help",
        }
    ];

    const variants = {
        open: { rotate: 180 },
        closed: { rotate: 0 },

    };

    return (
        <div className="flex flex-row items-center justify-evenly bg-accent bg-opacity-90 w-full h-10 m-0 shadow-lg">
            <motion.div
                className="ml-2 my-auto cursor-pointer flex md:hidden"
                onClick={() => setIsOpen(!isOpen)}
                animate={isOpen ? "open" : "closed"}
                variants={variants}
            >
                {isOpen ? <X color="#acaebf" size={22} /> : <Menu color="#acaebf" size={22} />}
            </motion.div>
            <div className="mr-auto ml-2 my-auto">
                {startContent}
            </div>
            {!beforeIcons && endContent}
            {icons?.map((icon, index) => (
                <TooltipOrNot key={index} tooltip={icon.tooltip}>
                    <div className="mr-2 ml-2 transition duration-300 ease-in-out cursor-pointer last:mr-4" onClick={icon.onClick}>
                        {icon.icon}
                    </div>
                </TooltipOrNot>
            ))}
            {icons && <Divider orientation="vertical" className="w-[3px] h-6" />}
            {baseIcons?.map((icon, index) => (
                <TooltipOrNot key={index} tooltip={icon.tooltip}>
                    <div className="mr-2 ml-2 transition duration-300 ease-in-out cursor-pointer last:mr-5">
                        {icon.icon}
                    </div>
                </TooltipOrNot>
            ))}

            {beforeIcons && endContent}
        </div>
    );
};



export default TopNavBar;