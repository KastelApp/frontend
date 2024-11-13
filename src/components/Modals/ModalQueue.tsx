import cn from "@/utils/cn.ts";
import { modalStore } from "@/wrapper/Stores/GlobalModalStore.ts";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { memo } from "react";

const ModalQueue = memo(() => {
	const { modalQueue, closeModal } = modalStore();

	const sortedModalQueue = modalQueue.sort((a, b) => (a.priority ?? -1) - (b.priority ?? -1)).reverse();

	return (
		<>
			{sortedModalQueue.map((item) => (
				<Modal
					key={item.id}
					isOpen
					onClose={() => {
						if (item.allowCloseByButton !== true && !(item.closable ?? true)) return;

						item.onClose?.();

						closeModal(item.id);
					}}
					isDismissable={item.closable ?? true}
					isKeyboardDismissDisabled={!(item.closable ?? true)}
					size={item.props?.modalSize === "fit" ? undefined : item.props?.modalSize}
					className={item.props?.classNames?.modal}
					hideCloseButton={item.hideCloseButton ?? (item.allowCloseByButton !== true && !(item.closable ?? true))}
					backdrop={"blur"}
					classNames={{
						...item.props?.classNames,
						body: cn(item.props?.classNames?.body, "bg-darkAccent"),
						header: cn(item.props?.classNames?.header, "bg-darkAccent"),
						footer: cn(item.props?.classNames?.footer, "bg-darkAccent"),
						base: cn(item.props?.classNames?.base, item.props?.modalSize === "fit" ? "max-w-full" : ""),
					}}
					radius={item.props?.radius}
				>
					<ModalContent className={item.props?.classNames?.content}>
						{item.title && <ModalHeader className={item.props?.classNames?.header}>{item.title}</ModalHeader>}
						{item.body && <ModalBody className={item.props?.classNames?.body}>{item.body}</ModalBody>}
						{item.footer && <ModalFooter className={item.props?.classNames?.footer}>{item.footer}</ModalFooter>}
					</ModalContent>
				</Modal>
			))}
		</>
	);
});

export default ModalQueue;
