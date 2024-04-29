const Divider = ({
    size = "1"
}: {
    size?: string;
}) => {
    return (
        <div className={`w-full h-${size} bg-gray-700`} />
    );
};

export default Divider;