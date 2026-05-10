// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Vercel runs `vite build` with VERCEL=1. The default Lovable stack adds the Cloudflare Vite
// plugin, which emits a Workers bundle (no static index.html for Vercel). Pair TanStack Start
// with Nitro on Vercel per https://vercel.com/docs/frameworks/full-stack/tanstack-start
const isVercel = process.env.VERCEL === "1";
// Load Nitro after Lovable's config module resolves (avoids Vite require-cycle on startup).
const vercelPlugins = isVercel
  ? [(await import("nitro/vite")).nitro()]
  : [];

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  cloudflare: isVercel ? false : undefined,
  plugins: vercelPlugins,
});
