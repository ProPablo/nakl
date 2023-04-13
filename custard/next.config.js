const { config } = require('process')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // BEFORE PUSHING TO PROD, TURN BACK ON FOR TESTING
  // reactStrictMode: true,
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  webpack: (config, options) => {
    config.optimization.minimize = false;
    // config.optimization.minify = false
    return config;
  }
}

module.exports = nextConfig
