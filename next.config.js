import { withVercelToolbar } from "@vercel/toolbar/plugins/next";

/** @type {import("next").NextConfig} */
const config = withVercelToolbar()({
  experimental: {
    turbo: {},
  },
  output: "standalone",
  outputFileTracingIncludes: {
    "*": ["en-wordnet/**/*"],
  },
});

export default config;
