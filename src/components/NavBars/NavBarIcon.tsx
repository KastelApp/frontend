import ContextMenuHandler, { ContextMenuProps } from "@/components/ContextMenuHandler.tsx";
import { Badge, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { memo } from "react";
import cn from "@/utils/cn.ts";

const NavBarIcon = memo(
	({
		icon,
		description,
		isDisabled,
		size = 10,
		isBackgroundDisabled,
		badgeColor,
		badgeContent,
		badgePosition,
		href,
		onPress,
		delay,
		hasUnReadMessages,
		isActive,
		orientation = "vertical",
		isNormalIcon,
		contextMenuItemsProps,
		contextMenuClassName,
	}: {
		icon: React.ReactNode;
		description?: string;
		isDisabled?: boolean;
		size?: number;
		isBackgroundDisabled?: boolean;
		badgeContent?: string;
		badgeColor?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
		badgePosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
		href?: string;
		onPress?: () => void;
		delay?: number;
		contextMenuItemsProps?: ContextMenuProps[];
		hasUnReadMessages?: boolean;
		isActive?: boolean;
		/**
		 * Orientation of the draggables i.e vertical or horizontal
		 */
		orientation?: "vertical" | "horizontal";
		isNormalIcon?: boolean;
		contextMenuClassName?: string;
	}) => {
		const width = `w-${size}`;
		const height = `h-${size}`;

		const LinkWrapper = ({ children, href }: { href?: string; children: React.ReactNode }): React.ReactNode =>
			href ? (
				<Link href={href} passHref className="item-drag">
					{children}
				</Link>
			) : (
				children
			);

		const TooltipOrNot = ({ children }: { children: React.ReactNode }): React.ReactNode =>
			description ? (
				<Tooltip
					content={description}
					showArrow
					className="select-none"
					placement={orientation === "vertical" ? "right" : "top"}
					delay={delay}
				>
					{children}
				</Tooltip>
			) : (
				children
			);

		return (
			<TooltipOrNot>
				<div
					className={cn(
						"group mx-auto mb-2 mt-2 flex transform select-none items-center justify-center rounded-3xl transition-all duration-300 ease-in-out",
						isDisabled
							? `cursor-not-allowed ${!isBackgroundDisabled ? "bg-gray-800 hover:bg-gray-700" : ""}`
							: `cursor-pointer hover:rounded-xl ${!isBackgroundDisabled ? "bg-gray-600 hover:bg-gray-700" : ""}`,
						width,
						height,
					)}
				>
					{!isNormalIcon && (
						<div
							className={cn(
								// ? combine them but still keep the different orientation parts
								"absolute z-10 bg-white transition-all duration-300 ease-in-out",
								orientation === "vertical"
									? "-left-2 h-0 w-1 rounded-r-lg group-hover:h-4"
									: "-bottom-2 h-1 w-0 rounded-b-lg group-hover:w-4",
								hasUnReadMessages ? (orientation === "vertical" ? "h-2" : "w-2") : "",
								isActive ? (orientation === "vertical" ? "!h-6" : "!w-6") : "",
							)}
						/>
					)}
					<ContextMenuHandler items={contextMenuItemsProps} className={contextMenuClassName}>
						<div onClick={onPress}>
							<LinkWrapper href={href}>
								<Badge
									content={badgeContent}
									isInvisible={!badgeContent}
									color={badgeColor}
									placement={badgePosition}
									className="mb-1"
								>
									{icon}
								</Badge>
							</LinkWrapper>
						</div>
					</ContextMenuHandler>
				</div>
			</TooltipOrNot>
		);
	},
);

export { NavBarIcon };
