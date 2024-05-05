import BaseContextMenu from "@/components/Dropdowns/BaseContextMenu.tsx";
import UserOptions from "@/components/Dropdowns/UserOptions.tsx";
import { Button } from "@nextui-org/react";
import { ArrowBigDown } from "lucide-react";


const DropDowns = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <p className="mt-8 text-center text-2xl font-bold">Welcome, Below you can find some testing dropdowns</p>

            <br />
            <br />
            <br />

            <UserOptions><Button as="span">Right Click me!</Button></UserOptions>

            <br />
            <br />
            <br />

            <BaseContextMenu
                values={[
                    {
                        label: "Test",
                        subValues: [
                            {
                                label: "Cats",
                                onClick: () => console.log("Clicked"),
                                endContent: <ArrowBigDown />
                            },
                            {
                                label: "Close",
                                onClick: (modal) => {
                                    console.log("Clicked n Closed");

                                    modal.close();
                                },
                            }
                        ],
                    },
                    {
                        label: "Hey",
                        onClick: () => console.log("Clicked Hey")
                    },
                    {
                        label: "Hello",
                        onClick: (modal) => {
                            console.log("Clicked Hello n Closed");

                            modal.close();
                        }
                    }
                ]}
            >
                <Button as="span">Right Click me!</Button>
            </BaseContextMenu>
        </div>
    );
};

export default DropDowns;