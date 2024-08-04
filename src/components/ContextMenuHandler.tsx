import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "@/components/ui/context-menu.tsx";
import { Divider } from "@nextui-org/react";

export interface ContextMenuProps {
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    label: string;
    subValues?: Omit<ContextMenuProps, "subValues">[];
    divider?: boolean;
    onClick?: () => void;
}

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
                                <ContextMenuItem key={index} onClick={item.onClick} className="flex">
                                    {item.startContent}
                                    <p>{item.label}</p>
                                    <div className="ml-auto">
                                        {item.endContent}
                                    </div>
                                </ContextMenuItem>
                                {item.divider && <Divider className="mt-1 mb-1" />}
                            </>
                        );
                    }

                    return (
                        <>
                            <ContextMenuSub key={index}>
                                <ContextMenuSubTrigger>{item.label}</ContextMenuSubTrigger>
                                <ContextMenuSubContent>
                                    {item.subValues.map((subItem, subIndex) => (
                                        <>
                                            <ContextMenuItem key={subIndex} onClick={subItem.onClick} className="flex">
                                                {subItem.startContent}
                                                <p>{subItem.label}</p>
                                                <div className="ml-auto">
                                                    {subItem.endContent}
                                                </div>
                                            </ContextMenuItem>
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