import { Profiler } from 'react';
import injectWhyDidYouRender from './scripts/why-did-you-render/index.mjs';
/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,
  images:{
    domains:['lh3.googleusercontent.com','randomuser.me','images.unsplash.com','storage.googleapis.com']
  },
  webpack: (config, context) => {
    injectWhyDidYouRender(config, context)
    return config;
  }
};

export default withNextIntl(nextConfig);
