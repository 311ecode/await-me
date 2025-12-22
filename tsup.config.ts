import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'index': 'src/index.ts'
  },
  // Added 'iife' for direct <script> tag support in browsers
  format: ['cjs', 'esm', 'iife'], 
  globalName: 'WaitForMeJS',
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  // Lowered target to ES2015 for maximum compatibility
  target: 'es2015',
  minify: true,
  bundle: true,
  noExternal: ['await-me-ts'], 
  skipNodeModulesBundle: false, 
});
