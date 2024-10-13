// eslint-disable-next-line @typescript-eslint/no-var-requires
const JavaScriptObfuscator = require("webpack-obfuscator");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
  },
  reactStrictMode: true,
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.plugins.push(
        new JavaScriptObfuscator(
          {
            compact: true,
            identifierNamesGenerator: "hexadecimal",
            numbersToExpressions: false,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: false,
            stringArray: true,
            stringArrayCallsTransform: false,
            stringArrayEncoding: [],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 1,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 2,
            stringArrayWrappersType: "variable",
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false,
          },
          []
        )
      );
    }
    return config;
  },
};

module.exports = nextConfig;
