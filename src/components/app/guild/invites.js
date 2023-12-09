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
import { useEffect } from "react";

export default function GuildInvites({ isOpen, onClose }) {
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  const [guild] = useRecoilState(currentGuild);
  const [channel] = useRecoilState(currentChannel);

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
        let invite = await channel.createInvite({});
        if (invite.success) {
          setValue(`https://kastelapp.com/invite/${invite.code}`);
        }
      }
    }
    getInvite();
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
