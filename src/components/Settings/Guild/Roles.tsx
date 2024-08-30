import { useEffect, useRef, useState } from "react";
import { Tabs, Tab, Button, Input, Switch, Chip, Divider, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useColor, ColorPicker as CustomColorPicker, ColorService } from "react-color-palette";
import { Trash } from "lucide-react";
import PermissionsDescriptions from "@/utils/PermissionsDescriptions.ts";
import { useRouter } from "next/router";
import { Role, useRoleStore } from "@/wrapper/Stores/RoleStore.ts";
import deepEqual from "fast-deep-equal";
import SaveChanges from "@/components/SaveChanges.tsx";
import Permissions from "@/wrapper/Permissions.ts";
import Tooltip from "@/components/Tooltip.tsx";

const generateRgbAndHsv = (color: string) => {
	return {
		hex: color,
		rgb: ColorService.toRgb(color),
		hsv: ColorService.toHsv(color)
	};
};

const ColorPicker = ({ selectedRole }: {
	selectedRole: Role;
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

	const [color, setColor] = useColor(`#${selectedRole.color === 0 ? "c1c1c1" : selectedRole.color.toString(16).padStart(6, "0")}`);
	const [delayOpen, setDelayOpen] = useState(false);

	return (
		<div className="flex">
			<Tooltip content="Default Color">
				<div className="cursor-pointer w-11 h-11 rounded-md mr-2" style={{
					backgroundColor: defaultColor
				}} onClick={() => {
					setColor(generateRgbAndHsv(defaultColor));
					// selectedRole.color = defaultColor;
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
							<div className="cursor-pointer w-11 h-11 rounded-md mr-2" style={{
								backgroundColor: `#${selectedRole.color === 0 ? "c1c1c1" : selectedRole.color.toString(16).padStart(6, "0")}`
							}} />
						</Tooltip>
					</div>
				</PopoverTrigger>
				<PopoverContent className="w-full h-full">
					{delayOpen && <CustomColorPicker
						color={color}
						onChange={(color) => {
							setColor(color);
							// selectedRole.color = color.hex;
						}}
						hideAlpha
						hideInput={["hsv", "rgb"]}
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
								// selectedRole.color = color;
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

	const [currentGuildId] = router.query.slug as string[];

	const roleRef = useRef(useRoleStore.getState().getRoles(currentGuildId).sort((a, b) => a.position - b.position).reverse());

	useEffect(() => {
		const roleSubscribe = useRoleStore.subscribe((s) => {
			const roles = s.getRoles(currentGuildId).sort((a, b) => a.position - b.position).reverse();

			if (deepEqual(roles, roleRef.current)) return;

			roleRef.current = roles;
		});

		return () => {
			roleSubscribe();
		};
	}, []);

	const roles = roleRef.current;

	const [selectedRole, setSelectedRole] = useState(roles[0]);
	const [advancedMode, setAdvancedMode] = useState(false);

	const [permissions, setPermissions] = useState<Permissions>(new Permissions([]));

	useEffect(() => {
		if (!selectedRole) return;

		setPermissions(new Permissions(selectedRole.permissions));
	}, [selectedRole]);

	return (
		<div className="mr-2 bg-lightAccent dark:bg-darkAccent rounded-lg p-4">
			<h1 className="text-2xl font-semibold mb-4">Roles</h1>
			<div className="flex h-screen">
				<div>
					<Button className="mb-4 min-w-80 max-w-80 rounded-md text-white">Create New Role</Button>
					<div className="flex">
						<div className="flex flex-col space-y-2 mr-4 overflow-y-auto max-h-[95vh]">
							{roles.map((role, index) => (
								<Chip
									key={index}
									onClick={() => setSelectedRole(role)}
									variant="flat"
									className="min-w-80 max-w-80 rounded-md cursor-pointer min-h-10"
								>
									<div className="flex group select-none">
										<span className="flex items-center space-x-2 text-white">
											<div className={"w-4 h-4 rounded-full mr-1"} style={{
												backgroundColor: `#${role.color === 0 ? "c1c1c1" : role.color.toString(16).padStart(6, "0")}`
											}} />
											{role.name}
										</span>
										<Trash size={16} className="cursor-pointer ml-auto scale-0 group-hover:scale-100 transition-transform duration-100 ease-in-out text-danger" />
									</div>
								</Chip>
							))}
						</div>
					</div>
				</div>
				<div className="flex w-full">
					<Divider orientation="vertical" />
					<div className="pl-4 pr-4 flex-1 bg-charcoal-700 rounded-md ml-2">
						<Tabs
							color="primary"
							variant="light"
							className="w-full border-b-2 border-slate-800 text-slate-800"
						>
							<Tab key="1" title="Information">
								<div className="flex flex-col space-y-4">
									<div className="space-y-2">
										<p className="text-white font-semibold">Role Name</p>
										<Input
											value={selectedRole.name}
											isRequired
											className="w-full h-8"
											radius="sm"
											classNames={{
												inputWrapper: "h-8"
											}}
										/>
									</div>
									<div className="space-y-2">
										<p className="text-white font-semibold">Role Color</p>
										<ColorPicker selectedRole={selectedRole} />
									</div>
									<Divider />
									<div className="cursor-pointer h-full w-full">
										<Switch isSelected={false}>
											Display role members separately from online members
										</Switch>
										<p className="text-gray-500 text-sm select-none">This will display role members in a separate category in the member list.</p>
									</div>
									<Divider />
									<div className="cursor-pointer h-full w-full">
										<Switch isSelected={false}>
											Mentionable
										</Switch>
										<p className="text-gray-500 text-sm select-none">This will allow anyone to mention this role.</p>
									</div>
									<Divider />
									<div className="cursor-pointer h-full w-full">
										<Switch isSelected={false}>
											Allow access to age restricted channels
										</Switch>
										<p className="text-gray-500 text-sm select-none">This will allow anyone with this role to access age restricted channels.</p>
									</div>
									<Divider />
								</div>
							</Tab>
							<Tab key="2" title="Permissions">
								<div className="flex flex-col space-y-6">
									<div className="cursor-pointer h-full w-full flex">
										<p className="text-white select-none font-semibold">Advanced Mode</p>
										<Switch className="ml-auto" isSelected={advancedMode} onChange={() => setAdvancedMode(!advancedMode)} size="sm" />
									</div>
									<Input
										placeholder="Search Permissions"
										className="w-full h-8"
										radius="sm"
										classNames={{
											inputWrapper: "h-8"
										}}
									/>
									<div className="flex flex-col space-y-2 overflow-y-auto max-h-[80vh]">
										{Object.entries(advancedMode ? PermissionsDescriptions.advanced.groups : PermissionsDescriptions.simple.groups).map(([index, permission]) => (
											<div key={index} className="bg-lightAccent dark:bg-darkAccent rounded-md p-4">
												<div className="flex">
													<p className="text-white font-semibold">{permission.label}</p>
													<Switch className="ml-auto" size="sm"
														isSelected={permissions.has(permission.permissions, true)}
													/>
												</div>
												<p className="text-gray-300 text-sm select-none mt-2">{permission.description}</p>
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
