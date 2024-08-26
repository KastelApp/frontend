import { Tooltip as ToolTipComponent, TooltipProps } from "@nextui-org/react";
import { useState, useEffect, isValidElement, cloneElement, ReactElement, ReactNode } from "react";

const Tooltip = ({ children, ...props }: TooltipProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoverDelay, setHoverDelay] = useState<NodeJS.Timeout | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    useEffect(() => {
        clearTimeout(hoverDelay!);

        if (!isHovered) {
            setHoverDelay(setTimeout(() => {
                setIsOpen(false);
            }, props.closeDelay || 0));
        } else if (isHovered) {
            setHoverDelay(setTimeout(() => {
                setIsOpen(true);
            }, props.delay || 0));
        }
    }, [isHovered]);

    const addEventListeners = (child: ReactNode) => {
        if (isValidElement(child)) {
            return cloneElement(child as ReactElement, {
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
            });
        }
        return child;
    };

    return (
        <ToolTipComponent isOpen={isOpen} {...props}>
            {addEventListeners(children)}
        </ToolTipComponent>
    );
};

export default Tooltip;