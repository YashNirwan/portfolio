import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* AVIF is opt-in — the default is webp only. Measured on foreman.jpg at
       w=1920: 71,496 B as JPEG, 51,470 B as WebP. AVIF lands roughly 20%
       under WebP again, which matters once images run full-bleed. */
    formats: ["image/avif", "image/webp"],

    /* The source images top out at 1600px wide, so the default 2048 and 3840
       candidates return the identical bytes as 1920 — Next never upscales.
       Advertising them just bloats every srcset with duplicates. Raise this
       list again once there are genuinely larger sources to serve. */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],

    /* Nothing in public/ will ever change without its filename changing. */
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
