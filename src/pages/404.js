import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import SEO from "@/components/seo";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

function NotFoundPage() {
  const { t } = useTranslation("common");

  return (
    <>
      <SEO title={t("notfound.title")} />

      <VStack
        justify="center"
        spacing="4"
        as="section"
        mt={["20", null, "40"]}
        textAlign="center"
      >
        <Heading>{t("notfound.title")}</Heading>
        <Text fontSize={{ md: "xl" }}>{t("notfound.message")}</Text>
        <NextLink href="/" passHref>
          <Button
            aria-label="Back to Home"
            bgGradient="linear(to-r, red.400,pink.400)"
            _hover={{
              bgGradient: "linear(to-r, red.400,pink.400)",
              boxShadow: "xl",
            }}
            size="lg"
          >
            {t("notfound.home")}
          </Button>
        </NextLink>
      </VStack>
    </>
  );
}

export default NotFoundPage;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});
