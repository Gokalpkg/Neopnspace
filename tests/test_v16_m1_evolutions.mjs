// ==============================================================================
// NEON SPACE SURVIVOR v1.6.0 — MILESTONE 1 (R1) AUTOMATED TEST SUITE
// Weapon Evolutions Recipe Harmonization, 1.5s Slow-Motion Freeze,
// Radiant Holographic Showcase Card, 360° EMP Shockwave & 8s Elemental Aura,
// HUD Weapons Strip & Pause Badging, 9-Language Localization.
// ==============================================================================

import assert from 'node:assert/strict';
import { getGame, resetLocalStorage, i18nModule, catalogModule } from './harness.js';

const { TRANSLATIONS, t, SUPPORTED_LANGUAGES } = i18nModule;

console.log('='.repeat(80));
console.log('NEON SPACE SURVIVOR v1.6.0 — MILESTONE 1 (R1) COMPREHENSIVE TEST SUITE');
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

const game = getGame();

// ==============================================================================
// SUITE 1: 10 WEAPON EVOLUTIONS RECIPE HARMONIZATION
// ==============================================================================
console.log('\n>>> SUITE 1: 10 Weapon Evolutions Recipe Harmonization');

runTest('Recipes', '1.1: Canonical getEvolutionRecipes returns exactly 10 distinct recipes', () => {
  assert.ok(typeof game.getEvolutionRecipes === 'function', 'game.getEvolutionRecipes must be a function');
  const recipes = game.getEvolutionRecipes();
  assert.equal(recipes.length, 10, 'Must contain exactly 10 evolution recipes');

  const expectedIds = [
    'vortex', 'cluster', 'ion_storm', 'bastion', 'cryo',
    'saws', 'supernova', 'matrix', 'hyper_plasma', 'void_drones'
  ];

  const actualIds = recipes.map(r => r.id);
  for (const expId of expectedIds) {
    assert.ok(actualIds.includes(expId), `Recipe ID ${expId} must be in getEvolutionRecipes`);
  }
});

runTest('Recipes', '1.2: Each recipe has valid structure, colors, and upgrade requirements', () => {
  const recipes = game.getEvolutionRecipes();
  for (const r of recipes) {
    assert.ok(r.id, `Recipe must have id: ${JSON.stringify(r)}`);
    assert.ok(r.item1, `Recipe ${r.id} must have item1`);
    assert.ok(r.item2, `Recipe ${r.id} must have item2`);
    assert.ok(r.item1Lvl >= 1, `Recipe ${r.id} item1Lvl must be >= 1`);
    assert.ok(r.item2Lvl >= 1, `Recipe ${r.id} item2Lvl must be >= 1`);
    assert.ok(r.color && r.color.startsWith('#'), `Recipe ${r.id} must have hex color`);
  }
});

runTest('Recipes', '1.3: Supernova combines missiles (Lv 4) and tesla (Lv 3) with color #ff3d00', () => {
  const recipes = game.getEvolutionRecipes();
  const supernova = recipes.find(r => r.id === 'supernova');
  assert.ok(supernova, 'Supernova recipe must exist');
  assert.equal(supernova.item1, 'missiles', 'Supernova item1 must be missiles');
  assert.equal(supernova.item1Lvl, 4, 'Supernova item1Lvl must be 4');
  assert.equal(supernova.item2, 'tesla', 'Supernova item2 must be tesla');
  assert.equal(supernova.item2Lvl, 3, 'Supernova item2Lvl must be 3');
  assert.equal(supernova.color.toLowerCase(), '#ff3d00', 'Supernova color must be #ff3d00');
});

runTest('Recipes', '1.4: Discovered evolution recording persists in localStorage', () => {
  resetLocalStorage();
  assert.equal(game.getDiscoveredEvolutions().length, 0, 'Initial discovered evolutions should be empty');
  game.recordDiscoveredEvolution('supernova');
  const discovered = game.getDiscoveredEvolutions();
  assert.ok(discovered.includes('supernova'), 'supernova must be recorded');
});

// ==============================================================================
// SUITE 2: 1.5s SLOW-MOTION FREEZE
// ==============================================================================
console.log('\n>>> SUITE 2: 1.5s Slow-Motion Freeze');

