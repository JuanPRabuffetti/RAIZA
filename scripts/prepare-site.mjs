import { cp, mkdir, rm } from 'node:fs/promises';
import { build } from 'esbuild';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const path of ['index.html', 'product.html', 'admin.html', 'css', 'js', 'pictures', 'fonts']) {
    await cp(path, `dist/${path}`, { recursive: true });
}
await build({
    entryPoints: ['js/admin.js'],
    outfile: 'dist/js/admin.js',
    bundle: true,
    platform: 'browser',
    format: 'esm',
    target: ['es2022'],
    minify: true,
});
