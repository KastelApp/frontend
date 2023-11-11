import {NextSeo} from 'next-seo'
import React from 'react'
import siteConfig from '../next-seo.config'

const SEO = ({title, description}) => (
    <NextSeo
        title={title}
        description={description}
        openGraph={{title, description}}
        titleTemplate={siteConfig.titleTemplate}
    />
)

export default SEO