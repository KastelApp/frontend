import cn from "@/utils/cn.ts";
import getText from "@/utils/getText.ts";
import type { ClassValue } from "tailwind-variants";

interface BaseHeadingProps {
	as: string | React.ElementType;
	className: string;
	children: React.ReactNode;
	hideIcon?: boolean;
}

interface HeadingProps {
	children: React.ReactNode;
	className?: ClassValue;
}

const BaseHeading = ({ as: As, children, className }: BaseHeadingProps) => {
	const id = getText(children);

	return (
		<As id={id} className={cn(className, "group flex items-center text-lightText dark:text-darkText")}>
			{children}
		</As>
	);
};

const H1Heading = ({ children, className }: HeadingProps) => {
	return (
		<BaseHeading as={"h1"} className={cn("mb-2 mt-3 text-2xl font-bold leading-8", className)}>
			{children}
		</BaseHeading>
	);
};

const H2Heading = ({ children, className }: HeadingProps) => {
	return (
		<BaseHeading as={"h2"} className={cn("mb-2 mt-3 text-xl font-bold leading-6", className)}>
			{children}
		</BaseHeading>
	);
};

const H3Heading = ({ children, className }: HeadingProps) => {
	return (
		<BaseHeading as={"h3"} className={cn("mb-2 mt-3 text-large font-bold leading-6", className)}>
			{children}
		</BaseHeading>
	);
};

const H4Heading = ({ children, className }: HeadingProps) => {
	return (
		<BaseHeading as={"h4"} className={cn("mb-2 mt-3 text-xl font-bold leading-tight sm:leading-loose", className)}>
			{children}
		</BaseHeading>
	);
};

export { H1Heading, H2Heading, H3Heading, H4Heading };
