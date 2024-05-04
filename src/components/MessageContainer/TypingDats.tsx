const TypingDots = (props: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div {...props}>
            <div className="typingDot"></div>
            <div className="typingDot"></div>
            <div className="typingDot"></div>
        </div>
    )
}

export default TypingDots;