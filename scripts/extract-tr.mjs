import fs from 'fs';

const files = ['src/game.js', 'src/enemies.js', 'index.html'];
const tr = /[ğüşıöçĞÜŞİÖÇ]/;
const strRe = /(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
const set = new Map();

for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split(/\n/);
  lines.forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('*')) return;
    if (!tr.test(line)) return;
    let m;
    const re = /(['"`])((?:\\.|(?!\1).)*?)\1/g;
    while ((m = re.exec(line))) {
      const s = m[2];
      if (!tr.test(s)) continue;
      if (s.length > 180) continue;
      const key = s;
      if (!set.has(key)) set.set(key, []);
      const arr = set.get(key);
      if (arr.length < 3) arr.push(`${f}:${i + 1}`);
    }
  });
}

const items = [...set.entries()].sort((a, b) => a[0].localeCompare(b[0], 'tr'));
console.log('unique', items.length);
fs.writeFileSync('scripts/tr-strings.json', JSON.stringify(items.map(([s, loc]) => ({ s, loc })), null, 2));
console.log('wrote scripts/tr-strings.json');
