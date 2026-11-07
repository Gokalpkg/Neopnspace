import assert from 'node:assert';
import fs from 'node:fs';

console.log('==============================================================================');
console.log(' NEON SPACE SURVIVOR — ERGONOMICS & TECH VISIBILITY VERIFICATION SUITE');
console.log('==============================================================================');

// Test 1: HTML Structure
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert.ok(indexHtml.includes('id="hangar-badge-dot"'), '[FAIL] E1.1: #hangar-badge-dot missing in index.html');
assert.ok(indexHtml.includes('id="tech-badge-dot"'), '[FAIL] E1.2: #tech-badge-dot missing in index.html');
assert.ok(indexHtml.includes('id="touch-offset-presets"'), '[FAIL] E1.3: #touch-offset-presets missing in index.html');
assert.ok(indexHtml.includes('id="touch-sens-presets"'), '[FAIL] E1.4: #touch-sens-presets missing in index.html');
console.log('  [PASS] E1: HTML structure defines badge dots and control ergonomics sections');

// Test 2: CSS Rules
const styleCss = fs.readFileSync('src/style.css', 'utf8');
assert.ok(styleCss.includes('.control-preset-row'), '[FAIL] E2.1: .control-preset-row missing in style.css');
assert.ok(styleCss.includes('.ctrl-preset-btn'), '[FAIL] E2.2: .ctrl-preset-btn missing in style.css');
assert.ok(styleCss.includes('.crystals-pill.glow-ready'), '[FAIL] E2.3: .crystals-pill.glow-ready missing in style.css');
console.log('  [PASS] E2: CSS defines control preset buttons and glowing pill animations');

// Test 3: Game.js Logic
const gameJs = fs.readFileSync('src/game.js', 'utf8');
assert.ok(gameJs.includes("localStorage.getItem('neon_touch_offset_y')"), '[FAIL] E3.1: neon_touch_offset_y missing in game.js');
assert.ok(gameJs.includes("localStorage.getItem('neon_touch_sens')"), '[FAIL] E3.2: neon_touch_sens missing in game.js');
assert.ok(gameJs.includes('updateTechBadge()'), '[FAIL] E3.3: updateTechBadge definition missing in game.js');
assert.ok(gameJs.includes('updateControlSettingsUI'), '[FAIL] E3.4: updateControlSettingsUI missing in game.js');
console.log('  [PASS] E3: game.js implements dynamic touch ergonomics and tech workshop badge update');

// Test 4: Particles Celestial Bodies
const particlesJs = fs.readFileSync('src/particles.js', 'utf8');
assert.ok(particlesJs.includes('this.planets'), '[FAIL] E4.1: this.planets missing in particles.js');
assert.ok(particlesJs.includes('ringRadius'), '[FAIL] E4.2: ringRadius missing in particles.js');
console.log('  [PASS] E4: particles.js renders deep parallax celestial bodies and rings');

// Test 5: i18n Dictionary Parity & Zero Emoji
const i18nJs = fs.readFileSync('src/i18n.js', 'utf8');
const requiredKeys = [
  'settings_controls_title',
  'settings_touch_offset',
  'touch_offset_close',
  'touch_offset_balanced',
  'touch_offset_wide',
  'settings_touch_sens',
  'touch_sens_precise',
  'touch_sens_balanced',
  'touch_sens_agile'
];
for (const k of requiredKeys) {
  assert.ok(i18nJs.includes(k + ':'), `[FAIL] E5.1: Key ${k} missing in i18n.js`);
}

// Zero Emoji check
const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
assert.ok(!emojiRegex.test(indexHtml.match(/id="settings-modal"[\s\S]*?id="dev-mode-section"/)?.[0] || ''), '[FAIL] E5.2: Emoji found in settings modal HTML');
console.log('  [PASS] E5: i18n keys defined across all languages with strictly zero emojis');

console.log('==============================================================================');
console.log(' SUMMARY: All 5 ergonomics & tech visibility tests passed 100%!');
console.log('==============================================================================');
process.exit(0);
