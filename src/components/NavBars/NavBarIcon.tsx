import ContextMenuHandler, { ContextMenuProps } from "@/components/ContextMenuHandler.tsx";
import { Badge, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { memo } from "react";
import { twMerge } from "tailwind-merge";

const NavBarIcon = memo(({
    icon,
    description,
    isDisabled,
    size = 10,
    isBackgroundDisabled,
    badgeColor,
    badgeContent,
    badgePosition,
    href,
    InContent,
    onClick,
    delay,
    hasUnReadMessages,
    isActive,
    orientation = "vertical",
    isNormalIcon,
    type,
    contextMenuItemsProps,
    contextMenuClassName
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
    InContent?: React.FC<{ children: React.ReactNode; }>;
    onClick?: () => void;
    delay?: number;
    contextMenuItemsProps?: ContextMenuProps[];
    hasUnReadMessages?: boolean;
    isActive?: boolean;
    /**
      * Orientation of the draggables i.e vertical or horizontal
      */
    orientation?: "vertical" | "horizontal";
    type?: "normal" | "context";
    isNormalIcon?: boolean;
    contextMenuClassName?: string;
}) => {
    const width = `w-${size}`;
    const height = `h-${size}`;

    const LinkWrapper = ({
        children,
        href,
    }: {
        href?: string;
        children: React.ReactNode;
    }): React.ReactNode =>
        href ? (
            <Link href={href} passHref className="item-drag">
                {children}
            </Link>
        ) : (
            (children)
        );

    const InContentWrapper = ({
        children,
    }: {
        children: React.ReactNode;
        // @ts-expect-error -- Its fine
    }): React.ReactNode => (InContent ? <InContent type={type} orientation={orientation}>{children}</InContent> : (children));

    const TooltipOrNot = ({ children }: { children: React.ReactNode; }): React.ReactNode =>
        description ? (
            <Tooltip content={description} showArrow className="select-none" placement={orientation === "vertical" ? "right" : "top"} delay={delay}>
                {children}
            </Tooltip>
        ) : (
            (children)
        );
   

    return (
        <TooltipOrNot>
            <div
                className={twMerge(
                    `select-none flex justify-center items-center mt-2
            mb-2
            mx-auto
            rounded-3xl
            transition-all
            duration-300
            ease-in-out
            transform
            group
            `,
                    isDisabled
                        ? `cursor-not-allowed ${!isBackgroundDisabled ? "bg-gray-800 hover:bg-gray-700" : ""}`
                        : `cursor-pointer hover:rounded-xl ${!isBackgroundDisabled ? "bg-gray-600 hover:bg-gray-700" : ""}`,
                    width,
                    height,
                )}
            >

                {!isNormalIcon && <div className={twMerge(
                    // ? combine them but still keep the different orientation parts
                    "bg-white absolute z-10 transition-all ease-in-out duration-300",
                    orientation === "vertical" ? "w-1 h-0 rounded-r-lg -left-2 group-hover:h-4" : "w-0 h-1 rounded-b-lg -bottom-2 group-hover:w-4",
                    hasUnReadMessages ? orientation === "vertical" ? "h-2" : "w-2" : "",
                    isActive ? orientation === "vertical" ? "!h-6" : "!w-6" : "",
                )} />}
                <ContextMenuHandler items={contextMenuItemsProps} className={contextMenuClassName}>
                    <div onClick={onClick}>
                        <InContentWrapper>
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
                        </InContentWrapper>
                    </div>
                </ContextMenuHandler>
            </div>
        </TooltipOrNot>
    );
});

export { NavBarIcon };