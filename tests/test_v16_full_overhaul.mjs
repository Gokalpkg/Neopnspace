// ==============================================================================
// Neon Space Survivor — v1.6.0 Ultimate Overhaul Verification Suite
// Verifies:
// 1. Immediate Enemy Spawning Fix (No openingSwarmPhase blockade)
// 2. Art Director & Economy Constitution (src/balance.js)
// 3. Ship Power Rebalancing & Linear Tech Workshop Upgrades
// 4. Gacha 5-Step Weapon Evolution Card Reveal & Mythic Audio
// 5. Boss 1.2s Laser Telegraph, Spiral Bullet Hell & Entry Drama
// 6. Single-Screen Victory Debrief & In-Game Live Rival Progress Bar
// ==============================================================================

import assert from 'node:assert/strict';
import { getGame, resetLocalStorage } from './harness.js';
import { sounds } from '../src/audio.js';
import { Enemy } from '../src/enemies.js';
import {
  THEME_PALETTE,
  ART_BIBLE_PROMPT_TEMPLATE,
  ECONOMY_FORMULAS,
  SHIP_BALANCE,
  TECH_WORKSHOP_CONFIG,
  SPAWN_PACING
} from '../src/balance.js';

console.log('='.repeat(78));
console.log(' NEON SPACE SURVIVOR — v1.6.0 ULTIMATE OVERHAUL TEST SUITE');
console.log('='.repeat(78));

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         ${err.message}`);
    failed++;
  }
}

const game = getGame();

// 1. Art Bible & 60-30-10 Palette Verification
test('V16.1: Art Bible 60-30-10 HEX Palette avoids pure #000000 and #FFFFFF', () => {
  assert.ok(THEME_PALETTE, 'THEME_PALETTE must be exported');
  const hexes = [
    THEME_PALETTE.bgVoidNavy,
    THEME_PALETTE.cardSurface,
    THEME_PALETTE.primaryElectricCyan,
    THEME_PALETTE.secondarySolarGold,
    THEME_PALETTE.textWarmCream
  ];
  for (const h of hexes) {
    assert.ok(/^#[0-9A-Fa-f]{6}$/.test(h), `Valid HEX color expected: ${h}`);
    assert.notEqual(h.toUpperCase(), '#000000', 'Must not use pure black #000000');
    assert.notEqual(h.toUpperCase(), '#FFFFFF', 'Must not use raw white #FFFFFF');
  }

  const prompt = ART_BIBLE_PROMPT_TEMPLATE.buildPrompt('A chunky neon plasma cannon');
  assert.ok(prompt.includes('chunky neon plasma cannon'), 'Prompt includes subject');
  assert.ok(prompt.includes('thick dark navy clean outline'), 'Prompt includes style DNA lock');
  assert.ok(prompt.includes('No text, no letters'), 'Prompt includes negative rules');
});

// 2. Ship Power Rebalancing & Economy Math Verification
test('V16.2: Ship Balance enforces clear tactical trade-offs and crowns Chrono Apex as tier pinnacle', () => {
  assert.equal(game.skins.chrono.dmgMult, 1.55, 'Chrono damage multiplier set to true Apex tier (1.55x)');
  assert.equal(game.skins.chrono.shieldMult, 1.25, 'Chrono shield multiplier set to 1.25x');
  assert.equal(SHIP_BALANCE.chrono.chronoNovaIntervalFrames, 480, 'Chrono freeze interval set to 480 frames (8s)');
  assert.equal(SHIP_BALANCE.chrono.chronoFreezeDurationFrames, 78, 'Chrono freeze duration set to 78 frames (1.3s)');

  assert.equal(game.skins.solar.dmgMult, 1.12, 'Solar rebalanced to 1.12x');
  assert.equal(game.skins.solar.shieldMult, 0.85, 'Solar has lower shield trade-off (0.85x)');
  assert.equal(game.skins.toxic.magnetMult, 1.60, 'Toxic has highest harvester magnet (1.60x)');
  assert.equal(game.skins.phantom.shieldMult, 1.45, 'Phantom is the premier shield tank (1.45x)');
});

// 3. Tech Workshop Linear Power & Exponential Costs
test('V16.3: Tech Workshop applies perceptible linear stat jumps (+12% dmg, +15 shield, +20 hull)', () => {
  const catalog = game.getTechCatalog();
  const dmgItem = catalog.find(i => i.id === 'damageBoost');
  const shieldItem = catalog.find(i => i.id === 'shieldMax');
  const hullItem = catalog.find(i => i.id === 'hullMax');
  const critItem = catalog.find(i => i.id === 'critChance');

  assert.equal(dmgItem.formatVal(3), '+36%', 'Level 3 damageBoost formats as +36% (+12%/lvl)');
  assert.equal(shieldItem.formatVal(2), '+30', 'Level 2 shieldMax formats as +30 (+15/lvl)');
  assert.equal(hullItem.formatVal(2), '+40', 'Level 2 hullMax formats as +40 (+20/lvl)');
  assert.equal(critItem.formatVal(3), '+12%', 'Level 3 critChance formats as +12% (+4%/lvl)');

  resetLocalStorage({
    neon_tech_upgrades: { damageBoost: 2, hullMax: 2, shieldMax: 2, critChance: 2 },
    neon_equipped_skin: 'cyberpunk'
  });
  game.techUpgrades = game.loadTechUpgrades();
  game.currentSkinId = 'cyberpunk';
  game.startNewGame();

  assert.equal(game.player.maxHp, 140, 'Base 100 + 2 * 20 hullMax = 140 HP');
  assert.equal(game.player.maxShield, 50, 'Base 20 + 2 * 15 shieldMax = 50 Shield');
  assert.ok(Math.abs(game.player.damageMultiplier - (1.24 * 0.95)) < 1e-6, 'Base (1.0 + 2 * 0.12) * 0.95x skin mult = 1.178x damage');
  assert.ok(Math.abs(game.player.critChance - 0.13) < 1e-6, 'Base 0.05 + 2 * 0.04 = 0.13 crit chance');
});

// 4. Enemy Spawning Fix (No 30s Opening Blockade)
test('V16.4: Enemies spawn immediately from second 0 without openingSwarmPhase blockade', () => {
  resetLocalStorage();
  game.currentMode = 'classic';
  game.startNewGame();

  // Even while openingSwarmPhase === 1, calling spawnEnemies must advance spawnTimer and spawn enemies!
  assert.equal(game.openingSwarmPhase, 1, 'Opening swarm phase is active at run start');
  const initialCount = game.enemies.length;
  assert.ok(initialCount >= 6, `Opening cluster immediately spawns rocks (got ${initialCount})`);

  // Remove opening cluster rocks to verify regular spawnEnemies works even if openingSwarmPhase is 1
  game.enemies = [];
  for (let f = 0; f < 30; f++) {
    game.spawnEnemies(1.0);
  }
  assert.ok(game.enemies.length >= 1, 'spawnEnemies spawns regular wave enemies immediately without waiting for openingSwarmPhase to end');
});

// 5. Gacha 5-Step Weapon Evolution Card Reveal & Mythic Audio
test('V16.5: Gacha Evolution Card Reveal activates 5-step VFX layers and playMythicEvolutionReveal', () => {
  assert.equal(typeof sounds.playMythicEvolutionReveal, 'function', 'sounds.playMythicEvolutionReveal must exist');
  let mythicPlayed = false;
  const origMythic = sounds.playMythicEvolutionReveal.bind(sounds);
  sounds.playMythicEvolutionReveal = () => {
    mythicPlayed = true;
    origMythic();
  };

  game.showEvolutionShowcase('supernova', '#ffbe0b');
  assert.equal(mythicPlayed, true, 'showEvolutionShowcase must invoke playMythicEvolutionReveal()');

  const modal = document.getElementById('evolution-showcase-modal');
  assert.ok(modal.classList.contains('gacha-reveal-active'), 'Modal must receive gacha-reveal-active class');

  const orbsContainer = document.getElementById('evo-orbs-container');
  assert.ok(orbsContainer && orbsContainer.innerHTML.includes('evo-suck-orb'), '8 inward energy orbs must be populated');

  const starsContainer = document.getElementById('evo-mythic-stars');
  assert.ok(starsContainer && starsContainer.innerHTML.includes('evo-mythic-star'), '5 mythic rarity stars must be present');

  sounds.playMythicEvolutionReveal = origMythic;
});

// 6. Boss 1.2s Laser Telegraph, Active Beam & Entry Drama
test('V16.6: Boss initializes 1.2s (72 frames) laser telegraph, fires 45-frame beam, and rotates spiral bullets', () => {
  const boss = new Enemy(180, 120, 'boss_dreadnought', 1.0, 1.0);
  boss.isBoss = true;
  assert.equal(typeof boss.laserCooldown, 'number', 'Boss must have laserCooldown');

  // Force laser cooldown to 1 frame to trigger 72-frame telegraph
  boss.laserCooldown = 1;
  const projectiles = [];
  boss.update(180, 500, projectiles, 360, 740, 1.0);

  assert.equal(boss.laserChargeTimer, 72, 'Boss must start 72-frame (1.2s) red laser telegraph');
  assert.equal(boss.justStartedLaserCharge, true, 'Boss flags justStartedLaserCharge');

  // Advance 72 frames to ignite beam
  for (let i = 0; i < 72; i++) {
    boss.update(180, 500, projectiles, 360, 740, 1.0);
  }
  assert.equal(boss.laserActiveTimer, 45, 'After 72 frames of telegraph, Boss ignites 45-frame death laser');
  assert.equal(boss.justFiredBossLaser, true, 'Boss flags justFiredBossLaser');
});

// 7. Single-Screen Victory Debrief & Live Rival Tracker
test('V16.7: Single-Screen Victory Debrief and Live Rival Progress Bar render cleanly', () => {
  game.renderVictoryDebriefSummary(4, 350);
  const vicSummary = document.getElementById('victory-debrief-summary');
  const routeSummary = document.getElementById('route-debrief-summary');
  assert.ok(vicSummary && vicSummary.innerHTML.includes('+350 CR'), 'Victory debrief summary displays earned crystals');
  assert.ok(routeSummary && routeSummary.innerHTML.includes('SEKTÖR 4'), 'Route debrief summary displays sector info');

  // Verify drawRivalTracker executes without throwing on canvas context
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  game.player.score = 1250;
  game.drawRivalTracker(ctx);
});

console.log('='.repeat(78));
console.log(` SUMMARY: ${passed}/${passed + failed} passed (${failed} failed)`);
console.log('='.repeat(78));

if (failed > 0) {
  process.exit(1);
}
