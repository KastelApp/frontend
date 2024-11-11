import cn from "@/utils/cn.ts";
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { useResizable, UseResizableProps } from "react-resizable-layout";

export interface ResizablePanelProps {
    defaultSize?: number;
    minSize?: number;
    maxSize?: number;
    children: React.ReactNode;
    direction: "horizontal" | "vertical" | "both";
    className?: string;
    noSize?: boolean;
}

export interface ResizablePanelHandle {
    resize: (newSize: number) => void;
    collapse: () => void;
    expand: () => void;
}

const ResizablePanel = forwardRef<ResizablePanelHandle, ResizablePanelProps>((props, ref) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState(props.defaultSize || 200);

    useImperativeHandle(ref, () => ({
        resize: (newSize: number) => {
            setSize(newSize);
        },
        collapse: () => {
            setSize(props.minSize || 50);
        },
        expand: () => {
            setSize((props.maxSize || props.defaultSize) || 200);
        }
    }));

    useLayoutEffect(() => {
        if (!panelRef.current) return;

        if (props.direction === "horizontal" || props.direction === "both") {
            panelRef.current.style.width = `${props.noSize ? props.defaultSize : size}px`;
        }

        if (props.direction === "vertical" || props.direction === "both") {
            panelRef.current.style.height = `${props.noSize ? props.defaultSize : size}px`;
        }
    }, [size]);

    return (
        <div
            ref={panelRef}
            className={props.className}
        >
            {props.children}
        </div>
    );
});

const useEasyResizable = (opts: UseResizableProps) => {
    const {
        isDragging,
        position,
        separatorProps,
        ...rest
    } = useResizable({
        ...opts,
        onResizeStart: (...args) => {
            if (opts.onResizeStart) opts.onResizeStart(...args);

            // eslint-disable-next-line react-compiler/react-compiler
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
        },
        onResizeEnd: (...args) => {
            if (opts.onResizeEnd) opts.onResizeEnd(...args);

            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }
    });

    const panelRef = useRef<ResizablePanelHandle & HTMLDivElement>(null);

    useEffect(() => {
        if (!panelRef.current) return;

        panelRef.current.resize(position);
    }, [position])

    return {
        Separator: () => <div
            id="separator"
            data-testid="separator"
            tabIndex={0}
            className={cn(
                "bg-charcoal-500 hover:bg-gray-600 transition-colors min-w-1 w-1 cursor-col-resize",
                separatorProps.dir === "horizontal" && "h-1 w-full cursor-row-resize",
                isDragging && "bg-gray-600"
            )}
            {...separatorProps}
        />,
        Panel: ({ children, className }: { children: React.ReactNode, className?: string; }) => {
            return (
                <ResizablePanel ref={panelRef} className={className} direction={opts.axis === "x" ? "horizontal" : "vertical"} defaultSize={opts.initial} maxSize={opts.max} minSize={opts.min}>
                    {children}
                </ResizablePanel>
            )
        },
        isDragging,
        position,
        separatorProps,
        panelProps: {
            ref: panelRef,
            defaultSize: opts.initial,
            minSize: opts.min,
            maxSize: opts.max,
            direction: opts.axis === "x" ? "horizontal" : "vertical",
        } as const,
        ResizablePanel,
        ...rest
    };
};

export default useEasyResizable;

export { ResizablePanel }