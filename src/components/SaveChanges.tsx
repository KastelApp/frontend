import { Button } from "@nextui-org/react";

const SaveChanges = ({
    onCancel,
    onSave,
    isShowing,
}: {
    onSave: () => void;
    onCancel: () => void;
    isShowing: boolean;
}) => {

    return (
        <div className="pb-20 select-none">
            {isShowing && (
                <div className="bg-neutral-950 w-[85%] sm:w-[75%] h-14 rounded-lg absolute bottom-8 !z-[120] flex items-center justify-center left-[8%] sm:left-[22%]">
                    <div className="flex items-center justify-between w-full px-4">
                        <p className="text-white text-md font-semibold">Be careful, you have unsaved changes.</p>
                        <div className="flex gap-2">
                            <Button onClick={onCancel} radius="none" variant="flat" color="danger" className="rounded-md h-8">Cancel</Button>
                            <Button onClick={onSave} radius="none" variant="flat" color="success" className="rounded-md h-8">Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaveChanges;

