import { modalStore } from "@/wrapper/Stores/GlobalModalStore.ts";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { memo } from "react";

const ModalQueue = memo(() => {
    const { modalQueue, closeModal } = modalStore();

    const sortedModalQueue = modalQueue.sort((a, b) => (a.priority ?? -1) - (b.priority ?? -1)).reverse();

    console.log("SORTED", sortedModalQueue);

    return (
        <>
            {sortedModalQueue.length > 0 && (
                <div className="z-50 bg-overlay/50 backdrop-opacity-disabled w-screen h-screen fixed inset-0" />
            )}
            {sortedModalQueue.map((item) => (
                <Modal
                    key={item.id}
                    isOpen
                    onClose={() => {
                        if (item.closable !== undefined && !item.closable) return;

                        item.onClose?.();

                        closeModal(item.id);
                    }}
                    isDismissable={item.closable ?? true}
                    isKeyboardDismissDisabled={!(item.closable ?? true)}
                    size={item.props?.modalSize}
                    className={item.props?.classNames?.modal}
                    hideCloseButton={!(item.closable ?? true)}
                    backdrop={"transparent"}
                >
                    <ModalContent className={item.props?.classNames?.content}>
                        {item.title && (
                            <ModalHeader className={item.props?.classNames?.header}>
                                {item.title}
                            </ModalHeader>
                        )}
                        {item.body && (
                            <ModalBody className={item.props?.classNames?.body}>
                                {item.body}
                            </ModalBody>
                        )}
                        {item.footer && (
                            <ModalFooter className={item.props?.classNames?.footer}>
                                {item.footer}
                            </ModalFooter>
                        )}
                    </ModalContent>
                </Modal>
            ))}
        </>
    );
});

export default ModalQueue;