import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export default function GuildInvites({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"sm"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text>
            Invites
            <br />
            Under Construction
          </Text>
        </ModalHeader>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
}
