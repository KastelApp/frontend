import { NextSeo, NextSeoProps } from "next-seo";
import React, { FC } from "react";
import siteConfig from "../../next-seo.config";

interface SEOProps {
    title: string;
    description: string;
}

const SEO: FC<SEOProps> = ({ title, description }) => (
    <NextSeo
        title={title}
        description={description}
        openGraph={{ title, description }}
        titleTemplate={siteConfig.titleTemplate}
    />
);

export default SEO;
