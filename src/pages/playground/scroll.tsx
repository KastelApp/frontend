import { LeftNavBarIcon } from "@/components/NavBars/LeftNavbar.tsx";
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
        <div className="horizontal-scroll-container" ref={scrollContainerRef}>
            <div className="horizontal-scroll-content flex gap-2">
                {Array.from({ length: 100 }).map((_, i) => (
                    <LeftNavBarIcon
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
                    />
                ))}
            </div>
        </div>
    );
};

export default HorizontalScroll;
