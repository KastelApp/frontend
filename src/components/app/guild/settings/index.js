import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import Guild_Settings_Sidebar from "@/components/app/guild/settings/sidebar";

export default function GuildSettings({ isOpen, onClose }) {
  let [selectedPage, setSeletedPage] = useState(0);

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
        <Guild_Settings_Sidebar
          selectedPage={selectedPage}
          setSelectedPage={setSeletedPage}
        ></Guild_Settings_Sidebar>
      </ModalContent>
    </Modal>
  );
}
