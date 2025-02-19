import { Moon, Sun } from "lucide-react";
import cn from "@/utils/cn.ts";

const ThemeButton = ({
	children,
	className,
	endContent,
	onPress,
	startContent,
	color,
	variant,
	hexColor,
}: {
	startContent?: React.ReactNode;
	endContent?: React.ReactNode;
	onPress?: () => void;
	children: React.ReactNode;
	className?: string;
	color?: "primary" | "secondary" | "success" | "warning" | "danger";
	hexColor?: string;
	variant?: "contained" | "outlined";
}) => {
	const fixedColor = color ? color : hexColor ? (hexColor.startsWith("#") ? `[${hexColor}]` : hexColor) : "primary";
	const mixVariant = variant
		? variant === "outlined"
			? `border-2 border-${fixedColor}`
			: `bg-${fixedColor}`
		: `bg-${fixedColor}`;
	const colors = variant === "outlined" ? `text-${fixedColor}` : `text-white bg-${fixedColor}`;

	return (
		<div className="flex items-center justify-center gap-2">
			<button
				className={cn(
					"flex w-40 items-center justify-center gap-2 rounded-md p-2 transition-all duration-300 ease-in-out hover:opacity-85 active:scale-95",
					className,
					mixVariant,
					colors,
				)}
				onClick={onPress}
			>
				{startContent}
				{children}
				{endContent}
			</button>
		</div>
	);
};

const Appearance = () => {
	return (
		<div className="mx-auto flex w-full flex-col justify-center gap-4">
			<p className="text-center text-lg font-semibold">What theme would you like to use?</p>
			<div className="mx-auto flex w-full max-w-[25vw] flex-col gap-4">
				<ThemeButton
					startContent={<Sun size={22} />}
					onPress={() => {
						console.log("click");
					}}
					hexColor=""
					variant="outlined"
					className="rounded-lg"
				>
					Light Theme
				</ThemeButton>
				<ThemeButton
					startContent={<Moon size={22} />}
					onPress={() => {
						console.log("click");
					}}
					color="primary"
					variant="outlined"
					className="rounded-lg"
				>
					Dark Theme
				</ThemeButton>
			</div>
			<p className="text-center text-lg font-semibold">What emoji pack would you like to use?</p>
			<div className="mx-auto flex w-full max-w-[50vw] flex-wrap justify-center gap-4">
				{/*// todo: show actual emojis*/}
				<ThemeButton
					onPress={() => {
						console.log("click");
					}}
					variant="outlined"
					className="rounded-lg !border-yellow-400 !text-yellow-400"
				>
					Twemoji
				</ThemeButton>
				<ThemeButton
					onPress={() => {
						console.log("click");
					}}
					color="secondary"
					variant="outlined"
					className="rounded-lg"
				>
					Noto (Google)
				</ThemeButton>
				<ThemeButton
					onPress={() => {
						console.log("click");
					}}
					color="success"
					variant="outlined"
					className="rounded-lg"
				>
					Fluent (Microsoft)
				</ThemeButton>
				<ThemeButton
					onPress={() => {
						console.log("click");
					}}
					color="warning"
					variant="outlined"
					className="rounded-lg"
				>
					Native
				</ThemeButton>
			</div>
		</div>
	);
};

export default Appearance;
