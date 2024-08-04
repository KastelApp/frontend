import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu.tsx";
import { Divider } from "@nextui-org/react";
import { Copy, Pen, Pin, Reply, Trash2 } from "lucide-react";

const Test = () => {

    return (
        <div className="text-white flex flex-col">
            hi

            <ContextMenu>
                <ContextMenuTrigger>Right click</ContextMenuTrigger>
                <ContextMenuContent className="w-40">
                    <ContextMenuItem>
                        Reply
                        <Reply size={18} color="#acaebf" className="cursor-pointer ml-auto" />
                    </ContextMenuItem>
                    <ContextMenuItem>
                        Edit
                        <Pen size={18} color="#acaebf" className={"cursor-pointer ml-auto"} />
                    </ContextMenuItem>
                    <ContextMenuItem>
                        Pin Message
                        <Pin size={18} color="#acaebf" className="cursor-pointer ml-auto" />
                    </ContextMenuItem>
                    <ContextMenuItem>
                        Copy Text
                        <Copy size={18} color="#acaebf" className="cursor-pointer ml-auto" />
                    </ContextMenuItem>
                    <ContextMenuItem className="text-danger">
                        Delete Message
                        <Trash2 size={18} className={"text-danger cursor-pointer ml-auto"} />
                    </ContextMenuItem>
                    <Divider className="mt-1 mb-1" />
                    <ContextMenuItem className="text-danger">Report Message</ContextMenuItem>
                    <ContextMenuItem>Copy Message Link</ContextMenuItem>
                    <ContextMenuItem>Copy Message ID</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

        </div>
    );
};

export default Test;