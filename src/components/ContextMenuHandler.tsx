import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuCheckboxItem } from "@/components/ui/context-menu.tsx";
import cn from "@/utils/cn.ts";
import { Divider } from "@nextui-org/react";

export interface ContextMenuProps {
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    label: React.ReactNode;
    subValues?: Omit<ContextMenuProps, "subValues">[];
    divider?: boolean;
    onClick?: (e: Event) => void;
    checkBox?: boolean;
    checked?: boolean;
    preventCloseOnClick?: boolean;
}

const ContextItemHandler = ({
    children,
    isCheckBox,
    isChecked,
    className,
    onClick
}: {
    isCheckBox?: boolean;
    isChecked?: boolean;
    children: React.ReactNode;
    className?: string;
    onClick?: (e: Event) => void;
}) => {
    if (isCheckBox) {
        return <ContextMenuCheckboxItem checked={isChecked} className={cn("text-white", className)} onSelect={onClick}>{children}</ContextMenuCheckboxItem>;
    }

    return <ContextMenuItem className={className} onSelect={onClick}>{children}</ContextMenuItem>;
};

const ContextMenuHandler = ({
    children,
    items,
    className
}: {
    children: React.ReactNode;
    items?: ContextMenuProps[];
    className?: string;
}): React.ReactNode => {

    if (!items || items.length === 0) return children;

    return (
        <ContextMenu>
            <ContextMenuTrigger >{children}</ContextMenuTrigger>
            <ContextMenuContent className={className}>
                {items.map((item, index) => {
                    if (!item.subValues || item.subValues.length === 0) {
                        return (
                            <>
                                <ContextItemHandler
                                    isCheckBox={item.checkBox}
                                    isChecked={item.checked}
                                    key={index}
                                    onClick={(event) => {
                                        if (item.preventCloseOnClick) {
                                            event.preventDefault();
                                        }

                                        item.onClick?.(event);
                                    }} className="flex cursor-pointer">
                                    {item.startContent}
                                    <p className="text-white">
                                        {item.label}
                                    </p>
                                    <div className="ml-auto">
                                        {item.endContent}
                                    </div>
                                </ContextItemHandler>
                                {item.divider && <Divider className="mt-1 mb-1" />}
                            </>
                        );
                    }

                    return (
                        <>
                            <ContextMenuSub key={index}>
                                <ContextMenuSubTrigger className="text-white">{item.label}</ContextMenuSubTrigger>
                                <ContextMenuSubContent>
                                    {item.subValues.map((subItem, subIndex) => (
                                        <>
                                            <ContextItemHandler
                                                isCheckBox={subItem.checkBox}
                                                isChecked={subItem.checked}
                                                key={subIndex}
                                                onClick={(event) => {
                                                    if (subItem.preventCloseOnClick) {
                                                        event.preventDefault();
                                                    }

                                                    subItem.onClick?.(event);
                                                }} className="flex cursor-pointer">
                                                {subItem.startContent}
                                                <p>
                                                    {subItem.label}
                                                </p>
                                                <div className="ml-auto">
                                                    {subItem.endContent}
                                                </div>
                                            </ContextItemHandler>
                                            {subItem.divider && <Divider className="mt-1 mb-1" />}
                                        </>
                                    ))}
                                </ContextMenuSubContent>
                            </ContextMenuSub>
                            {item.divider && <Divider className="mt-1 mb-1" />}
                        </>
                    );
                })}
            </ContextMenuContent>
        </ContextMenu>
    );
};

export default ContextMenuHandler;