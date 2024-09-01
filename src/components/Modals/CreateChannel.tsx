import Constants from "@/utils/Constants.ts";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { RadioGroup, Radio, cn, RadioProps } from "@nextui-org/react";
import { useTranslationStore } from "@/wrapper/Stores.ts";

export const CustomRadio = (props: RadioProps) => {
	const { children, ...otherProps } = props;

	return (
		<Radio
			{...otherProps}
			classNames={{
				base: cn(
					"inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
					"flex-row-reverse max-w-[25rem] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
					"data-[selected=true]:border-primary",
				),
			}}
		>
			{children}
		</Radio>
	);
};

const CreateChannelModal = ({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
}) => {
	const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
	const { t } = useTranslationStore();

	const mappings = {
		[Constants.channelTypes.GuildCategory]: {
			name: t("channelTypes.guildCategory.name"),
			description: t("channelTypes.guildCategory.description"),
		},
		[Constants.channelTypes.GuildText]: {
			name: t("channelTypes.guildText.name"),
			description: t("channelTypes.guildText.description"),
		},
		[Constants.channelTypes.GuildVoice]: {
			name: t("channelTypes.guildVoice.name"),
			description: t("channelTypes.guildVoice.description"),
		},
		[Constants.channelTypes.GuildNews]: {
			name: t("channelTypes.guildNews.name"),
			description: t("channelTypes.guildNews.description"),
		},
		[Constants.channelTypes.GuildNewMember]: {
			name: t("channelTypes.guildNewMember.name"),
			description: t("channelTypes.guildNewMember.description"),
		},
		[Constants.channelTypes.GuildMarkdown]: {
			name: t("channelTypes.guildMarkdown.name"),
			description: t("channelTypes.guildMarkdown.description"),
		},
		[Constants.channelTypes.GuildRules]: {
			name: t("channelTypes.guildRules.name"),
			description: t("channelTypes.guildRules.description"),
		},
	};

	const [tab, setTab] = useState<0 | 1>(0);

	const [form, setForm] = useState<{
		name: string;
		description: string;
	}>({
		name: "",
		description: "",
	});

	const [error] = useState<string | null>(null);
	const [nameError, setNameError] = useState<string | null>(null);
	const [descriptionError, setDescriptionError] = useState<string | null>(null);

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={() => {
				onOpenChange();
			}}
			placement="top-center"
			size="xl"
			className="w-[30rem]"
		>
			<ModalContent className="overflow-hidden">
				<ModalHeader className="flex flex-col gap-1 text-center">
					<h1>Create a channel</h1>
					<p className="text-sm text-gray-500">{tab === 0 ? "Choose a channel type" : "Fill out channel details"}</p>
				</ModalHeader>
				<ModalBody>
					{error && <p className="text-danger">{error}</p>}
					{tab === 0 ? (
						<RadioGroup className="max-h-96 max-w-[28rem] overflow-y-scroll p-2" value={selectedChannel}>
							{Object.entries(mappings)
								.filter(
									([k]) =>
										![Constants.channelTypes.Dm.toString(), Constants.channelTypes.GroupChat.toString()].includes(k),
								)
								.map(([key, value]) => (
									<CustomRadio
										key={key}
										value={key}
										onChange={() => {
											setSelectedChannel(key);
										}}
										description={value.description}
									>
										{value.name}
									</CustomRadio>
								))}
						</RadioGroup>
					) : (
						<div className="flex flex-col gap-4">
							<Input
								value={form.name}
								label="Channel Name"
								variant="bordered"
								onChange={(e) => {
									// setForm((prev) => ({ ...prev, name: e.target.value }))
									const value = e.target.value.replaceAll(" ", "-");

									if (value === "") {
										setForm((prev) => ({ ...prev, name: value }));

										return;
									}

									if (value === "-") return;

									// ? channel names can only be a-Z 0-9 or have a -. It cannot have two -'s in a row
									// ? spaces are converted to -'s string can be uppercased
									if (!/^(?!.*--)[a-zA-Z0-9- ]+$/.test(value)) return;

									setForm((prev) => ({ ...prev, name: value }));
									setNameError(null);
								}}
								isRequired
								errorMessage={nameError}
								isInvalid={nameError !== null}
							/>
							<Textarea
								value={form.description}
								label="Channel Description"
								variant="bordered"
								onChange={(e) => {
									setForm((prev) => ({ ...prev, description: e.target.value }));
									setDescriptionError(null);
								}}
								errorMessage={descriptionError}
								isInvalid={descriptionError !== null}
							/>
						</div>
					)}
				</ModalBody>
				<ModalFooter>
					<Button
						color="danger"
						variant="flat"
						onClick={() => {
							if (tab === 0) {
								onOpenChange();
							} else {
								setTab(0);
							}
						}}
					>
						{tab === 0 ? "Cancel" : "Back"}
					</Button>
					<Button
						color="success"
						variant="flat"
						onClick={() => {
							if (tab === 0) {
								setTab(1);
							} else {
								if (form.name === "") {
									setNameError("Name cannot be empty");

									return;
								}
							}
						}}
					>
						{tab === 0 ? "Next" : "Create"}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CreateChannelModal;
