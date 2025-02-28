import { useEffect, useState } from "react";
import {
	Tabs,
	Tab,
	Button,
	Input,
	Switch,
	Chip,
	Divider,
	Popover,
	PopoverTrigger,
	PopoverContent,
	Tooltip,
} from "@nextui-org/react";
import { useColor, ColorPicker as CustomColorPicker, ColorService } from "react-color-palette";
import { Trash } from "lucide-react";
import PermissionsDescriptions from "@/data/PermissionsDescriptions.ts";
import { Role, useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import SaveChanges from "@/components/SaveChanges.tsx";
import Permissions from "@/wrapper/Permissions.ts";
import arrayify from "@/utils/arrayify.ts";
import { useRouter } from "@/hooks/useRouter.ts";

const generateRgbAndHsv = (color: string) => {
	return {
		hex: color,
		rgb: ColorService.toRgb(color),
		hsv: ColorService.toHsv(color),
	};
};

const ColorPicker = ({ selectedRole }: { selectedRole: Role }) => {
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

	const [color, setColor] = useColor(
		`#${selectedRole.color === 0 ? "c1c1c1" : selectedRole.color.toString(16).padStart(6, "0")}`,
	);
	const [delayOpen, setDelayOpen] = useState(false);

	return (
		<div className="flex">
			<Tooltip content="Default Color">
				<div
					className="mr-2 h-11 w-11 cursor-pointer rounded-md"
					style={{
						backgroundColor: defaultColor,
					}}
					onClick={() => {
						setColor(generateRgbAndHsv(defaultColor));
						// selectedRole.color = defaultColor;
					}}
				/>
			</Tooltip>

			<Popover
				placement="right"
				onOpenChange={(isOpen) => {
					if (isOpen) {
						setTimeout(() => setDelayOpen(true), 150);
					} else {
						setDelayOpen(false);
					}
				}}
			>
				<PopoverTrigger>
					<div>
						<Tooltip content="Custom Color">
							<div
								className="mr-2 h-11 w-11 cursor-pointer rounded-md"
								style={{
									backgroundColor: `#${selectedRole.color === 0 ? "c1c1c1" : selectedRole.color.toString(16).padStart(6, "0")}`,
								}}
							/>
						</Tooltip>
					</div>
				</PopoverTrigger>
				<PopoverContent className="h-full w-full">
					{delayOpen && (
						<CustomColorPicker
							color={color}
							onChange={(color) => {
								setColor(color);
								// selectedRole.color = color.hex;
							}}
							hideAlpha
							hideInput={["hsv", "rgb"]}
							height={150}
						/>
					)}
				</PopoverContent>
			</Popover>

			<div className="flex flex-col space-y-2">
				<div className="flex space-x-2">
					{colors.slice(0, 10).map((color, index) => (
						<div
							key={index}
							className="h-5 w-5 cursor-pointer rounded-md"
							style={{ backgroundColor: color }}
							onClick={() => {
								setColor(generateRgbAndHsv(color));
								// selectedRole.color = color;
							}}
						></div>
					))}
				</div>
				<div className="flex space-x-2">
					{colors.slice(10).map((color, index) => (
						<div
							key={index + 10}
							className="h-5 w-5 cursor-pointer rounded-md"
							style={{ backgroundColor: color }}
							onClick={() => {
								setColor(generateRgbAndHsv(color));
								// selectedRole.color = color;
							}}
						></div>
					))}
				</div>
			</div>
		</div>
	);
};

const Roles = () => {
	const router = useRouter();

	const [currentHubId] = arrayify(router.params?.slug);
	const roles = useRoleStore((state) => state.getRoles(currentHubId));

	const [selectedRole, setSelectedRole] = useState(roles[0]);
	const [advancedMode, setAdvancedMode] = useState(false);

	const [permissions, setPermissions] = useState<Permissions>(new Permissions([]));

	useEffect(() => {
		if (!selectedRole) return;

		setPermissions(new Permissions(selectedRole.permissions));
	}, [selectedRole]);

	return (
		<div className="mr-2 rounded-lg bg-lightAccent p-4 dark:bg-darkAccent">
			<h1 className="mb-4 text-2xl font-semibold">Roles</h1>
			<div className="flex h-screen">
				<div>
					<Button className="mb-4 min-w-80 max-w-80 rounded-md text-white">Create New Role</Button>
					<div className="flex">
						<div className="mr-4 flex max-h-[95vh] flex-col space-y-2 overflow-y-auto">
							{roles.map((role, index) => (
								<Chip
									key={index}
									onClick={() => setSelectedRole(role)}
									variant="flat"
									className="min-h-10 min-w-80 max-w-80 cursor-pointer rounded-md"
								>
									<div className="group flex select-none">
										<span className="flex items-center space-x-2 text-white">
											<div
												className={"mr-1 h-4 w-4 rounded-full"}
												style={{
													backgroundColor: `#${role.color === 0 ? "c1c1c1" : role.color.toString(16).padStart(6, "0")}`,
												}}
											/>
											{role.name}
										</span>
										<Trash
											size={16}
											className="ml-auto scale-0 cursor-pointer text-danger transition-transform duration-100 ease-in-out group-hover:scale-100"
										/>
									</div>
								</Chip>
							))}
						</div>
					</div>
				</div>
				<div className="flex w-full">
					<Divider orientation="vertical" />
					<div className="ml-2 flex-1 rounded-md bg-charcoal-700 pl-4 pr-4">
						<Tabs color="primary" variant="light" className="w-full border-b-2 border-slate-800 text-slate-800">
							<Tab key="1" title="Information">
								<div className="flex flex-col space-y-4">
									<div className="space-y-2">
										<p className="font-semibold text-white">Role Name</p>
										<Input
											value={selectedRole.name}
											isRequired
											className="h-8 w-full"
											radius="sm"
											classNames={{
												inputWrapper: "h-8",
											}}
										/>
									</div>
									<div className="space-y-2">
										<p className="font-semibold text-white">Role Color</p>
										<ColorPicker selectedRole={selectedRole} />
									</div>
									<Divider />
									<div className="h-full w-full cursor-pointer">
										<Switch isSelected={false}>Display role members separately from online members</Switch>
										<p className="select-none text-sm text-gray-500">
											This will display role members in a separate category in the member list.
										</p>
									</div>
									<Divider />
									<div className="h-full w-full cursor-pointer">
										<Switch isSelected={false}>Mentionable</Switch>
										<p className="select-none text-sm text-gray-500">This will allow anyone to mention this role.</p>
									</div>
									<Divider />
									<div className="h-full w-full cursor-pointer">
										<Switch isSelected={false}>Allow access to age restricted channels</Switch>
										<p className="select-none text-sm text-gray-500">
											This will allow anyone with this role to access age restricted channels.
										</p>
									</div>
									<Divider />
								</div>
							</Tab>
							<Tab key="2" title="Permissions">
								<div className="flex flex-col space-y-6">
									<div className="flex h-full w-full cursor-pointer">
										<p className="select-none font-semibold text-white">Advanced Mode</p>
										<Switch
											className="ml-auto"
											isSelected={advancedMode}
											onChange={() => setAdvancedMode(!advancedMode)}
											size="sm"
										/>
									</div>
									<Input
										placeholder="Search Permissions"
										className="h-8 w-full"
										radius="sm"
										classNames={{
											inputWrapper: "h-8",
										}}
									/>
									<div className="flex max-h-[80vh] flex-col space-y-2 overflow-y-auto">
										{Object.entries(
											advancedMode ? PermissionsDescriptions.advanced.groups : PermissionsDescriptions.simple.groups,
										).map(([index, permission]) => (
											<div key={index} className="rounded-md bg-lightAccent p-4 dark:bg-darkAccent">
												<div className="flex">
													<p className="font-semibold text-white">{permission.label}</p>
													<Switch
														className="ml-auto"
														size="sm"
														isSelected={permissions.has(permission.permissions, true)}
													/>
												</div>
												<p className="mt-2 select-none text-sm text-gray-300">{permission.description}</p>
											</div>
										))}
									</div>
								</div>
							</Tab>
							<Tab key="3" title="Users" isDisabled>
								Coming Soon
							</Tab>
						</Tabs>
					</div>
				</div>
			</div>
			<SaveChanges onCancel={() => console.log("Cancel")} onSave={() => console.log("Save")} isShowing />
		</div>
	);
};

export default Roles;
