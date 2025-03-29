import * as esbuild from "esbuild"

await esbuild.build ({
  platform: "node",
  bundle: true,
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  outExtension: {
    ".js": ".cjs",
  },
})
