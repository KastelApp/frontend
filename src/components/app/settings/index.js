import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

export default function Settings({ userInfo, isOpen, onClose }) {
  return (
    <Modal variant={"dark"} isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent margin={0} rounded="none">
        <ModalHeader>Hello, {userInfo?.username}</ModalHeader>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
}
