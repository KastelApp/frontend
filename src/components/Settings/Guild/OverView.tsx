import { useState } from "react";
import {
	Input,
	Avatar,
	Badge,
	Select,
	SelectSection,
	SelectItem,
	Textarea,
	Divider,
} from "@nextui-org/react";
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
	const [guildId] = router.query.slug as string[];
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
		staffOnly
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
	})

	const [loading, setLoading] = useState(false);

	const { isStaff, getCurrentUser } = useUserStore();
	const user = getCurrentUser()!;
	const { getChannels } = useChannelStore();

	const channels = getChannels(guildId).filter((channel) => channel.type === Constants.channelTypes.GuildText);

	return (
		<div className="mr-2 bg-lightAccent dark:bg-darkAccent rounded-lg">
			<div className="flex flex-col p-4">
				<h1 className="text-2xl font-semibold">Guild Overview</h1>
				<div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-4">
					<div className="flex flex-col items-center col-span-1 sm:col-span-1">
						<Tooltip content="Remove Icon" placement="right" delay={750} className="select-none">
							<Badge
								content={<X />}
								placement="top-right"
								className="mb-2 mr-1 h-8 w-8 hover:scale-95 active:scale-85 cursor-pointer hover:opacity-95 z-20"
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
						<p className="text-sm text-gray-500 mt-2">Upload a guild icon.</p>
					</div>
					<div className="flex flex-col col-span-1 sm:col-span-2">
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
					<div className="flex flex-col col-span-1 sm:col-span-2">
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
				<div className="flex flex-col mt-4">
					<SwitchOption title="Maintenance Mode" description="Stop's all non-staff members from accessing the guild." value={maintenanceMode.state} setValue={maintenanceMode.set} />
					<SwitchOption title="Disable Invites" description="Prevents new members from joining the guild." value={invitesDisabled.state} setValue={invitesDisabled.set} />
					{isStaff(user?.id ?? "") && <SwitchOption title="Internal Staff Guild (Staff Only)" description="Only staff members (with the staff flag) can access the guild." value={staffOnly.state} setValue={staffOnly.set} />}
				</div>
				<Divider className="mb-8 mt-8" />
				<h2 className="text-xl font-semibold">System Messages</h2>
				<div className="flex flex-col mt-4">
					<h3 className="text-lg font-semibold">Join & Leave Messages</h3>
					<div className="flex flex-col items-start mb-4 mt-2">
						<p className="mb-4">Join Message Channel</p>
						<Select
							placeholder="Select a channel"
							selectedKeys={[joinMessageChannel.state]}
							onChange={(e) => joinMessageChannel.set(e.target.value)}
						>
							<SelectSection title="Channels">
								{
									channels.map((channel) => (
										<SelectItem key={channel.id} value={channel.id}>
											{channel.name}
										</SelectItem>
									))
								}
							</SelectSection>
						</Select>
					</div>
					<div className="flex flex-col mb-2">
						<SwitchOption title="Send Welcome Message" description="Send a welcome message when someone joins the guild." value={sendWelcomeMessage.state} setValue={sendWelcomeMessage.set} />
						<SwitchOption title="Send Leave Message" description="Send a leave message when someone leaves the guild." value={sendLeaveMessage.state} setValue={sendLeaveMessage.set} />
					</div>
					<h3 className="text-lg font-semibold">Changelog</h3>
					<div className="flex flex-col items-start mb-4 mt-2">
						<p className="mb-4">Changelog Channel</p>
						<Select
							placeholder="Select a channel"
							selectedKeys={[changelogChannel.state]}
							onChange={(e) => changelogChannel.set(e.target.value)}
						>
							<SelectSection title="Channels">
								{
									channels.map((channel) => (
										<SelectItem key={channel.id} value={channel.id}>
											{channel.name}
										</SelectItem>
									))
								}
							</SelectSection>
						</Select>
					</div>
					<div className="flex flex-col">
						<SwitchOption title="Send User Changelog" value={sendUserChangelog.state} setValue={sendUserChangelog.set} />
						<SwitchOption title="Send Guild Changelog" value={sendGuildChangelog.state} setValue={sendGuildChangelog.set} />
					</div>
				</div>
			</div>
			<SaveChanges onCancel={reset} onSave={() => {
				setLoading(true);

				setTimeout(() => {
					save();
					setLoading(false);
				}, 1000);
			}} isShowing={isDirty} isLoading={loading} />
		</div>
	);
};

export default Overview;
