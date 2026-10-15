import fs from 'fs';

const files = ['src/game.js', 'src/enemies.js', 'src/particles.js', 'src/audio.js', 'index.html'];
const tr = /[ğüşıöçĞÜŞİÖÇ]/;

for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split(/\n/);
  let n = 0;
  const samples = [];
  lines.forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return;
    if (!tr.test(line)) return;
    if (!/['"`]/.test(line)) return;
    n++;
    if (samples.length < 12) samples.push(`${i + 1}: ${t.slice(0, 160)}`);
  });
  console.log(`\n${f}  lines=${n}`);
  samples.forEach((x) => console.log(' ', x));
}
