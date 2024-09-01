import { Switch } from "@nextui-org/react";

const SwitchOption = ({
	title,
	description,
	value,
	setValue,
}: {
	title: string;
	description?: string;
	value: boolean;
	setValue: (value: boolean) => void;
}) => {
	return (
		<div
			className="mt-2 flex cursor-pointer select-none items-center justify-between first:mt-0"
			onClick={() => setValue(!value)}
		>
			<div className="flex flex-col">
				<p>{title}</p>
				{description && <p className="text-sm text-gray-400">{description}</p>}
			</div>
			<Switch isSelected={value} onValueChange={setValue} />
		</div>
	);
};

export default SwitchOption;
