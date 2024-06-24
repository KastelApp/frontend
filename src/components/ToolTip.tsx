import { Tooltip as ToolTipComponent, TooltipProps, forwardRef } from "@nextui-org/react";
import React, { useState, cloneElement, ReactElement, ReactNode } from "react";

// const ToolTip = ({ children, ...props }: TooltipProps) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [hoverDelay, setHoverDelay] = useState<NodeJS.Timeout | null>(null);
//     const [closeDelay, setCloseDelay] = useState<NodeJS.Timeout | null>(null);

//     const handleMouseEnter = () => {
//         if (hoverDelay) {
//             clearTimeout(hoverDelay);
//         }

//         setHoverDelay(setTimeout(() => {
//             setIsOpen(true);
//         }, props.delay || 1000));
//     };

//     const handleMouseLeave = () => {
//         if (hoverDelay) {
//             clearTimeout(hoverDelay);
//         }

//         if (closeDelay) {
//             clearTimeout(closeDelay);
//         }

//         setCloseDelay(setTimeout(() => {
//             setIsOpen(false);
//         }, props.closeDelay || 0));
//     };

//     const addEventListeners = (child: ReactNode) => {
//         if (React.isValidElement(child)) {
//             return cloneElement(child as ReactElement, {
//                 onMouseEnter: handleMouseEnter,
//                 onMouseLeave: handleMouseLeave,
//             });
//         }
//         return child;
//     };

//     return (
//         <ToolTipComponent isOpen={isOpen} {...props}>
//             {addEventListeners(children)}
//         </ToolTipComponent>
//     );
// };

// use forward ref
const ToolTip = forwardRef(({ children, ...props }: TooltipProps, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoverDelay, setHoverDelay] = useState<NodeJS.Timeout | null>(null);
    const [closeDelay, setCloseDelay] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (hoverDelay) {
            clearTimeout(hoverDelay);
        }

        setHoverDelay(setTimeout(() => {
            setIsOpen(true);
        }, props.delay || 1000));
    };

    const handleMouseLeave = () => {
        if (hoverDelay) {
            clearTimeout(hoverDelay);
        }

        if (closeDelay) {
            clearTimeout(closeDelay);
        }

        setCloseDelay(setTimeout(() => {
            setIsOpen(false);
        }, props.closeDelay || 0));
    };


    return (
        <ToolTipComponent isOpen={true} {...props} onMouseEnter={() => console.log("a")} ref={ref}>
                {children}
        </ToolTipComponent>
    );
});

export default ToolTip;
