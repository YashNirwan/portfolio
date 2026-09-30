import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* A closed spine on the catalogue morphs into the open project page.
     Needs React canary, which this project is now on. */
  experimental: { viewTransition: true },

  images: {
    /* No `remotePatterns`. It listed picsum and placehold.co for the
       placeholder artwork; every slot is now a local plate in public/art, so
       the site loads no image from a third party at all. Anything added back
       here is a host the page will fetch from — and one more thing that has to
       be reachable for the page to render.

       Nothing needs `dangerouslyAllowSVG` either: Next 16 applies
       `unoptimized` automatically when `src` ends in .svg, which is what these
       want anyway. A vector plate resizes losslessly and has nothing to
       optimise. */

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
