import fs from 'fs';
import { TRANSLATIONS } from '../src/i18n.js';

console.log('=== TEST SUITE: MILESTONE 1 (FTUE & EARLY GAME PACING) ===\n');

let failed = false;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// 1. Localization Verification
console.log('\n--- 1. Localization Key Parity (9 Languages) ---');
const expectedLanguages = ['en-GB', 'tr-TR', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];
const m1Keys = ['toast_storm_locked', 'toast_mutator_locked', 'toast_hangar_locked', 'toast_unlocked_celebration', 'graze_callout', 'ftue_overdrive_active', 'mode_storm_title'];
const trChars = /[ğışİĞŞ]/;

for (const lang of expectedLanguages) {
  assert(TRANSLATIONS[lang] != null, `Language ${lang} exists in TRANSLATIONS`);
  for (const key of m1Keys) {
    const val = TRANSLATIONS[lang] ? TRANSLATIONS[lang][key] : null;
    assert(val != null && typeof val === 'string' && val.length > 0, `[${lang}] key '${key}' exists and is non-empty ("${val}")`);
    if (lang !== 'tr-TR') {
      assert(!trChars.test(val), `[${lang}] key '${key}' does not leak Turkish characters`);
    }
    if (key === 'toast_unlocked_celebration') {
      assert(val.includes('{name}'), `[${lang}] '${key}' contains '{name}' placeholder`);
    }
  }
}

// 2. Game Engine Source Inspection
console.log('\n--- 2. Game Engine Static Verification ---');
const gameJs = fs.readFileSync('src/game.js', 'utf8');

// Default Mode
assert(
  /this\.currentMode\s*=\s*localStorage\.getItem\(['"]neon_current_mode['"]\)\s*\|\|\s*['"]classic['"]/.test(gameJs),
  "currentMode defaults to 'classic'"
);

// unlockedLevels Typo Fix
assert(
  !gameJs.includes('this.unlockedLevels'),
  "Zero occurrences of deprecated 'this.unlockedLevels' in game.js"
);
assert(
  gameJs.includes('const maxStage = this.unlockedLevel || 1;'),
  "maxStage correctly reads 'this.unlockedLevel || 1'"
);

// XP Progression Curve
assert(
  /getNextLevelXp\s*\(level\)\s*\{\s*if\s*\(level\s*===\s*1\)\s*return\s*24;\s*if\s*\(level\s*===\s*2\)\s*return\s*48;\s*if\s*\(level\s*===\s*3\)\s*return\s*96;/.test(gameJs),
  "getNextLevelXp returns 24 for lvl 1, 48 for lvl 2, 96 for lvl 3"
);

// Flight 0 Overdrive
assert(
  gameJs.includes('this.player.overchargeTimer = 720;'),
  "Flight 0 sets overchargeTimer to 720 (12s)"
);
assert(
  /sounds\.playWarpDrive\(\);[\s\S]*?vibrate\.heavy\(\);[\s\S]*?spawnFloatingText\([\s\S]*?ftue_overdrive_active/.test(gameJs),
  "Flight 0 triggers sounds.playWarpDrive(), vibrate.heavy(), and localized ftue_overdrive_active"
);

// Celebration Toast Fix
assert(
  gameJs.includes("this.showToast(t('toast_unlocked_celebration', { name: t('mode_storm_title') }), '#39ff14');"),
  "First-flight celebration toast passes { name: t('mode_storm_title') }"
);

// Graze Mechanics
assert(
  gameJs.includes('this.screenShake = Math.max(this.screenShake || 0, 3.5);'),
  "triggerGraze sets screenShake = Math.max(..., 3.5)"
);
assert(
  gameJs.includes('this.grazePulse = 1.0;'),
  "triggerGraze sets grazePulse = 1.0"
);
assert(
  !gameJs.includes('neon_graze_hint_seen'),
  "neon_graze_hint_seen suppression permanently removed"
);
assert(
  gameJs.includes("t('graze_callout')"),
  "triggerGraze uses localized t('graze_callout')"
);
assert(
  /now\s*-\s*\(this\._lastGrazeCalloutTime\s*\|\|\s*0\)\s*>=\s*0\.8/.test(gameJs),
  "triggerGraze callout is throttled at 0.8s cooldown"
);

// Graze Render & Decay
assert(
  gameJs.includes('this.grazePulse -= 2.5 * dt;'),
  "grazePulse decays smoothly in update(dt)"
);
assert(
  gameJs.includes('grad.addColorStop(1, `rgba(0, 240, 255, ${this.grazePulse * 0.35})`);'),
  "draw() renders dynamic cyan peripheral vignette when grazePulse > 0"
);

// Thruster Geometry
assert(
  gameJs.includes('baseFlameLen = isOvercharge ? 28 : (isRearZone ? 16 : 9);'),
  "baseFlameLen expands to 28 during Overdrive"
);
assert(
  gameJs.includes('leftGrad.addColorStop(0, \'#00f0ff\');') && gameJs.includes('leftGrad.addColorStop(0.5, \'#bf5af2\');'),
  "Enhanced thrusters render dual cyan/purple gradient"
);
assert(
  gameJs.includes('ctx.ellipse(-6.5, r * 0.85 + ringOffset1, 3.5, 1.5, 0, 0, Math.PI * 2);'),
  "Enhanced thrusters render shock diamond rings"
);

console.log('\n----------------------------------------');
if (failed) {
  console.error('❌ TEST SUITE FAILED');
  process.exit(1);
} else {
  console.log('✅ ALL TEST SUITE CHECKS PASSED PERFECTLY!');
  process.exit(0);
}
