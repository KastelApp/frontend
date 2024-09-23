const UserTag = ({
    children
}: {
    children: React.ReactNode;
}) => {

    return (
        <div className="bg-primary/60 text-xs pl-1.5 pr-1.5 rounded-md ml-1 max-w-10 max-h-4 min-w-9 min-h-4 uppercase font-extrabold">
            {children}
        </div>
    );
};

export default UserTag;