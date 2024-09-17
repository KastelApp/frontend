import { Chip } from "@nextui-org/react";

const UserTag = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <Chip
            color="primary"
            variant="solid"
            className="ml-1 h-5 w-5 p-0 text-[12px] text-white bg-primary/60 text-center rounded-md"
            classNames={{
                content: "font-extrabold uppercase"
            }}
            radius="none"
        >
            {children}
        </Chip>
    );
};

export default UserTag;