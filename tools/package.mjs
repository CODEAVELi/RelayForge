import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'release');
fs.mkdirSync(outDir, { recursive: true });

execSync('node tools/build.mjs chrome', { stdio: 'inherit' });
execSync('node tools/build.mjs firefox', { stdio: 'inherit' });

zip('chrome');
zip('firefox');

console.log('Release artifacts in', outDir);

function zip(target) {
  const src = path.join(root, 'dist', target);
  const out = path.join(outDir, `RelayForge-${target}.zip`);
  try { fs.unlinkSync(out); } catch {}
  execSync(`cd "${src}" && zip -r "${out}" .`, { stdio: 'inherit' });
}
