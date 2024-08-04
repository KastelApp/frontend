const BaseMention = ({ value, ...props }: {
    value: string;
} & React.JSX.IntrinsicElements["div"]) => {
    return (
        <div className="text-green-400" {...props}>
            {value}
        </div>
    );
};

export default BaseMention;