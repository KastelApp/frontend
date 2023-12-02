import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import Settings_Sidebar from "@/components/app/settings/sidebar";
import { useState } from "react";
import Settings_Profile from "@/components/app/settings/sections/profile";
import Settings_Privacy from "@/components/app/settings/sections/privacy";
import Settings_Sessions from "@/components/app/settings/sections/sessions";
import Settings_Appearance from "@/components/app/settings/sections/appearance";
import Settings_Accessibility from "@/components/app/settings/sections/accessibility";
import Settings_Text from "@/components/app/settings/sections/text";
import Settings_Subscriptions from "@/components/app/settings/sections/subscriptions";
import Settings_Shards from "@/components/app/settings/sections/shards";
import Settings_History from "@/components/app/settings/sections/history";
import Settings_Invoices from "@/components/app/settings/sections/invoices";

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
   * 9 - Invoices
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
          {selectedPage === 9 && <Settings_Invoices userInfo={userInfo} />}
        </Settings_Sidebar>
      </ModalContent>
    </Modal>
  );
}
