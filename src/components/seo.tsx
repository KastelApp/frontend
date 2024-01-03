import { NextSeo } from "next-seo";
import React from "react";
import siteConfig from "../../next-seo.config.mjs";

const SEO = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <NextSeo
    title={title}
    description={description}
    openGraph={{ title, description }}
    titleTemplate={siteConfig.titleTemplate}
  />
);

export default SEO;
