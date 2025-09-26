import * as esbuild from 'esbuild'

await esbuild.build({
  platform: 'node',
  bundle: true,
  entryPoints: ['index.ts'],
  outdir: 'dist',
  outExtension: {
    '.js': '.cjs',
  },
})
