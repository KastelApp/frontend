import { Button } from "@nextui-org/react";

const SaveChanges = ({
    onCancel,
    onSave,
    isShowing
}: {
    onSave: () => void;
    onCancel: () => void;
    isShowing: boolean;
}) => {
    return (
        <div className="pb-20">
            {isShowing && (
                <div className="bg-black w-[75%] h-14 rounded-lg absolute bottom-8 z-20 flex items-center justify-center">
                    <div className="flex items-center justify-between w-full px-4">
                        <p className="text-white text-md font-semibold">Becareful, you have unsaved changes</p>
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