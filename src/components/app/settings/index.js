import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import Settings_Sidebar from "@/components/app/settings/sidebar";
import { useState } from "react";
import {
  Settings_Profile,
  Settings_Accessibility,
  Settings_Appearance, Settings_History,
  Settings_Privacy,
  Settings_Sessions, Settings_Shards, Settings_Subscriptions, Settings_Text
} from "@/components/app/settings/sections";

export default function Settings({ userInfo, isOpen, onClose }) {
  let [selectedPage, setSeletedPage] = useState(0);

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
    <Modal variant={"dark"} isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent margin={0} rounded="none">
        <ModalCloseButton />
        <Settings_Sidebar
          selectedPage={selectedPage}
          setSelectedPage={setSeletedPage}
        >
          {selectedPage === 0 && <Settings_Profile userInfo={userInfo} />}
          {selectedPage === 1 && <Settings_Privacy userInfo={userInfo} />}
          {selectedPage === 2 && <Settings_Sessions userInfo={userInfo} />}
          {selectedPage === 3 && <Settings_Appearance userInfo={userInfo} />}
          {selectedPage === 4 && <Settings_Accessibility userInfo={userInfo} />}
          {selectedPage === 5 && <Settings_Text userInfo={userInfo} />}
          {selectedPage === 6 && <Settings_Subscriptions userInfo={userInfo} />}
          {selectedPage === 7 && <Settings_Shards userInfo={userInfo} />}
          {selectedPage === 8 && <Settings_History userInfo={userInfo} />}
        </Settings_Sidebar>
      </ModalContent>
    </Modal>
  );
}
