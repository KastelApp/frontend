import { BsSun, BsMoonStarsFill } from "react-icons/bs";
import { Button, useColorMode } from "@chakra-ui/react";

export default function Settings_Appearance() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <>
            <div>Appearance</div>
            <br />
            <Button
                aria-label="Toggle Color Mode"
                onClick={toggleColorMode}
                _focus={{ boxShadow: "none" }}
                w="fit-content"
            >
                {colorMode === "light" ? <BsMoonStarsFill /> : <BsSun />}
            </Button>
        </>
    );
}