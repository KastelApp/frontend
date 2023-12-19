import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  SettingsAccessibility,
  SettingsAppearance,
  SettingsHistory,
  SettingsPrivacy,
  SettingsProfile,
  SettingsSessions,
  SettingsShards,
  SettingsSubscriptions,
  SettingsText
} from "@/components/app/settings/sections";
import SettingsSidebar from "./sidebar.tsx";

const Settings = ({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedPage, setSeletedPage] = useState(0);

  /**
   * Page Selections
   * 0 - Profile
   * 1 - Privacy & Safety
   * 2 - Sessions
   * 3 - Appearance
   * 4 - Accessibility
   * 5 - Text & Language
   * 6 - Subscriptions
   * 7 - Shards
   * 8 - Details & History
   */

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
        <SettingsSidebar
          selectedPage={selectedPage}
          setSelectedPage={setSeletedPage}
        >
          {selectedPage === 0 && <SettingsProfile />}
          {selectedPage === 1 && <SettingsPrivacy />}
          {selectedPage === 2 && <SettingsSessions />}
          {selectedPage === 3 && <SettingsAppearance />}
          {selectedPage === 4 && <SettingsAccessibility />}
          {selectedPage === 5 && <SettingsText />}
          {selectedPage === 6 && <SettingsSubscriptions />}
          {selectedPage === 7 && <SettingsShards />}
          {selectedPage === 8 && <SettingsHistory />}
        </SettingsSidebar>
      </ModalContent>
    </Modal>
  );
}

export default Settings;