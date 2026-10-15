import fs from 'fs';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
if (blocks.length !== 1) {
  console.error('expected 1 inline script, got', blocks.length);
  process.exit(1);
}
const out = fileURLToPath(new URL('./_inline_check.js', import.meta.url));
fs.writeFileSync(out, blocks[0][1]);
const check = spawnSync(process.execPath, ['--check', out], { shell: false });
fs.unlinkSync(out);
if (check.status !== 0) {
  process.stderr.write(check.stderr);
  process.exit(check.status || 1);
}
console.log('inline script ok', blocks[0][1].length);
