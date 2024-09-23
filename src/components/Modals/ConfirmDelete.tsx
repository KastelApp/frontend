import { useTranslationStore } from "@/wrapper/Stores.tsx";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";

// todo: show 2fa modal (lol 3 modals on top of each other)
const ConfirmDelete = ({
	isOpen,
	onClose,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
}) => {
	const { t } = useTranslationStore();
	const [timer, setTimer] = useState(10);

	useEffect(() => {
		if (isOpen) {
			setTimer(10);

			const interval = setInterval(() => {
				setTimer((prev) => {
					if (prev <= 0) {
						clearInterval(interval);

						return 0;
					}

					return prev - 1;
				});
			}, 1000);

			return () => {
				clearInterval(interval);
			};
		}
	}, [isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			placement="top-center"
			className="text-white"
			key={"confirm-delete-modal"}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">{t("guilds.delete.header")}</ModalHeader>
				<ModalBody>
					<p className="text-lg">{t("guilds.delete.loose")}</p>
					<ul className="ml-6 list-disc">
						<li>{t("guilds.delete.messages")}</li>
						<li>{t("guilds.delete.channels")}</li>
						<li>{t("guilds.delete.roles")}</li>
						<li>{t("guilds.delete.members")}</li>
						<li>{t("guilds.delete.banned")}</li>
					</ul>
					<p>
						{timer > 0
							? t("guilds.delete.sureWait", {
									time: timer,
								})
							: t("guilds.delete.sureReady")}
					</p>
				</ModalBody>
				<ModalFooter>
					<Button color="success" variant="flat" onPress={onClose}>
						{t("common.cancel")}
					</Button>
					<Button color="danger" variant="flat" onPress={onClose}>
						{timer <= 0
							? t("common.delete")
							: t("guilds.delete.delete", {
									time: timer,
								})}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ConfirmDelete;
