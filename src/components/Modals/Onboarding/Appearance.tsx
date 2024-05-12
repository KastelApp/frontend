import { Moon, Sun } from "lucide-react";
import { twMerge } from "tailwind-merge";

const ThemeButton = ({
    children,
    className,
    endContent,
    onClick,
    startContent,
    color,
    variant,
    hexColor
}: {
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    color?: "primary" | "secondary" | "success" | "warning" | "danger";
    hexColor?: string;
    variant?: "contained" | "outlined";
}) => {

    const fixedColor = color ? color : hexColor ? hexColor.startsWith("#") ? `[${hexColor}]` : hexColor : "primary";
    const mixVariant = variant ? variant === "outlined" ? `border-2 border-${fixedColor}` : `bg-${fixedColor}` : `bg-${fixedColor}`;
    const colors = variant === "outlined" ? `text-${fixedColor}` : `text-white bg-${fixedColor}`;

    return (
        <div className="flex items-center justify-center gap-2">
            <button className={twMerge("hover:opacity-85 active:scale-95 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 p-2 rounded-md w-40", className, mixVariant, colors)} onClick={onClick}>
                {startContent}
                {children}
                {endContent}
            </button>
        </div>
    );
};

const Appearance = () => {
    return (
        <div className="flex flex-col gap-4 justify-center mx-auto w-full">
            <p className="text-center text-lg font-semibold">What theme would you like to use?</p>
            <div className="flex flex-col gap-4 w-full max-w-[25vw] mx-auto">
                <ThemeButton startContent={<Sun size={22} />} onClick={() => { console.log("click"); }} hexColor="" variant="outlined" className="rounded-lg">
                    Light Theme
                </ThemeButton>
                <ThemeButton startContent={<Moon size={22} />} onClick={() => { console.log("click"); }} color="primary" variant="outlined" className="rounded-lg">
                    Dark Theme
                </ThemeButton>
            </div>
            <p className="text-center text-lg font-semibold">What emoji pack would you like to use?</p>
            <div className="flex flex-wrap justify-center gap-4 w-full max-w-[50vw] mx-auto">
                {/*// todo: show actual emojis*/}
                <ThemeButton onClick={() => { console.log("click"); }} variant="outlined" className="rounded-lg !text-yellow-400 !border-yellow-400">
                    Twemoji
                </ThemeButton>
                <ThemeButton onClick={() => { console.log("click"); }} color="secondary" variant="outlined" className="rounded-lg">
                    Noto (Google)
                </ThemeButton>
                <ThemeButton onClick={() => { console.log("click"); }} color="success" variant="outlined" className="rounded-lg">
                    Fluent (Microsoft)
                </ThemeButton>
                <ThemeButton onClick={() => { console.log("click"); }} color="warning" variant="outlined" className="rounded-lg">
                    Native
                </ThemeButton>
            </div>

        </div>
    );
};

export default Appearance;