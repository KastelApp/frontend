import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import GuildSettingsSidebar from "./sidebar.tsx";
import {
  GuildSettingsBans,
  GuildSettingsCoOwners,
  GuildSettingsInvites,
  GuildSettingsMembers,
  GuildSettingsOverview,
  GuildSettingsRoles,
} from "@/components/app/guild/settings/sections";

const GuildSettings = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedPage, setSeletedPage] = useState(0);

  /**
   * Page Selections
   * 0 - Overview
   * 1 - Roles
   * 2 - Co Owners
   * 3 - Invites
   * 4 - Bans
   * 5 - Members
   */

  const handleClose = () => {
    setSeletedPage(0);
    onClose();
  };

  return (
    <Modal
      variant={useColorModeValue("light", "dark")}
      isOpen={isOpen}
      onClose={handleClose}
      size="full"
    >
      <ModalOverlay />
      <ModalContent margin={0} rounded="none">
        <ModalCloseButton />
        <GuildSettingsSidebar
          selectedPage={selectedPage}
          setSelectedPage={setSeletedPage}
        >
          {selectedPage === 0 && <GuildSettingsOverview />}
          {selectedPage === 1 && <GuildSettingsRoles />}
          {selectedPage === 2 && <GuildSettingsCoOwners />}
          {selectedPage === 3 && <GuildSettingsInvites />}
          {selectedPage === 4 && <GuildSettingsBans />}
          {selectedPage === 5 && <GuildSettingsMembers />}
        </GuildSettingsSidebar>
      </ModalContent>
    </Modal>
  );
};

export default GuildSettings;
