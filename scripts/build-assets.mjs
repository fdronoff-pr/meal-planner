import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/data', { recursive: true });
await mkdir('dist/assets', { recursive: true });

await Promise.all([
  cp('portion.html', 'dist/index.html'),
  cp('app.js', 'dist/app.js'),
  cp('styles.css', 'dist/styles.css'),
  cp('data/ingredients-clean.js', 'dist/data/ingredients-clean.js'),
  cp('assets/profile-icons.webp', 'dist/assets/profile-icons.webp')
]);
