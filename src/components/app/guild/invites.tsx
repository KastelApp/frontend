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
import { Invite } from "@kastelll/wrapper";

const GuildInvites = ({ isOpen, onClose }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  const [guild] = useRecoilState(currentGuild);
  const [channel] = useRecoilState(currentChannel);
  const [, setInvites] = useState<Invite[]>([]);
  const [invite, setInvite] = useState<string>("");
  const [expire] = useState<number>(1000 * 60 * 60 * 24 * 7); // 7 days

  const getGuildName = (name: string) => {
    if (name.length > 10) {
      return name.slice(0, 10);
    } else {
      return name;
    }
  };

  const getExpiresAt = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days >= 1) {
      return `${days} ${days === 1 ? "day" : "days"}`;
    }

    if (hours >= 1) {
      return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    }

    if (minutes >= 1) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
    }

    return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  };

  useEffect(() => {
    if (!isOpen) return;

    const getInvite = async () => {
      if (!guild) return;
      if (!channel) return;

      if (invite) {
        setValue(invite);

        return;
      }

      const fetchedInvites = await guild.fetchMyInvites();

      setInvites(fetchedInvites);

      const createdInvite = await channel.createInvite({
        expiresAt: new Date(Date.now() + expire), // 7 days
        maxUses: 0, // unlimited
      });

      if (createdInvite.success) {
        const inv = `${document.location.protocol}//${document.location.hostname}/invite/${createdInvite.code}`;

        setValue(inv);
        setInvite(inv); // darkerink: we set the invite so we don't keep creating em.
      } else {
        setValue("Error creating invite");
      }

    };

    getInvite();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"sm"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Invite friends to {getGuildName(guild?.name)}
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
              Your invite link expires in {getExpiresAt(expire)}. Edit invite link.
            </FormHelperText>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GuildInvites;