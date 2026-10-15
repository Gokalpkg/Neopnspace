import fs from 'fs';
const files = ['src/game.js', 'src/i18n.js', 'src/enemies.js', 'index.html'];
const re = /\p{Extended_Pictographic}/gu;
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const hits = [];
  for (const line of text.split(/\n/)) {
    if (re.test(line)) hits.push(line.trim().slice(0, 140));
    re.lastIndex = 0;
  }
  console.log(f, hits.length);
  hits.slice(0, 30).forEach(h => console.log(' ', h));
}
