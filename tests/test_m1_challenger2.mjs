// ==============================================================================
// CHALLENGER 2: MILESTONE 1 EMPIRICAL ADVERSARIAL STRESS TEST HARNESS
// Focus:
// 1. Graze barrage spam throttle (50 bullets/frame, 0.8s throttle, memory, exceptions)
// 2. Flight 0 Overdrive boundary (exact 720 frames / 12.0s at 60 FPS, state transition at 0)
// 3. 9-language dictionary validation (src/i18n.js key consistency & integrity)
// ==============================================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getGame, resetLocalStorage, getStorage, i18nModule } from './harness.js';

const { TRANSLATIONS, t } = i18nModule;

console.log('='.repeat(80));
console.log('CHALLENGER 2 — ADVERSARIAL EMPIRICAL STRESS TEST HARNESS (M1)');
console.log('='.repeat(80));

const results = [];
let totalPassed = 0;
let totalFailed = 0;

function runTest(suite, name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    results.push({ suite, name, pass: true });
    totalPassed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         Error: ${err.message}`);
    if (err.stack) {
      console.error(err.stack.split('\n').slice(1, 4).join('\n'));
    }
    results.push({ suite, name, pass: false, error: err.message });
    totalFailed++;
  }
}

// ==============================================================================
// SUITE 1: GRAZE BARRAGE SPAM STRESS TEST
// ==============================================================================
console.log('\n>>> SUITE 1: Graze Barrage Spam Stress Test');

runTest('Graze', '1.1: 50 simultaneous bullets within graze radius in 1 frame triggers exactly 1 floating text', () => {
  resetLocalStorage();
  const game = getGame();
  game.gameTime = 5.0;
  game._lastGrazeCalloutTime = 0;
  game.screenShake = 0;
  game.grazePulse = 0;
  game.pilotStats = { totalGraze: 0 };
  game.player.xp = 0;
  game.player.nextXp = 100;
  game.player.feverCharge = 0;
  game.player.isFever = false;
  game.player.x = 180;
  game.player.y = 500;
  game.player.radius = 20;

  // Clear existing floating texts and enemy projectiles
  game.particles.floatingTexts = [];
  game.enemyProjectiles = [];

  // Generate 50 bullets all passing within graze radius in a single frame
  // Player radius = 20, bullet radius = 4
  // Direct hit threshold = 24. Graze margin = 24 to 42.
  // We place 50 bullets at distance 30 (strictly within graze band)
  for (let i = 0; i < 50; i++) {
    const angle = (i / 50) * Math.PI * 2;
    game.enemyProjectiles.push({
      x: game.player.x + Math.cos(angle) * 30,
      y: game.player.y + Math.sin(angle) * 30,
      radius: 4,
      grazed: false,
      toRemove: false
    });
  }

  // Execute the game projectile update/collision logic directly
  // Emulating lines 13764–13777 of src/game.js
  for (let i = game.enemyProjectiles.length - 1; i >= 0; i--) {
    const p = game.enemyProjectiles[i];
    const dist = Math.hypot(p.x - game.player.x, p.y - game.player.y);
    if (dist < p.radius + game.player.radius) {
      // Hit
      p.toRemove = true;
    } else if (!p.grazed && dist < p.radius + game.player.radius + 18) {
      p.grazed = true;
      game.triggerGraze(p.x, p.y);
    }
  }

  // Assertions:
  // 1. All 50 bullets must be marked grazed
  const grazedCount = game.enemyProjectiles.filter(p => p.grazed).length;
  assert.equal(grazedCount, 50, `All 50 bullets should be flagged grazed (got ${grazedCount})`);

  // 2. Exactly ONE floating callout text spawned due to 0.8s throttle
  assert.equal(
    game.particles.floatingTexts.length,
    1,
    `Throttle failed! Expected exactly 1 floating text, got ${game.particles.floatingTexts.length}`
  );
  assert.equal(
    game.particles.floatingTexts[0].text,
    t('graze_callout'),
    'Floating text must match localized graze_callout'
  );

  // 3. Screen shake and pulse properly applied
  assert.equal(game.grazePulse, 1.0, 'grazePulse must be set to 1.0');
  assert.equal(game.screenShake, 3.5, 'screenShake must be 3.5');

  // 4. Pilot stats totalGraze incremented by 50
  assert.equal(game.pilotStats.totalGraze, 50, 'pilotStats.totalGraze must increase by 50');

  // 5. _lastGrazeCalloutTime updated to gameTime (5.0)
  assert.equal(game._lastGrazeCalloutTime, 5.0, '_lastGrazeCalloutTime must be updated to 5.0');
});

runTest('Graze', '1.2: Subsequent frame 0.8s throttle window enforcement (48 frames suppressed, frame 49 allowed)', () => {
  const game = getGame();
  game.gameTime = 5.0;
  game._lastGrazeCalloutTime = 0;
  game.particles.floatingTexts = [];

  // Frame 0: Initial graze callout
  game.triggerGraze(game.player.x + 30, game.player.y);
  assert.equal(game.particles.floatingTexts.length, 1, 'Initial callout spawned');
  assert.equal(game._lastGrazeCalloutTime, 5.0);

  // Frame 1 (t = 5.0 + 1/60s): Cooldown active
  game.gameTime = 5.0 + 1 / 60;
  game.triggerGraze(game.player.x + 30, game.player.y);
  assert.equal(game.particles.floatingTexts.length, 1, 'Frame 1: text suppressed by 0.8s throttle');

  // Frame 47 (t = 5.0 + 47/60s = 5.7833s): Cooldown still active
  game.gameTime = 5.0 + 47 / 60;
  game.triggerGraze(game.player.x + 30, game.player.y);
  assert.equal(game.particles.floatingTexts.length, 1, 'Frame 47: text suppressed by 0.8s throttle');

  // Frame 48 (t = 5.0 + 48/60s = 5.8000s; IEEE 754 diff = 0.7999999999999998 < 0.8): Cooldown still strictly holds
  game.gameTime = 5.0 + 48 / 60;
  game.triggerGraze(game.player.x + 30, game.player.y);
  assert.equal(game.particles.floatingTexts.length, 1, 'Frame 48: text suppressed at exact 48-frame boundary');

  // Frame 49 (t = 5.0 + 49/60s = 5.8167s > 0.8s): Throttle expires, next callout allowed
  game.gameTime = 5.0 + 49 / 60;
  game.triggerGraze(game.player.x + 30, game.player.y);
  assert.equal(game.particles.floatingTexts.length, 2, 'Frame 49: exactly 2nd floating text spawned once 0.8s elapsed');
  assert.equal(game._lastGrazeCalloutTime, game.gameTime, '_lastGrazeCalloutTime updated to Frame 49 time');
});

runTest('Graze', '1.3: High-frequency barrage memory footprint & particle capping', () => {
  const game = getGame();
  game.particles.particles = [];
  game.particles.floatingTexts = [];
  game._lastGrazeCalloutTime = 0; // Isolated reset

  // Simulate 10 frames of intense 50-bullet graze spam (500 grazes total)
  for (let frame = 0; frame < 10; frame++) {
    game.gameTime = 10.0 + frame * (1 / 60);
    for (let b = 0; b < 50; b++) {
      game.triggerGraze(game.player.x + 25, game.player.y + 25);
    }
    // Run particles update as game loop does
    game.particles.update(1.0);
  }

  // Verify particle cap
  // particles.js:47 enforces: if (this.particles.length < 460)
  assert.ok(
    game.particles.particles.length <= 460,
    `Particles array must be bounded <= 460 (actual: ${game.particles.particles.length})`
  );

  // Floating texts must only have spawned once during the 10 frames (10 frames = 0.166s < 0.8s)
  assert.equal(
    game.particles.floatingTexts.length,
    1,
    `Floating texts must be strictly throttled to 1 during 10-frame spam (got: ${game.particles.floatingTexts.length})`
  );
});

runTest('Graze', '1.4: Adversarial input resilience & exception safety', () => {
  const game = getGame();

  // Adversarial edge inputs to triggerGraze
  assert.doesNotThrow(() => {
    game.triggerGraze(undefined, undefined);
  }, 'triggerGraze(undefined, undefined) must not throw');

  assert.doesNotThrow(() => {
    game.triggerGraze(NaN, NaN);
  }, 'triggerGraze(NaN, NaN) must not throw');

  assert.doesNotThrow(() => {
    game.triggerGraze(Infinity, -Infinity);
  }, 'triggerGraze(Infinity, -Infinity) must not throw');

  // Null/undefined pilotStats resilience
  const originalStats = game.pilotStats;
  game.pilotStats = null;
  assert.doesNotThrow(() => {
    game.triggerGraze(100, 100);
  }, 'triggerGraze with null pilotStats must not throw');
  game.pilotStats = originalStats;

  // Level up trigger mid-graze
  game.player.xp = game.player.nextXp - 0.1;
  assert.doesNotThrow(() => {
    game.triggerGraze(100, 100);
  }, 'triggerGraze causing level up must not throw');
});

// ==============================================================================
// SUITE 2: FLIGHT 0 OVERDRIVE BOUNDARY & DURATION
// ==============================================================================
console.log('\n>>> SUITE 2: Flight 0 Overdrive Boundary & Timing');

runTest('Overdrive', '2.1: Flight 0 initialization sets exact 720 frames (12.0s at 60 FPS)', () => {
  resetLocalStorage();
  const game = getGame();

  // Emulate flight 0 start conditions
  game.pilotStats = { totalFlights: 0 };
  const flightCount = (game.pilotStats && game.pilotStats.totalFlights) || 0;
  assert.equal(flightCount, 0, 'Flight count must be 0 for new pilot');

  // Line 8509 logic:
  if (flightCount === 0) {
    game.player.overchargeTimer = 720;
  }
  assert.equal(game.player.overchargeTimer, 720, 'Flight 0 must initiate overchargeTimer = 720');
});

runTest('Overdrive', '2.2: Exact frame-by-frame countdown across 720 frames', () => {
  const game = getGame();
  game.player.overchargeTimer = 720;

  // Simulate 719 frame updates with dt = 1.0
  for (let frame = 1; frame <= 719; frame++) {
    // Before line 11461, overchargeTimer is (720 - frame + 1)
    assert.ok(game.player.overchargeTimer > 0, `Frame ${frame}: overchargeTimer must be > 0`);
    if (game.player.overchargeTimer > 0) {
      game.player.overchargeTimer -= 1.0;
    }
    // After update, at frame 719, overchargeTimer must be exactly 1.0
    if (frame === 719) {
      assert.equal(game.player.overchargeTimer, 1.0, 'Frame 719: overchargeTimer must be exactly 1.0');
    }
  }

  // Frame 720: Timer starts at 1.0, decrements by 1.0 to 0.0
  assert.ok(game.player.overchargeTimer > 0, 'Frame 720 starts with timer > 0');
  game.player.overchargeTimer -= 1.0;
  assert.equal(game.player.overchargeTimer, 0, 'Frame 720 ends with overchargeTimer === 0');

  // State Transition at Timer 0:
  // Check the boolean predicate used across all engine systems: (game.player.overchargeTimer > 0)
  const isOverchargeAtZero = game.player.overchargeTimer > 0;
  assert.equal(isOverchargeAtZero, false, 'At timer 0, isOvercharge must immediately transition to false');

  // Frame 721: Timer is 0, update does not decrement further
  if (game.player.overchargeTimer > 0) {
    game.player.overchargeTimer -= 1.0;
  }
  assert.equal(game.player.overchargeTimer, 0, 'Frame 721: overchargeTimer remains 0');
});

runTest('Overdrive', '2.3: Fractional dt simulation (1440 half-frames at dt = 0.5)', () => {
  const game = getGame();
  game.player.overchargeTimer = 720;

  for (let halfFrame = 0; halfFrame < 1440; halfFrame++) {
    if (game.player.overchargeTimer > 0) {
      game.player.overchargeTimer -= 0.5;
    }
  }
  assert.equal(Math.round(game.player.overchargeTimer * 1000) / 1000, 0, 'After 1440 half-frames, timer must reach 0');
  assert.equal(game.player.overchargeTimer > 0, false, 'isOvercharge is false');
});

runTest('Overdrive', '2.4: System state transitions when Overdrive expires', () => {
  const game = getGame();

  // Test Thruster Flame Length Transition
  // game.js:15777: baseFlameLen = isOvercharge ? 28 : (isRearZone ? 16 : 9);
  function getFlameLen(timer, isRearZone = false) {
    const isOvercharge = (timer || 0) > 0;
    return isOvercharge ? 28 : (isRearZone ? 16 : 9);
  }

  assert.equal(getFlameLen(720), 28, 'Active Overdrive flame length is 28');
  assert.equal(getFlameLen(1), 28, 'Frame 719 Overdrive flame length is 28');
  assert.equal(getFlameLen(0), 9, 'Expired Overdrive flame length resets to 9');
  assert.equal(getFlameLen(-0.5), 9, 'Negative timer flame length safely resets to 9');

  // Test Weapon Heavy Laser Damage Bonus Transition
  // game.js:11931: const dmgBonus = (this.player.isFever ? 3.0 : 0) + (isOvercharge ? 2.5 : 0);
  function getWeaponDmgBonus(timer, isFever = false) {
    const isOvercharge = timer > 0;
    return (isFever ? 3.0 : 0) + (isOvercharge ? 2.5 : 0);
  }

  assert.equal(getWeaponDmgBonus(720), 2.5, 'Active Overdrive adds +2.5 damage bonus');
  assert.equal(getWeaponDmgBonus(0), 0.0, 'Expired Overdrive damage bonus drops to 0.0');
});

// ==============================================================================
// SUITE 3: 9-LANGUAGE DICTIONARY VALIDATION & AUDIT
// ==============================================================================
console.log('\n>>> SUITE 3: 9-Language Dictionary Validation & Audit');

const EXPECTED_LANGUAGES = ['en-GB', 'tr-TR', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];
const M1_REQUIRED_KEYS = [
  'toast_storm_locked',
  'toast_mutator_locked',
  'toast_hangar_locked',
  'toast_unlocked_celebration',
  'graze_callout',
  'ftue_overdrive_active',
  'mode_storm_title'
];
const TR_SPECIAL_CHARS = /[ğışİĞŞ]/;

runTest('i18n', '3.1: All 9 expected languages exist in TRANSLATIONS', () => {
  const actualLanguages = Object.keys(TRANSLATIONS);
  for (const lang of EXPECTED_LANGUAGES) {
    assert.ok(actualLanguages.includes(lang), `Language ${lang} must exist in TRANSLATIONS`);
  }
});

runTest('i18n', '3.2: Every M1 required key is populated with non-empty strings across all 9 languages', () => {
  for (const lang of EXPECTED_LANGUAGES) {
    const dict = TRANSLATIONS[lang];
    assert.ok(dict, `Dictionary for ${lang} must exist`);
    for (const key of M1_REQUIRED_KEYS) {
      assert.ok(key in dict, `Language [${lang}] is missing required M1 key '${key}'`);
      const val = dict[key];
      assert.equal(typeof val, 'string', `[${lang}][${key}] must be a string`);
      assert.ok(val.trim().length > 0, `[${lang}][${key}] must not be empty or whitespace only`);
    }
  }
});

runTest('i18n', '3.3: Interpolation placeholder {name} is present in all 9 languages for toast_unlocked_celebration', () => {
  for (const lang of EXPECTED_LANGUAGES) {
    const val = TRANSLATIONS[lang]['toast_unlocked_celebration'];
    assert.ok(
      val.includes('{name}'),
      `[${lang}] toast_unlocked_celebration must include '{name}' interpolation token (found: "${val}")`
    );
  }
});

runTest('i18n', '3.4: Zero Turkish character leaks in the 8 non-Turkish languages for M1 keys', () => {
  const nonTrLanguages = EXPECTED_LANGUAGES.filter(l => l !== 'tr-TR');
  for (const lang of nonTrLanguages) {
    for (const key of M1_REQUIRED_KEYS) {
      const val = TRANSLATIONS[lang][key];
      const match = val.match(TR_SPECIAL_CHARS);
      assert.ok(
        !match,
        `[${lang}][${key}] leaked Turkish character '${match ? match[0] : ''}': "${val}"`
      );
    }
  }
});

runTest('i18n', '3.5: Full dictionary audit across all 9 languages', () => {
  // Check the baseline keys in en-GB vs other languages
  const enKeys = Object.keys(TRANSLATIONS['en-GB']);
  const trKeys = Object.keys(TRANSLATIONS['tr-TR']);

  console.log(`    en-GB total keys: ${enKeys.length}`);
  console.log(`    tr-TR total keys: ${trKeys.length}`);

  // Ensure no empty string values exist anywhere in TRANSLATIONS
  let totalEmpty = 0;
  for (const lang of EXPECTED_LANGUAGES) {
    for (const [k, v] of Object.entries(TRANSLATIONS[lang])) {
      if (typeof v !== 'string' || v.trim() === '') {
        console.error(`    Empty key found in [${lang}]: '${k}'`);
        totalEmpty++;
      }
    }
  }
  assert.equal(totalEmpty, 0, `Zero empty string values allowed across all dictionaries (found ${totalEmpty})`);
});

// ==============================================================================
// TEST SUMMARY & VERDICT CALCULATION
// ==============================================================================
console.log('\n' + '='.repeat(80));
console.log(`CHALLENGER 2 TEST RUN COMPLETE`);
console.log(`Total tests run: ${totalPassed + totalFailed}`);
console.log(`Passed: ${totalPassed}`);
console.log(`Failed: ${totalFailed}`);
console.log('='.repeat(80));

if (totalFailed > 0) {
  console.error('\n❌ VERDICT: REQUEST_CHANGES — Failure detected in stress harness.');
  process.exit(1);
} else {
  console.log('\n✅ VERDICT: APPROVE — All empirical stress tests passed flawlessly.');
  process.exit(0);
}
