import { Input, Button } from "@nextui-org/react";
import { Search } from "lucide-react";
import { useState } from "react";

const AddFriend = () => {
    const [userNameAndTag, setUserNameAndTag] = useState("");
    const [errorMessage] = useState("");


    return (
        <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="text-xl">Add a friend</h1>
            <p className="text-gray-400">Enter your friend's username and tag below</p>
            <Input
                placeholder="kiki#1750"
                value={userNameAndTag}
                onChange={(e) => setUserNameAndTag(e.target.value)}
                className="md:w-[50vw]"
                startContent={<Search />}
                endContent={
                    <Button
                        color="success"
                        variant="flat"
                        className="h-full"
                        onPress={() => console.log("Add friend")}
                    >
                        Add
                    </Button>
                }
                isRequired
                errorMessage={errorMessage}
                isInvalid={errorMessage !== ""}
                description="Enter your friend's username and tag (e.g. kiki#1750)"
            />
        </div>

    );
};

export default AddFriend;