
/**
 * It probably would be better to use an SVG, but for now this will do.
 */
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
