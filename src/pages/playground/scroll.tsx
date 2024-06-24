import Draggables from "@/components/DraggableComponent.tsx";
import { NavBarIcon } from "@/components/NavBars/NavBarIcon.tsx";
import { Avatar } from "@nextui-org/react";
import React, { useRef, useEffect } from "react";

const HorizontalScroll = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current!;

        const onWheel = (e: WheelEvent) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                scrollContainer.scrollLeft += e.deltaY;
            }
        };

        scrollContainer.addEventListener("wheel", onWheel);
        return () => {
            scrollContainer.removeEventListener("wheel", onWheel);
        };
    }, []);

    return (
        <div className="flex justify-center items-center h-screen flex-col">
            <p className="text-2xl font-bold">Horizontal Scroll + Draggable (Scroll as you would vertically)</p>
            <div className="horizontal-scroll-container scrollbar-hide" ref={scrollContainerRef}>
                <Draggables
                    className="horizontal-scroll-content flex gap-3 w-screen"
                    items={Array.from({ length: 100 }).map((_, i) => i.toString())}
                    render={(i) => (
                        <NavBarIcon
                            icon={
                                <Avatar
                                    name={i.toString()}
                                    src={undefined}
                                    className="mt-1.5 w-10 h-10 rounded-3xl transition-all group-hover:rounded-xl duration-300 ease-in-out transform"
                                    imgProps={{ className: "transition-none" }}
                                />
                            }
                            description={i.toString()}
                            key={i}
                            orientation="horizontal"
                        />
                    )}
                    onDrop={console.log}
                    orientation="horizontal"
                />
            </div>
        </div>
    );
};

export default HorizontalScroll;
