import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import GuildSettingsSidebar from "./sidebar.tsx";

const GuildSettings = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedPage, setSeletedPage] = useState(0);

  return (
    <Modal
      variant={useColorModeValue("light", "dark")}
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalOverlay />
      <ModalContent margin={0} rounded="none">
        <ModalCloseButton />
        <GuildSettingsSidebar
          selectedPage={selectedPage}
          setSelectedPage={setSeletedPage}
        ></GuildSettingsSidebar>
      </ModalContent>
    </Modal>
  );
};

export default GuildSettings;
