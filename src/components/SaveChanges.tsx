import { Button } from "@nextui-org/react";
import { LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

const SaveChanges = ({
    onCancel,
    onSave,
    isShowing,
    isLoading = false
}: {
    onSave: () => void;
    onCancel: () => void;
    isShowing: boolean;
    isLoading?: boolean;
}) => {

    return (
        <div className="pb-20 select-none">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: isShowing ? 0 : 100, opacity: isShowing ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="bg-darkAccent border-2 border-gray-700 w-[85%] sm:w-[75%] h-14 rounded-lg absolute bottom-8 !z-[120] flex items-center justify-center left-[8%] sm:left-[22%]"
            >
                <div className="flex items-center justify-between w-full px-4">
                    <p className="text-white text-md font-semibold">Be careful, you have unsaved changes.</p>
                    <div className="flex gap-2">
                        <Button onClick={onCancel} radius="none" variant="flat" color="danger" className="rounded-md h-8">Cancel</Button>
                        <Button onClick={() => {
                            if (isLoading) return;

                            onSave();
                        }} radius="none" variant="flat" color="success" className="rounded-md h-8">
                            {isLoading ? (
                                <LoaderCircle className="custom-animate-spin text-white" size={20} />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SaveChanges;
