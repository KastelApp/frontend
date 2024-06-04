import { useState } from "react";
import {
	Input,
	Avatar,
	Badge,
	Switch,
	Select,
	SelectSection,
	SelectItem,
	Textarea,
	Divider,
	Tooltip,
} from "@nextui-org/react";
import { X } from "lucide-react";

const Overview = () => {
	const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
	const [invitesDisabled, setInvitesDisabled] = useState<boolean>(false);
	const [staffOnly, setStaffOnly] = useState<boolean>(false);
	const [joinMessageChannel, setJoinMessageChannel] = useState<string>("");
	const [sendWelcomeMessage, setSendWelcomeMessage] = useState<boolean>(false);
	const [sendLeaveMessage, setSendLeaveMessage] = useState<boolean>(false);
	const [changelogChannel, setChangelogChannel] = useState<string>("");
	const [sendUserChangelog, setSendUserChangelog] = useState<boolean>(false);
	const [sendGuildChangelog, setSendGuildChangelog] = useState<boolean>(false);
	return (
		<div className="mr-2 bg-accent rounded-lg">
			<div className="flex flex-col p-4">
				<h1 className="text-2xl font-semibold">Guild Overview</h1>
				<div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-4">
					<div className="flex flex-col items-center col-span-1 sm:col-span-1">
						<Tooltip content="Remove Icon" placement="right" delay={750} className="select-none">
							<Badge
								content={<X />}
								placement="top-right"
								className="mb-2 mr-1 h-8 w-8 hover:scale-95 active:scale-85 cursor-pointer hover:opacity-95 z-50"
								color={"danger"}
								onClick={() => {
									console.log("Remove Icon");
								}}
							>
								<div className="relative transition-opacity duration-300 ease-in-out group">
									<Avatar src={"/icon-1.png"} alt="User Avatar" className="h-24 w-24 bg-transparent" />
									<p className="hidden group-hover:block text-white font-bold text-xs absolute inset-0 ml-2.5 mt-10 w-full min-w-full items-center justify-center !z-20">
										Change Icon
									</p>
									<input
										type="file"
										accept=".png,.jpg,.jpeg,.apng,.gif"
										className="cursor-pointer absolute inset-0 w-full h-full opacity-0 z-20"
										title=""
										onChange={() => { }}
									/>
									<div className="group-hover:bg-opacity-50 rounded-full absolute inset-0 bg-black bg-opacity-0" />
								</div>
							</Badge>
						</Tooltip>
						<p className="text-sm text-gray-500 mt-2">Upload a guild icon</p>
					</div>
					<div className="flex flex-col col-span-1 sm:col-span-2">
						<Input
							label="Guild Name"
							placeholder="Enter a guild name"
							className="w-full"
							description="The name of your guild"
						/>
					</div>
					<div className="flex flex-col col-span-1 sm:col-span-2">
						<Textarea
							label="Guild Description"
							placeholder="Enter a guild description"
							className="w-full"
							description="The description of your guild"
							maxRows={3}
						/>
					</div>
				</div>

				<Divider className="mb-8 mt-8" />
				<h2 className="text-xl font-semibold">Guild Features</h2>
				<div className="flex flex-col mt-4">
					<div className="flex justify-between items-center">
						<div className="flex flex-col">
							<p>Maintenance Mode</p>
							<p className="text-sm text-gray-400">Stop's all non-staff members from accessing the guild.</p>
						</div>
						<Switch checked={maintenanceMode} onValueChange={setMaintenanceMode} />
					</div>
					<div className="flex justify-between items-center mt-1">
						<div className="flex flex-col">
							<p>Invites Disabled</p>
							<p className="text-sm text-gray-400">Prevents new members from joining the guild.</p>
						</div>
						<Switch checked={invitesDisabled} onValueChange={setInvitesDisabled} />
					</div>
					<div className="flex justify-between items-center mt-1">
						<div className="flex flex-col">
							<p>Internal Staff Guild (Staff Only)</p>
							<p className="text-sm text-gray-400">Only staff members (with the staff flag) can access the guild.</p>
						</div>
						<Switch checked={staffOnly} onValueChange={setStaffOnly} />
					</div>
				</div>
				<Divider className="mb-8 mt-8" />
				<h2 className="text-xl font-semibold">System Messages</h2>
				<div className="flex flex-col mt-4">
					<h3 className="text-lg font-semibold">Join & Leave Messages</h3>
					<div className="flex flex-col items-start mb-4 mt-2">
						<p className="mb-4">Join Message Channel</p>
						<Select
							placeholder="Select a channel"
							value={joinMessageChannel}
							onChange={(e) => setJoinMessageChannel(e.target.value)}
						>
							<SelectSection title="Channels">
								<SelectItem key="channel1" value="channel1">
									Channel 1
								</SelectItem>
								<SelectItem key="channel2" value="channel2">
									Channel 2
								</SelectItem>
							</SelectSection>
						</Select>
					</div>

					<div className="flex justify-between items-center">
						<p>Send Welcome Message</p>
						<Switch checked={sendWelcomeMessage} onValueChange={setSendWelcomeMessage} />
					</div>
					<div className="flex justify-between items-center mt-1 mb-1">
						<p>Send Leave Message</p>
						<Switch checked={sendLeaveMessage} onValueChange={setSendLeaveMessage} />
					</div>
					<h3 className="text-lg font-semibold">Changelog</h3>
					<div className="flex flex-col items-start mb-4 mt-2">
						<p className="mb-4">Changelog Channel</p>
						<Select
							placeholder="Select a channel"
							value={changelogChannel}
							onChange={(e) => setChangelogChannel(e.target.value)}
						>
							<SelectSection title="Channels">
								<SelectItem key="channel1" value="channel1">
									Channel 1
								</SelectItem>
								<SelectItem key="channel2" value="channel2">
									Channel 2
								</SelectItem>
							</SelectSection>
						</Select>
					</div>
					<div className="flex justify-between items-center">
						<p>Send User Changelog</p>
						<Switch checked={sendUserChangelog} onValueChange={setSendUserChangelog} />
					</div>
					<div className="flex justify-between items-center mt-1 mb-1">
						<p>Send Guild Changelog</p>
						<Switch checked={sendGuildChangelog} onValueChange={setSendGuildChangelog} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Overview;
