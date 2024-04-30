import React, { useState } from "react";
import { Input, Avatar, Badge, Switch, Select, SelectSection, SelectItem, Textarea, Divider, Card, CardBody } from "@nextui-org/react";

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
    const [guildRegion, setGuildRegion] = useState<string>("");

    return (
        <Card className="mr-2 bg-accent">
            <CardBody className="flex flex-col p-4">
                    <h1 className="text-2xl font-semibold">Guild Overview</h1>
                    <div className="flex justify-start mt-4">
                        <div className="flex flex-col items-center">
                            <div className="cursor-pointer hover:scale-95 transition-all duration-300 ease-in-out transform hover:opacity-50">
                                <Badge content="+" color="primary" size="lg">
                                    <Avatar src="https://development.kastelapp.com/icon-1.png" className="w-20 h-20" />
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Upload a guild icon</p>
                        </div>
                        <div className="flex flex-col ml-16">
                            <Input
                                label="Guild Name"
                                placeholder="Enter a guild name"
                                className="w-[25vw]"
                                description="The name of your guild"
                            />
                        </div>
                        <div className="flex flex-col ml-4">
                            {/* note: Region isn't used yet, though will be used for discovery once I work on that, so for now ignore */}
                            <Select label="Guild Region" placeholder="Select a region" className="w-[15vw]" size="md" description="The region your guild" value={guildRegion} onChange={(e) => setGuildRegion(e.target.value)}>
                                <SelectSection title="Regions">
                                    <SelectItem key="region1" value="region1">United States</SelectItem>
                                    <SelectItem key="region2" value="region2">Japan</SelectItem>
                                </SelectSection>
                            </Select>
                        </div>
                        <div className="flex flex-col ml-4">
                            <Textarea
                                label="Guild Description"
                                placeholder="Enter a guild description"
                                className="w-[25vw]"
                                description="The description of your guild"
                                maxRows={3}
                            />
                        </div>
                    </div>
                    <Divider className="mb-8 mt-8" />
                    <h2 className="text-xl font-semibold">Guild Features</h2>
                    <div className="flex flex-col mt-4">
                        <div className="flex justify-between items-center">
                            <p>Guild Maintenance Mode</p>
                            <Switch checked={maintenanceMode} onValueChange={setMaintenanceMode} />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <p>Guild Invites Disabled</p>
                            <Switch checked={invitesDisabled} onValueChange={setInvitesDisabled} />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <p>Internal Staff Guild (Staff Only)</p>
                            <Switch checked={staffOnly} onValueChange={setStaffOnly} />
                        </div>
                    </div>
                    <Divider className="mb-8 mt-8" />
                    <h2 className="text-xl font-semibold">System Messages</h2>
                    <div className="flex flex-col mt-4">
                        <h3 className="text-lg font-semibold">Join & Leave Messages</h3>
                        <div className="flex flex-col items-start mb-4 mt-2">
                            <p className="mb-4">Join Message Channel</p>
                            <Select placeholder="Select a channel" value={joinMessageChannel} onChange={(e) => setJoinMessageChannel(e.target.value)}>
                                <SelectSection title="Channels">
                                    <SelectItem key="channel1" value="channel1">Channel 1</SelectItem>
                                    <SelectItem key="channel2" value="channel2">Channel 2</SelectItem>
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
                            <Select placeholder="Select a channel" value={changelogChannel} onChange={(e) => setChangelogChannel(e.target.value)}>
                                <SelectSection title="Channels">
                                    <SelectItem key="channel1" value="channel1">Channel 1</SelectItem>
                                    <SelectItem key="channel2" value="channel2">Channel 2</SelectItem>
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
            </CardBody>
        </Card>

    );
};

export default Overview;
