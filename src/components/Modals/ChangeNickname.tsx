import { useTranslationStore } from "@/wrapper/Stores.ts";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useState } from "react";

const ChangeNickname = ({
	isOpen,
	onClose,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
}) => {
	const [nickname, setNickname] = useState("");
	const { t } = useTranslationStore();

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center" size="lg">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">{t("guilds.nickname.header")}</ModalHeader>
				<ModalBody>
					<Input
						autoFocus
						placeholder="Kiki"
						variant="bordered"
						maxLength={32}
						className="w-full min-w-64"
						description={t("guilds.nickname.description", { remaining: 32 - nickname.length, max: 32 })}
						value={nickname}
						onChange={(e) => setNickname(e.target.value)}
					/>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" variant="flat" onPress={onClose}>
						{t("common.cancel")}
					</Button>
					<Button color="success" variant="flat" onPress={onClose}>
						{t("common.save")}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ChangeNickname;
