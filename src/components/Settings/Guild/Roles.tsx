import { useState } from "react";
import { Tabs, Tab, Button, Input, Switch, Chip, Divider, Popover, PopoverTrigger, PopoverContent, Tooltip } from "@nextui-org/react";
import { useColor, ColorPicker as CustomColorPicker } from "react-color-palette";

const generateRgbAndHsv = (color: string) => {
	const r = parseInt(color.slice(1, 3), 16);
	const g = parseInt(color.slice(3, 5), 16);
	const b = parseInt(color.slice(5, 7), 16);

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	const v = max / 255;
	const delta = max - min;

	let h = 0;
	let s = 0;

	if (max !== 0) {
		s = delta / max;
	}

	if (max === min) {
		h = 0;
	} else {
		switch (max) {
			case r:
				h = (g - b) / delta + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / delta + 2;
				break;
			case b:
				h = (r - g) / delta + 4;
				break;
		}
		h /= 6;
	}

	return {
		hex: color,
		rgb: { r, g, b, a: 1 },
		hsv: { h: h * 360, s: s * 100, v: v * 100, a: 1 }
	};
};

const ColorPicker = ({ selectedRole }: {
	selectedRole: {
		name: string;
		color: string;
		position: number;
	};
}) => {
	const colors = [
		"#FF5733", // Reddish-orange
		"#FF6347", // Tomato
		"#FF4500", // Orange-red
		"#FF0000", // Red
		"#FFD700", // Gold
		"#FFA500", // Orange
		"#FFFF00", // Yellow
		"#00FF00", // Lime
		"#7FFF00", // Chartreuse
		"#11806a", // Green
		"#87CEEB", // Sky blue
		"#5e85ce", // Glaucous
		"#0000FF", // Blue
		"#800080", // Purple
		"#8A2BE2", // Blue-violet
		"#9932CC", // Dark orchid
		"#FF1493", // Deep pink
		"#00CED1", // Dark turquoise
		"#BA55D3", // Medium orchid
		"#800000", // Maroon
	];

	const defaultColor = "#c1c1c1";

	const [color, setColor] = useColor(selectedRole.color);
	const [delayOpen, setDelayOpen] = useState(false);

	return (
		<div className="flex">
			<Tooltip content="Default Color">
				<div className="cursor-pointer w-11 h-11 rounded-md mr-2" style={{
					backgroundColor: defaultColor
				}} onClick={() => {
					setColor(generateRgbAndHsv(defaultColor));
					selectedRole.color = defaultColor;
				}} />
			</Tooltip>

			<Popover placement="right" onOpenChange={(isOpen) => {
				if (isOpen) {
					setTimeout(() => setDelayOpen(true), 150);
				} else {
					setDelayOpen(false);
				}
			}}>
				<PopoverTrigger>
					<div>
						<Tooltip content="Custom Color">
							<div className="cursor-pointer w-11 h-11 rounded-md mr-2" style={{ backgroundColor: selectedRole?.color }} />
						</Tooltip>
					</div>
				</PopoverTrigger>
				<PopoverContent className="">
					{delayOpen && <CustomColorPicker
						color={color}
						onChange={(color) => {
							setColor(color);
							selectedRole.color = color.hex;
						}}
						hideAlpha
						hideInput={["hsv"]}
						height={150}
					/>}
				</PopoverContent>
			</Popover>

			<div className="flex flex-col space-y-2">
				<div className="flex space-x-2">
					{colors.slice(0, 10).map((color, index) => (
						<div
							key={index}
							className="cursor-pointer w-5 h-5 rounded-md"
							style={{ backgroundColor: color }}
							onClick={() => {
								setColor(generateRgbAndHsv(color));
								selectedRole.color = color;
							}}
						></div>
					))}
				</div>
				<div className="flex space-x-2">
					{colors.slice(10).map((color, index) => (
						<div
							key={index + 10}
							className="cursor-pointer w-5 h-5 rounded-md"
							style={{ backgroundColor: color }}
							onClick={() => {
								setColor(generateRgbAndHsv(color));
								selectedRole.color = color;
							}}
						></div>
					))}
				</div>
			</div>
		</div>
	);
};

const Roles = () => {
	const roles = [
		{
			name: "Admin",
			color: "#FFA500",
			position: 1
		},
		{
			name: "Moderator",
			color: "#FF0000",
			position: 2
		},
		{
			name: "Member",
			color: "#00FF00",
			position: 3
		},
		{
			name: "Guest",
			color: "#0000FF",
			position: 4
		}
	];

	const [selectedRole, setSelectedRole] = useState(roles[0]);

	return (
		<div className="mr-2 bg-accent rounded-lg p-4">
			<h1 className="text-2xl font-semibold mb-4">Roles</h1>
			<div className="flex">
				<div>
					<Button className="mb-4 min-w-64 rounded-md">Create New Role</Button>
					<div className="flex">
						<div className="flex flex-col space-y-2 mr-4">
							{roles.map((role, index) => (
								<Chip
									key={index}
									onClick={() => setSelectedRole(role)}
									variant="bordered"
									className="min-w-64 max-w-64 rounded-md cursor-pointer h-10"
								>
									<span className="flex items-center space-x-2">
										<div className={"w-4 h-4 rounded-full mr-1"} style={{
											backgroundColor: role.color
										}}></div>
										{role.name}
									</span>
								</Chip>
							))}
						</div>
					</div>
				</div>
				<div className="flex w-full">
					<Divider orientation="vertical" />
					<div className="pl-4 flex-1 bg-charcoal-700 rounded-md ml-2">
						<Tabs

							color="primary"
							variant="light"
							className="w-full border-b-2 border-slate-800 text-slate-800"

						>
							<Tab key="1" title="Information">
								<div className="flex flex-col space-y-4">
									<Input
										label="Role Name"
										defaultValue={selectedRole.name}
										isRequired
										className="w-1/3"
									/>
									<div className="flex space-x-2">
										<ColorPicker selectedRole={selectedRole} />

									</div>
									<Switch checked={false}>
										Display Role Separately
									</Switch>
									<Switch checked={false}>
										Allow anyone to mention
									</Switch>
									<Switch checked={false}>
										Allow access to age restricted channels
									</Switch>
								</div>
							</Tab>
							<Tab key="2" title="Permissions">
								<div>Permissions Content</div>
							</Tab>
							<Tab key="3" title="Users">
								<div>Users Content</div>
							</Tab>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Roles;
