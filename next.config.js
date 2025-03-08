import { withVercelToolbar } from "@vercel/toolbar/plugins/next";

/** @type {import("next").NextConfig} */
const config = withVercelToolbar()({});

export default config;
