import { cp, mkdir, rm } from 'node:fs/promises';
import { build } from 'esbuild';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/data', { recursive: true });
await mkdir('dist/assets', { recursive: true });
await mkdir('dist/vendor', { recursive: true });

await Promise.all([
  cp('portion.html', 'dist/index.html'),
  cp('app.js', 'dist/app.js'),
  cp('styles.css', 'dist/styles.css'),
  cp('data/ingredients-clean.js', 'dist/data/ingredients-clean.js'),
  cp('assets/profile-icons.webp', 'dist/assets/profile-icons.webp'),
  cp('assets/mealpath-logo.png', 'dist/assets/mealpath-logo.png')
]);

await build({
  entryPoints: ['scanner-entry.js'],
  outfile: 'dist/vendor/barcode-scanner.js',
  bundle: true,
  format: 'iife',
  globalName: 'PortionBarcode',
  minify: true,
  target: ['es2020']
});
