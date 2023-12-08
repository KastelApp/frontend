import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export default function GuildSettings({ isOpen, onClose }) {
  return (
    <Modal variant={"dark"} isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent margin={0} rounded="none">
        <ModalCloseButton />

        <Text>
          Guild Settings
          <br />
          Under Construction
        </Text>
      </ModalContent>
    </Modal>
  );
}
