import UserModal from "@/components/Modals/UserModal.tsx";
import { Button, useDisclosure } from "@nextui-org/react";

const Modals = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <div className="flex flex-col items-center justify-center w-full h-full">
                <p className="mt-8 text-center text-2xl font-bold">Welcome, Below you can find some testing modals</p>

                <br />
                <br />
                <br />
                <Button onClick={onOpen}>Open User Modal</Button>
            </div>
            <UserModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default Modals;