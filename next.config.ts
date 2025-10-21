import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: false,
  devIndicators: false,
    env:{
        CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY,
        CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN,
        CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT,
        CONTENTSTACK_PREVIEW_TOKEN: process.env.CONTENTSTACK_PREVIEW_TOKEN,
        CONTENTSTACK_REGION: process.env.CONTENTSTACK_REGION,
        CONTENTSTACK_PERSONALIZATION: process.env.CONTENTSTACK_PERSONALIZATION,
        CONTENTSTACK_BRANCH: process.env.CONTENTSTACK_BRANCH,
        RED_PANDA_COMMERCE_ID: process.env.RED_PANDA_COMMERCE_ID,
        LYTICS_TAG: process.env.LYTICS_TAG,
        LIVE_PREVIEW_ENABLED: process.env.LIVE_PREVIEW_ENABLED,
        HOSTING: process.env.HOSTING,
    }
};

export default withNextIntl(nextConfig);
