/* eslint-disable @typescript-eslint/no-unsafe-call */
import { withVercelToolbar } from "@vercel/toolbar/plugins/next";
import CopyWebpackPlugin from "copy-webpack-plugin";

/** @type {import("next").NextConfig} */
const config = withVercelToolbar()({
  experimental: {
    turbo: {},
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: "en-wordnet/",
              to: "en-wordnet/",
            },
          ],
        }),
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
});

export default config;
