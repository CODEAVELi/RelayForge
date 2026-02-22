import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const target = process.argv[2] || 'chrome';
const out = path.join(root, 'dist', target);

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

copyDir(path.join(root, 'src'), path.join(out, 'src'));
fs.copyFileSync(path.join(root, 'manifests', `${target}.json`), path.join(out, 'manifest.json'));

console.log(`Built ${target} -> ${out}`);

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}
