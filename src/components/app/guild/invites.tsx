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
import { useEffect, useState } from "react";
// import { useClientStore } from "@/utils/stores.ts";
import getGuildName from "@/utils/getGuildName.ts";
import Invite from "$/Client/Structures/Guild/Invite.ts";
import { useChannelStore, useGuildStore } from "$/utils/Stores.ts";

const GuildInvites = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  const { getCurrentChannel } = useChannelStore();
  const currentChannel = getCurrentChannel();
  const { getCurrentGuild } = useGuildStore();
  const currentGuild = getCurrentGuild();
  const [,] = useState<Invite[]>([]);
  const [invite, setInvite] = useState<
    {
      guildId: string;
      code: string;
    }[]
  >([]);
  const [expire] = useState<number>(1000 * 60 * 60 * 24 * 7); // 7 days

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
      if (!currentGuild) return;
      if (!currentChannel) return;

      const foundInvite = invite.find((i) => i.guildId === currentGuild.id);

      if (foundInvite) {
        setValue(foundInvite.code);

        return;
      }

      const createdInvite = await currentGuild.createInvite({
        channelId: currentChannel.id,
        maxUses: 100,
      });

      if (createdInvite.success) {
        const inv = `${document.location.protocol}//${document.location.hostname}/invite/${createdInvite.data?.code}`;

        setValue(inv);
        setInvite((inv) => [
          ...inv,
          { guildId: currentGuild.id, code: createdInvite.data?.code ?? "" },
        ]);
      } else {
        setValue("Error creating invite");
      }
    };

    getInvite();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Invite friends to {getGuildName(currentGuild?.name ?? "Loading")}
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
              Your invite link expires in {getExpiresAt(expire)}. Edit invite
              link.
            </FormHelperText>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GuildInvites;
