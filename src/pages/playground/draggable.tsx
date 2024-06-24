import { useState } from "react";
import Draggables from "@/components/DraggableComponent.tsx";
import { Avatar } from "@nextui-org/react";
import { NavBarIcon } from "@/components/NavBars/NavBarIcon.tsx";

const TestDraggable = () => {
    const [items] = useState<{
        id: string;
        name: string;
    }[]>([{
        id: "1",
        name: "Owo"
    }, {
        id: "2",
        name: "Cats"
    }, {
        id: "3",
        name: "Dogs"
    }]);


    return (
        <div className="flex flex-col w-12">
            <Draggables
                items={items}
                onDrop={(items) => {
                    console.log(items);
                }}
                render={(item, index) => {
                    return <NavBarIcon
                        icon={
                            <Avatar
                                name={item.name}
                                src={undefined}
                                className="mt-1.5 w-10 h-10 rounded-3xl transition-all group-hover:rounded-xl duration-300 ease-in-out transform"
                                imgProps={{ className: "transition-none" }}
                            />
                        }
                        description={item.name}
                        key={index}
                    />;
                }}
            />
        </div>
    );
};

export default TestDraggable;