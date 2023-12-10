import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useClipboard,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { currentChannel, currentGuild } from "@/utils/stores";
import { useEffect, useState } from "react";

export default function GuildInvites({ isOpen, onClose }) {
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  const [guild] = useRecoilState(currentGuild);
  const [channel] = useRecoilState(currentChannel);
  const [, setInvites] = useState([]);
  const [invite, setInvite] = useState(null);

  function getGuildName(name) {
    if (name.length > 10) {
      return name.slice(0, 10);
    } else {
      return name;
    }
  }

  useEffect(() => {
    async function getInvite() {
      if (guild) {

        if (invite) {
          setValue(invite);

          return;
        }

        const invites = await guild.fetchMyInvites();

        setInvites(invites); // darkerink: display these invites, these are invites already made

        let createdInvite = await channel.createInvite({
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
          maxUses: 0 // unlimited
        });
        
        if (createdInvite.success) {
          const inv = `${document.location.protocol}//${document.location.hostname}/invite/${createdInvite.code}`;

          setValue(inv);
          setInvite(inv); // darkerink: we set the invite so we don't keep creating em.
        }
      }
    }
    
    if (isOpen) {
      getInvite();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"sm"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Invite friends to {getGuildName(guild?.name || "Loading...")}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl>
            <InputGroup>
              <Input
                isReadOnly={true}
                pr="4.5rem"
                type="text"
                defaultValue={value}
                placeholder="kstl.app/invite"
              />
              <InputRightElement width={hasCopied ? "5rem" : "4.5rem"}>
                <Button h="1.75rem" size="sm" onClick={onCopy}>
                  {hasCopied ? "Copied" : "Copy"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormHelperText>
              Your invite link expires in 7 days. Edit invite link.
            </FormHelperText>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
