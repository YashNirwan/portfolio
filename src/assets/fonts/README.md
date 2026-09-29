# Drop licensed font files here

The reference site loads exactly three retail faces. Verified live from
`document.fonts` on niccolomiranda.com:

    Domaine Display   500   Klim Type Foundry
    Editorial New     300   Pangram Pangram
    Canopee           400   licensed display face

None has a free release. The site currently uses the closest free
approximations — Gloock for display and Newsreader for text — which read
like the reference rather than as it.

## To use the real faces

1. Buy a web licence and download the woff2 files.
2. Put them here, named:

       EditorialNew-Light.woff2      (text, weight 300)
       DomaineDisplayCond-Medium.woff2  (headings, weight 500)
       Canopee.woff2                 (banners, weight 400)

3. In `src/app/layout.tsx`, replace the `next/font/google` imports with
   `next/font/local`:

   ```ts
   import localFont from "next/font/local";

   const body = localFont({
     src: "../assets/fonts/EditorialNew-Light.woff2",
     variable: "--font-newsreader",   // keep the same var name
     weight: "300",
     display: "swap",
   });

   const display = localFont({
     src: "../assets/fonts/DomaineDisplayCond-Medium.woff2",
     variable: "--font-gloock",       // keep the same var name
     weight: "500",
     display: "optional",
   });
   ```

   Keeping the CSS variable names means nothing else has to change —
   `globals.css` already points `--font-display`, `--font-mid` and
   `--font-body` at them.

4. Canopee is caps-only on the reference, with Domaine filling in
   lowercase. If you load it, set it as the first family in
   `--font-display` and leave Domaine after it as the fallback:

       --font-display: "Canopee", "Domaine Display", serif;

## What not to do

The reference serves these files from a public CDN and they can be
downloaded in one command. Don't. Unlicensed retail fonts on a site that
carries your name and goes to hiring managers is a real exposure.
