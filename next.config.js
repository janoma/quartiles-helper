/** @type {import("next").NextConfig} */
const config = {
  eslint: {
    dirs: ["app", "components", "lib"],
  },
  experimental: {
    turbo: {},
  },
  output: "standalone",
  outputFileTracingIncludes: {
    /**
     * This will copy the en-wordnet directory to the standalone directory,
     * provided that output: "standalone" is set.
     * This is necessary because en-wordnet is not imported by any file,
     * just read dynamically in runtime. Without this, the dictionary lookup
     * works locally but not in the production server.
     */
    "*": ["en-wordnet/**/*"],
  },
};

export default config;
