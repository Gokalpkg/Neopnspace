import fs from 'fs';
import { TRANSLATIONS } from '../src/i18n.js';

const langs = Object.keys(TRANSLATIONS);
const base = Object.keys(TRANSLATIONS['en-GB']);
const trChars = /[ğışİĞŞ]/;
let failed = false;

console.log('== key parity ==');
for (const lang of langs) {
  const missing = base.filter((k) => TRANSLATIONS[lang][k] == null || TRANSLATIONS[lang][k] === '');
  const leaks = lang === 'tr-TR' ? [] : Object.entries(TRANSLATIONS[lang]).filter(([, v]) => trChars.test(String(v))).map(([k]) => k);
  if (missing.length || leaks.length) failed = true;
  console.log(`${lang}: missing ${missing.length}, turkish-char leaks ${leaks.length}`);
  if (missing.length) console.log('  missing:', missing.slice(0, 20).join(', '));
  if (leaks.length) console.log('  leaks:', leaks.slice(0, 20).join(', '));
}

const files = ['index.html', ...fs.readdirSync('src').filter((f) => f.endsWith('.js')).map((f) => `src/${f}`)];
const hits = [];
for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\n/);
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
    if (!trChars.test(line) || !/['"`]/.test(line)) return;
    hits.push(`${file}:${i + 1}: ${trimmed.slice(0, 140)}`);
  });
}

console.log('\n== hardcoded Turkish-looking strings ==');
console.log('count', hits.length);
hits.slice(0, 40).forEach((h) => console.log(h));
console.log('\nExceptions left on purpose: brand name Neon Space Survivor, currency CR, numbers, icons, code comments.');
if (hits.length) {
  console.log('Remaining hits still need i18n before the single-language check is fully clean.');
}
process.exit(failed ? 1 : 0);