runTest('SlowMo', '2.1: triggerEvolutionSurge activates 90-frame slow-mo timer at factor 0.08', () => {
  game.slowMoTimer = 0;
  game.slowMoFactor = 1.0;
  game.triggerEvolutionSurge('evo_supernova', '#ff3d00');
  assert.equal(game.slowMoTimer, 90, 'slowMoTimer must be set to 90 frames (1.5s at 60 FPS)');
  assert.equal(game.slowMoFactor, 0.08, 'slowMoFactor must be set to 0.08 (92% time dilation)');
});

runTest('SlowMo', '2.2: loop() decrements slowMoTimer frame by frame', () => {
  game.slowMoTimer = 90;
  game.lastTime = performance.now();
  game.loop(performance.now() + 16.67);
  assert.equal(game.slowMoTimer, 89, 'loop() must decrement slowMoTimer by 1');
});

// ==============================================================================
// SUITE 3: RADIANT HOLOGRAPHIC SHOWCASE CARD OVERLAY
// ==============================================================================
console.log('\n>>> SUITE 3: Radiant Holographic Showcase Card Overlay');

runTest('Showcase', '3.1: showEvolutionShowcase displays modal and establishes 260ms input lock', () => {
  game.showcaseModalActive = false;
  game.modalInputLockUntil = 0;
  game.showEvolutionShowcase('supernova', '#ff3d00');
  assert.equal(game.showcaseModalActive, true, 'showcaseModalActive must be true');
  assert.ok(game.modalInputLockUntil > performance.now() + 200, 'modalInputLockUntil must be set to performance.now() + 260ms');
});

runTest('Showcase', '3.2: Double-tap prevention suppresses dismissal before lock expiration', () => {
  game.showcaseModalActive = true;
  game.modalInputLockUntil = performance.now() + 10000; // future lock
  game.dismissEvolutionShowcase();
  assert.equal(game.showcaseModalActive, true, 'Modal must remain active when input is locked');
});

runTest('Showcase', '3.3: Dismissing after input lock clears modal active state', () => {
  game.showcaseModalActive = true;
  game.modalInputLockUntil = performance.now() - 50; // lock expired
  game.dismissEvolutionShowcase();
  assert.equal(game.showcaseModalActive, false, 'Modal active state must be cleared after lock expires');
});

// ==============================================================================
// SUITE 4: 360° SCREEN-CLEARING EMP SHOCKWAVE & 8s ELEMENTAL AURA
// ==============================================================================
console.log('\n>>> SUITE 4: 360° Screen-Clearing EMP Shockwave & 8s Elemental Aura');

runTest('EMP', '4.1: Dismissing showcase wipes 100% of enemy projectiles', () => {
  game.enemyProjectiles = [
    { x: 100, y: 100, vx: 0, vy: 1, radius: 4 },
    { x: 150, y: 200, vx: 1, vy: 1, radius: 4 },
    { x: 200, y: 300, vx: -1, vy: 0, radius: 4 }
  ];
  game._currentShowcaseEvoColor = '#ff3d00';
  game.showcaseModalActive = true;
  game.modalInputLockUntil = 0; // unlocked

  game.dismissEvolutionShowcase();
  assert.equal(game.enemyProjectiles.length, 0, 'All enemy projectiles must be cleared by EMP');
});

runTest('EMP', '4.2: Dismissing showcase grants 480 frames (8s) elemental aura to player', () => {
  game.player.elementalAuraTimer = 0;
  game._currentShowcaseEvoColor = '#00f0ff';
  game.showcaseModalActive = true;
  game.modalInputLockUntil = 0;

  game.dismissEvolutionShowcase();
  assert.equal(game.player.elementalAuraTimer, 480, 'Player elementalAuraTimer must be 480 (8.0s at 60 FPS)');
  assert.equal(game.player.elementalAuraColor, '#00f0ff', 'Player elementalAuraColor must match evolution color');
});

runTest('EMP', '4.3: Elemental aura timer ticks down cleanly during update(dt)', () => {
  game.state = 'PLAYING';
  game.hitStopTimer = 0;
  game.player.elementalAuraTimer = 480;
  game.update(1.0);
  assert.equal(game.player.elementalAuraTimer, 479, 'elementalAuraTimer must decrement by dt in PLAYING state');
  
  // Advance to end
  game.player.elementalAuraTimer = 1.0;
  game.update(1.0);
  assert.equal(game.player.elementalAuraTimer, 0, 'elementalAuraTimer must clamp at 0');
});

