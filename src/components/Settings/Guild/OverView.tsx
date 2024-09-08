import { useState } from "react";
import { Input, Avatar, Badge, Select, SelectSection, SelectItem, Textarea, Divider } from "@nextui-org/react";
import { X } from "lucide-react";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import SaveChanges from "@/components/SaveChanges.tsx";
import Tooltip from "@/components/Tooltip.tsx";
import SwitchOption from "@/components/SwitchOption.tsx";
import { useRouter } from "next/router";
import Constants from "@/utils/Constants.ts";
import { useMultiFormState } from "@/hooks/useStateForm.ts";

const Overview = () => {
	const router = useRouter();
	const [guildId] = router?.query?.slug as string[];
	const guild = useGuildStore((s) => s.getGuild(guildId));

	const {
		isDirty,
		reset,
		save,
		changelogChannel,
		guildDescription,
		guildName,
		invitesDisabled,
		joinMessageChannel,
		maintenanceMode,
		sendGuildChangelog,
		sendLeaveMessage,
		sendUserChangelog,
		sendWelcomeMessage,
		staffOnly,
	} = useMultiFormState({
		maintenanceMode: false,
		invitesDisabled: false,
		staffOnly: false,
		joinMessageChannel: "",
		sendWelcomeMessage: false,
		sendLeaveMessage: false,
		changelogChannel: "",
		sendUserChangelog: false,
		sendGuildChangelog: false,
		guildName: guild?.name ?? "",
		guildDescription: guild?.description ?? "",
	});

	const [loading, setLoading] = useState(false);

	const { isStaff, getCurrentUser } = useUserStore();
	const user = getCurrentUser()!;
	const { getChannels } = useChannelStore();

	const channels = getChannels(guildId).filter((channel) => channel.type === Constants.channelTypes.GuildText);

	return (
		<div className="mr-2 rounded-lg bg-lightAccent dark:bg-darkAccent">
			<div className="flex flex-col p-4">
				<h1 className="text-2xl font-semibold">Guild Overview</h1>
				<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-5">
					<div className="col-span-1 flex flex-col items-center sm:col-span-1">
						<Tooltip content="Remove Icon" placement="right" delay={750} className="select-none">
							<Badge
								content={<X />}
								placement="top-right"
								className="z-20 mb-2 mr-1 h-8 w-8 cursor-pointer hover:scale-95 hover:opacity-95 active:scale-85"
								color={"danger"}
								onClick={() => {
									console.log("Remove Icon");
								}}
							>
								<div className="group relative transition-opacity duration-300 ease-in-out">
									<Avatar src={"/icon-1.png"} alt="User Avatar" className="h-24 w-24 bg-transparent" />
									<p className="absolute inset-0 !z-20 ml-2.5 mt-10 hidden w-full min-w-full items-center justify-center text-xs font-bold text-white group-hover:block">
										Change Icon
									</p>
									<input
										type="file"
										accept=".png,.jpg,.jpeg,.apng,.gif"
										className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
										title=""
										onChange={() => {}}
									/>
									<div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50" />
								</div>
							</Badge>
						</Tooltip>
						<p className="mt-2 text-sm text-gray-500">Upload a guild icon.</p>
					</div>
					<div className="col-span-1 flex flex-col sm:col-span-2">
						<Input
							label="Guild Name"
							placeholder="Enter a guild name"
							className="w-full"
							description="The name of your guild."
							value={guildName.state}
							onChange={(e) => {
								guildName.set(e.target.value);
							}}
						/>
					</div>
					<div className="col-span-1 flex flex-col sm:col-span-2">
						<Textarea
							label="Guild Description"
							placeholder="Enter a guild description"
							className="w-full"
							description="The description of your guild."
							maxRows={3}
							value={guildDescription.state}
							onChange={(e) => {
								guildDescription.set(e.target.value);
							}}
						/>
					</div>
				</div>

				<Divider className="mb-8 mt-8" />
				<h2 className="text-xl font-semibold">Guild Features</h2>
				<div className="mt-4 flex flex-col">
					<SwitchOption
						title="Maintenance Mode"
						description="Stop's all non-staff members from accessing the guild."
						value={maintenanceMode.state}
						setValue={maintenanceMode.set}
					/>
					<SwitchOption
						title="Disable Invites"
						description="Prevents new members from joining the guild."
						value={invitesDisabled.state}
						setValue={invitesDisabled.set}
					/>
					{isStaff(user?.id ?? "") && (
						<SwitchOption
							title="Internal Staff Guild (Staff Only)"
							description="Only staff members (with the staff flag) can access the guild."
							value={staffOnly.state}
							setValue={staffOnly.set}
						/>
					)}
				</div>
				<Divider className="mb-8 mt-8" />
				<h2 className="text-xl font-semibold">System Messages</h2>
				<div className="mt-4 flex flex-col">
					<h3 className="text-lg font-semibold">Join & Leave Messages</h3>
					<div className="mb-4 mt-2 flex flex-col items-start">
						<p className="mb-4">Join Message Channel</p>
						<Select
							placeholder="Select a channel"
							selectedKeys={[joinMessageChannel.state]}
							onChange={(e) => joinMessageChannel.set(e.target.value)}
						>
							<SelectSection title="Channels">
								{channels.map((channel) => (
									<SelectItem key={channel.id} value={channel.id}>
										{channel.name}
									</SelectItem>
								))}
							</SelectSection>
						</Select>
					</div>
					<div className="mb-2 flex flex-col">
						<SwitchOption
							title="Send Welcome Message"
							description="Send a welcome message when someone joins the guild."
							value={sendWelcomeMessage.state}
							setValue={sendWelcomeMessage.set}
						/>
						<SwitchOption
							title="Send Leave Message"
							description="Send a leave message when someone leaves the guild."
							value={sendLeaveMessage.state}
							setValue={sendLeaveMessage.set}
						/>
					</div>
					<h3 className="text-lg font-semibold">Changelog</h3>
					<div className="mb-4 mt-2 flex flex-col items-start">
						<p className="mb-4">Changelog Channel</p>
						<Select
							placeholder="Select a channel"
							selectedKeys={[changelogChannel.state]}
							onChange={(e) => changelogChannel.set(e.target.value)}
						>
							<SelectSection title="Channels">
								{channels.map((channel) => (
									<SelectItem key={channel.id} value={channel.id}>
										{channel.name}
									</SelectItem>
								))}
							</SelectSection>
						</Select>
					</div>
					<div className="flex flex-col">
						<SwitchOption
							title="Send User Changelog"
							value={sendUserChangelog.state}
							setValue={sendUserChangelog.set}
						/>
						<SwitchOption
							title="Send Guild Changelog"
							value={sendGuildChangelog.state}
							setValue={sendGuildChangelog.set}
						/>
					</div>
				</div>
			</div>
			<SaveChanges
				onCancel={reset}
				onSave={() => {
					setLoading(true);

					setTimeout(() => {
						save();
						setLoading(false);
					}, 1000);
				}}
				isShowing={isDirty}
				isLoading={loading}
			/>
		</div>
	);
};

export default Overview;
