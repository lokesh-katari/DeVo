/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: true,
    webpack: (config, { dev }) => {
      if (dev) {
        Object.defineProperty(config, 'devtool', {
          get() {
              return "cheap-source-map";
          },
          set() {},
      });
      }
      return config;
    },
    compiler:{
        removeConsole:false
    }
  };
  
  module.exports = nextConfig;