runTest('EMP', '4.4: Dismissing showcase stuns enemies within 460px radius', () => {
  const closeEnemy = { x: 180, y: 370, stunTimer: 0, frozen: 0, radius: 15, hp: 100 };
  const farEnemy = { x: 9999, y: 9999, stunTimer: 0, frozen: 0, radius: 15, hp: 100 };
  game.enemies = [closeEnemy, farEnemy];
  game.player.x = 180;
  game.player.y = 370;
  game.showcaseModalActive = true;
  game.modalInputLockUntil = 0;

  game.dismissEvolutionShowcase();
  assert.ok(closeEnemy.stunTimer > 0 || closeEnemy.frozen > 0, 'Close enemy must be stunned by EMP');
  assert.equal(farEnemy.stunTimer, 0, 'Far enemy beyond 460px must not be stunned');
});

// ==============================================================================
// SUITE 5: HUD WEAPONS STRIP & PAUSE MENU BADGING
// ==============================================================================
console.log('\n>>> SUITE 5: HUD Weapons Strip & Pause Menu Badging');

runTest('HUD', '5.1: updateHudWeaponsStrip populates active weapon and evolution badges', () => {
  game.player.upgrades = { missiles: 4, tesla: 3, laser: 2 };
  game.player.evolutions = { supernova: true };
  
  game.updateHudWeaponsStrip('supernova');
  const strip = document.getElementById('hud-weapons-strip');
  assert.ok(strip, '#hud-weapons-strip element must exist');
  assert.ok(strip.innerHTML.includes('hud-weapon-badge'), 'Strip must contain weapon badges');
  assert.ok(strip.innerHTML.includes('hud-evo-badge'), 'Strip must contain evolution badge');
});

runTest('HUD', '5.2: renderPauseCodex renders EVOLVED badge and sorts active evolutions', () => {
  game.player.upgrades = { missiles: 4, tesla: 3 };
  game.player.evolutions = { supernova: true };
  game.renderPauseCodex();
  const pauseGrid = document.getElementById('pause-inventory-grid');
  assert.ok(pauseGrid, '#pause-inventory-grid must exist');
  assert.ok(pauseGrid.innerHTML.includes('pause-inv-card-evolved'), 'Active evolution must have pause-inv-card-evolved');
});

// ==============================================================================
// SUITE 6: 9-LANGUAGE LOCALIZATION AUDIT FOR MILESTONE 1
// ==============================================================================
console.log('\n>>> SUITE 6: 9-Language Localization Audit for Milestone 1');

const m1Keys = [
  'badge_evolved',
  'pause_no_weapons',
  'evo_showcase_kicker',
  'evo_showcase_dismiss',
  'evo_emp_callout',
  'evo_emp_detonated',
  'codex_active',
  'codex_ready',
  'codex_locked',
  'evo_supernova_name',
  'evo_supernova_stat',
  'evo_supernova_desc'
];

runTest('Localization', '6.1: All Milestone 1 keys exist across all 9 supported languages', () => {
  const supportedLangs = ['en-GB', 'tr-TR', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];
  for (const lang of supportedLangs) {
    const dict = TRANSLATIONS[lang];
    assert.ok(dict, `Dictionary for ${lang} must exist in TRANSLATIONS`);
    for (const key of m1Keys) {
      assert.ok(dict[key] && dict[key].trim().length > 0, `Missing or empty key '${key}' in language '${lang}'`);
    }
  }
});

runTest('Localization', '6.2: 8 Non-Turkish languages have zero stray Turkish characters in M1 keys', () => {
  const nonTrLangs = ['en-GB', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];
  const turkishCharRegex = /[ıİğĞşŞ]/;
  for (const lang of nonTrLangs) {
    const dict = TRANSLATIONS[lang];
    for (const key of m1Keys) {
      const val = dict[key];
      assert.ok(!turkishCharRegex.test(val), `Language '${lang}' key '${key}' contains stray Turkish character: "${val}"`);
    }
  }
});

// ==============================================================================
// SUMMARY
// ==============================================================================
console.log('\n' + '='.repeat(80));
console.log(`TOTAL TESTS: ${totalPassed + totalFailed} | PASSED: ${totalPassed} | FAILED: ${totalFailed}`);
console.log('='.repeat(80));

if (totalFailed > 0) {
  process.exit(1);
} else {
  console.log('ALL MILESTONE 1 TESTS PASSED SUCCESSFULLY!\n');
  process.exit(0);
}
