import { Divider } from "@nextui-org/react";
import { CircleHelp, Inbox as InboxIcon, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Tooltip from "../Tooltip.tsx";
import Inbox from "@/components/Popovers/Inbox.tsx";

interface Icon {
	icon: React.ReactElement | React.ReactElement[];
	tooltip: string;
	onClick?: () => void;
}

const TopNavBar = ({
	beforeIcons,
	icons,
	endContent,
	startContent,
	isOpen,
	setIsOpen,
}: {
	icons?: Icon[];
	startContent?: React.ReactElement | React.ReactElement[];
	endContent?: React.ReactElement | React.ReactElement[];
	beforeIcons?: boolean;
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
}) => {
	const TooltipOrNot = ({
		children,
		tooltip,
	}: {
		children: React.ReactElement | React.ReactElement[];
		tooltip: string;
	}): React.ReactElement =>
		tooltip ? (
			<Tooltip className="select-none" content={tooltip} placement="bottom">
				{children}
			</Tooltip>
		) : (
			(children as React.ReactElement)
		);

	const baseIcons: Icon[] = [
		{
			icon: (
				<Inbox>
					<InboxIcon color="#acaebf" size={22} strokeWidth={3} />
				</Inbox>
			),
			tooltip: "Inbox",
		},
		{
			icon: <CircleHelp color="#acaebf" size={20} strokeWidth={3} />,
			tooltip: "Help",
		},
	];

	const variants = {
		open: { rotate: 180 },
		closed: { rotate: 0 },
	};

	return (
		<div className="m-0 flex h-10 w-full flex-row items-center justify-evenly bg-lightAccent bg-opacity-90 shadow-lg dark:bg-darkAccent">
			<motion.div
				className="my-auto ml-2 flex cursor-pointer md:hidden"
				onClick={() => setIsOpen(!isOpen)}
				animate={isOpen ? "open" : "closed"}
				variants={variants}
			>
				{isOpen ? <X color="#acaebf" size={22} /> : <Menu color="#acaebf" size={22} />}
			</motion.div>
			<div className="my-auto ml-2 mr-auto">{startContent}</div>
			{!beforeIcons && endContent}
			{icons?.map((icon, index) => (
				<TooltipOrNot key={index} tooltip={icon.tooltip}>
					<div
						className="ml-2 mr-2 cursor-pointer transition duration-300 ease-in-out last:mr-4"
						onClick={icon.onClick}
					>
						{icon.icon}
					</div>
				</TooltipOrNot>
			))}
			{icons && <Divider orientation="vertical" className="h-6 w-[3px]" />}
			{baseIcons?.map((icon, index) => (
				<TooltipOrNot key={index} tooltip={icon.tooltip}>
					<div className="ml-2 mr-2 cursor-pointer transition duration-300 ease-in-out last:mr-5">{icon.icon}</div>
				</TooltipOrNot>
			))}

			{beforeIcons && endContent}
		</div>
	);
};

export default TopNavBar;
