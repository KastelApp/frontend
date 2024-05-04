const TypingDots = (props: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div {...props}>
            <div className="typingDot" />
            <div className="typingDot" />
            <div className="typingDot" />
        </div>
    );
};

export default TypingDots;