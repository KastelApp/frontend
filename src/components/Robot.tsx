import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex,
  Heading,
} from "@chakra-ui/react";
import Turnstile from "react-turnstile";

const Robot = ({
  isOpen,
  onClose,
  onVerify,
}: {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (r: string) => void;
}) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Are you a robot?</ModalHeader>
        <ModalBody>
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height="100%"
          >
            <Heading size="lg">Beep Boop Boop?</Heading>
            <br />
            <Turnstile
              sitekey={
                process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? ""
              }
              onVerify={onVerify}
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Robot;
