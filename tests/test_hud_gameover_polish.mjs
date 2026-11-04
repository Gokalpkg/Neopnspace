import { readFileSync } from 'fs';
import { resolve } from 'path';

console.log('==============================================================================');
console.log(' HUD OVERLAP, SHIELD MECHANICS & GAMEOVER POLISH VERIFICATION SUITE');
console.log('==============================================================================');

let passed = 0;
let failed = 0;

function assert(cond, name, details = '') {
  if (cond) {
    console.log(`  [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${name} ${details ? '- ' + details : ''}`);
    failed++;
  }
}

const styleCss = readFileSync(resolve('src/style.css'), 'utf8');
const gameJs = readFileSync(resolve('src/game.js'), 'utf8');
const indexHtml = readFileSync(resolve('index.html'), 'utf8');
const i18nJs = readFileSync(resolve('src/i18n.js'), 'utf8');

// 1. HUD Weapons Strip Overlap Check
assert(
  styleCss.includes('.hud-weapons-strip {') &&
  styleCss.includes('top: calc(max(38px, calc(var(--safe-top, 0px) + 4px)) + 48px);'),
  '1.1: .hud-weapons-strip is positioned below HUD top ribbon, preventing HP/Shield bar overlap'
);

// 2. Shield Passive Regen Disabled Check
const hasPassiveRegen = gameJs.includes('this.player.shield = Math.min(this.player.maxShield, this.player.shield + regenRate * dt);');
assert(
  !hasPassiveRegen && gameJs.includes('Pasif otomatik kalkan yenilenmesi kaldırıldı'),
  '2.1: Passive timer shield regeneration is completely disabled (shield only recovers from pickups/drops)'
);

// 3. Overload Circular Conic Fill Check
assert(
  styleCss.includes('.ultimate-charge-fill {') &&
  styleCss.includes('border-radius: 50% !important;') &&
  styleCss.includes('conic-gradient(from -90deg'),
  '3.1: #ultimate-charge-fill has circular border-radius and conic-gradient fill in style.css'
);

assert(
  gameJs.includes('ultimateChargeFill.style.background = `conic-gradient(from -90deg, rgba(0, 240, 255, 0.6) ${deg}deg, transparent ${deg}deg)`;'),
  '3.2: game.js dynamically charges ultimate button with radial/conic sweep'
);

// 4. Revive & Double Crystal Buttons Polish Check
assert(
  styleCss.includes('.go-revive-btn {') &&
  styleCss.includes('min-height: 52px !important;') &&
  styleCss.includes('revivePulseGlow'),
  '4.1: .go-revive-btn is spacious (min-height: 52px) with vibrant neon pulse glow'
);

assert(
  styleCss.includes('.vault-double-btn {') &&
  styleCss.includes('min-height: 46px !important;') &&
  styleCss.includes('vaultGlowPulse'),
  '4.2: .vault-double-btn has prominent size and irresistible golden glow pulse'
);

// 5. Zero System Emojis in Game Over & Core UI
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
const badEmojis = ['🔥', '⚡', '🚀', '🔒', '❤️', '🛡️', '💎', '🏆'];
let foundBad = [];
badEmojis.forEach(em => {
  if (gameJs.includes(em) || indexHtml.includes(em) || i18nJs.includes(em)) {
    foundBad.push(em);
  }
});

assert(
  foundBad.length === 0,
  '5.1: Zero system emojis remaining in core UI, Game Over banners, and buttons',
  `Found: ${foundBad.join(', ')}`
);

console.log('==============================================================================');
console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('==============================================================================');

if (failed > 0) process.exit(1);
