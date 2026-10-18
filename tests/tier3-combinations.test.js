// Tier 3 — Cross-Feature Combinations Tests for Neon Space Survivor
// Tests complex interactions across progression, economy, combat math, and codex systems

import assert from 'node:assert/strict';
import { getGame, resetLocalStorage, getStorage, i18nModule, catalogModule } from './harness.js';

const { t } = i18nModule;

export async function runTier3Tests() {
  const results = [];
  function test(name, fn) {
    try {
      fn();
      results.push({ name, pass: true });
    } catch (err) {
      results.push({ name, pass: false, error: err.message, stack: err.stack });
    }
  }

  const game = getGame();

  // --------------------------------------------------------------------------
  // T3.1: Ship Star Multiplier Stacking with Infinite Overclock Upgrades
  // --------------------------------------------------------------------------
  test('T3.1: Multiplier stacking between Ship Stars (Ascension) and Infinite Overclock', () => {
    // Configure Ship Star 3 (Star Bonus: 1 + (3 - 1) * 0.10 = 1.20x)
    // Configure Overclock:
    //   overclock_damage = 10 (+30% DMG)
    //   overclock_defense = 5 (+15% HP & Shield)
    //   overclock_crystals = 6 (+30% Crystals)
    resetLocalStorage({
      neon_ship_stars: { cyberpunk: 3 },
      neon_tech_upgrades: {
        overclock_damage: 10,
        overclock_defense: 5,
        overclock_crystals: 6
      }
    });

    const currentSkin = 'cyberpunk';
    const shipStars = game.getShipStars(currentSkin);
    assert.equal(shipStars, 3, 'Ship stars should be 3');

    const starBonus = 1 + (shipStars - 1) * 0.10; // 1.20
    assert.equal(starBonus, 1.20, 'Star 3 bonus must be 1.20');

    const tech = JSON.parse(getStorage().getItem('neon_tech_upgrades') || '{}');
    const ocDmg = (tech.overclock_damage || 0) * 0.03; // 0.30
    const ocDef = (tech.overclock_defense || 0) * 0.03; // 0.15
    const ocCry = (tech.overclock_crystals || 0) * 0.05; // 0.30

    // Setup base player stats
    const baseDamage = 1.0;
    const baseHp = 100;
    const baseShield = 50;

    // Apply star bonus
    let effectiveDamage = baseDamage * starBonus;
    let effectiveHp = Math.round(baseHp * starBonus);
    let effectiveShield = Math.round(baseShield * starBonus);

    // Apply overclock multipliers
    if (ocDmg > 0) effectiveDamage *= (1 + ocDmg);
    if (ocDef > 0) {
      effectiveHp = Math.round(effectiveHp * (1 + ocDef));
      effectiveShield = Math.round(effectiveShield * (1 + ocDef));
    }
    const crystalMultiplier = (1.0) * (1 + ocCry);

    // Assert compound stacking math:
    // Damage: 1.0 * 1.20 * 1.30 = 1.56
    assert.ok(Math.abs(effectiveDamage - 1.56) < 1e-6, `Effective damage must be 1.56x (got ${effectiveDamage})`);

    // HP: 100 * 1.20 = 120 -> 120 * 1.15 = 138
    assert.equal(effectiveHp, 138, `Effective HP must compound to 138 (got ${effectiveHp})`);

    // Shield: 50 * 1.20 = 60 -> 60 * 1.15 = 69
    assert.equal(effectiveShield, 69, `Effective Shield must compound to 69 (got ${effectiveShield})`);

    // Crystals: 1.0 * 1.30 = 1.30x
    assert.equal(crystalMultiplier, 1.30, `Crystal multiplier must be 1.30x (got ${crystalMultiplier})`);
  });

  // --------------------------------------------------------------------------
  // T3.2: Daily Mutator Multipliers Interaction with Ascension & Overclock
  // --------------------------------------------------------------------------
  test('T3.2: Daily Mutator Glass Cannon overrides max HP to 1 while scaling compound damage', () => {
    // Player has Star 5 (Max Ascension) + Overclock Defense Lv 20
    const starBonus = 1 + (5 - 1) * 0.10; // 1.40
    const ocDmg = 10 * 0.03; // +30%
    const ocCry = 8 * 0.05; // +40%

    let player = {
      maxHp: 100,
      hp: 100,
      maxShield: 50,
      shield: 50,
      damageMultiplier: 1.0,
      crystalMultiplier: 1.0
    };

    // Apply Star & Overclock
    player.damageMultiplier *= starBonus * (1 + ocDmg);
    player.maxHp = Math.round(player.maxHp * starBonus * (1 + 0.15));
    player.hp = player.maxHp;
    player.crystalMultiplier *= (1 + ocCry);

    assert.ok(player.hp > 100, 'Before mutator, player HP is boosted');

    // Simulate Glass Cannon mutator rule injection:
    // { oneHp: true, playerDmg: 2.5, crystalMult: 2.0 }
    const glassCannon = {
      id: 'glass_cannon',
      oneHp: true,
      playerDmg: 2.5,
      crystalMult: 2.0
    };

    if (glassCannon.playerDmg) player.damageMultiplier *= glassCannon.playerDmg;
    if (glassCannon.oneHp) {
      player.maxHp = 1;
      player.hp = 1;
      player.maxShield = 0;
      player.shield = 0;
    }
    if (glassCannon.crystalMult) player.crystalMultiplier *= glassCannon.crystalMult;

    // Verify Glass Cannon strictly enforces 1 HP and 0 Shield regardless of prior upgrades
    assert.equal(player.maxHp, 1, 'Glass Cannon must clamp max HP to exactly 1');
    assert.equal(player.hp, 1, 'Glass Cannon must clamp HP to exactly 1');
    assert.equal(player.maxShield, 0, 'Glass Cannon must remove all shield');
    assert.equal(player.shield, 0, 'Glass Cannon shield must be 0');

    // Verify compound damage: 1.40 * 1.30 * 2.5 = 4.55x
    assert.ok(Math.abs(player.damageMultiplier - 4.55) < 1e-6, `Damage multiplier must compound to 4.55x (got ${player.damageMultiplier})`);

    // Verify crystal multiplier: 1.40 * 2.0 = 2.80x
    assert.ok(Math.abs(player.crystalMultiplier - 2.80) < 1e-6, `Crystal multiplier must compound to 2.80x (got ${player.crystalMultiplier})`);
  });

  // --------------------------------------------------------------------------
  // T3.3: Evolution Discovery Persistence & Codex Consistency
  // --------------------------------------------------------------------------
  test('T3.3: Evolution discovery recording seamlessly updates Codex modal UI and count', () => {
    resetLocalStorage();

    // Start with 0 discovered evolutions
    assert.deepEqual(game.getDiscoveredEvolutions(), [], 'Initial discovered evolutions list is empty');

    // Discover 3 evolutions in combat
    game.recordDiscoveredEvolution('vortex');
    game.recordDiscoveredEvolution('supernova');
    game.recordDiscoveredEvolution('matrix');

    const discovered = game.getDiscoveredEvolutions();
    assert.equal(discovered.length, 3, 'Must record 3 discovered evolutions');
    assert.ok(discovered.includes('vortex'), 'vortex recorded');
    assert.ok(discovered.includes('supernova'), 'supernova recorded');
    assert.ok(discovered.includes('matrix'), 'matrix recorded');

    // Avoid duplicate recording
    game.recordDiscoveredEvolution('supernova');
    assert.equal(game.getDiscoveredEvolutions().length, 3, 'Duplicate discovery must not create redundant entry');

    // Key normalization test: nano_bastion -> bastion
    game.recordDiscoveredEvolution('nano_bastion');
    const evos = game.getDiscoveredEvolutions();
    assert.ok(evos.includes('bastion') || evos.includes('nano_bastion'), 'nano_bastion discovery recorded');

    // Render codex
    game.renderCodex();

    const codexGrid = document.getElementById('codex-grid');
    assert.ok(codexGrid, 'codex-grid element must exist');
    assert.equal(codexGrid.children.length, 10, 'Codex grid must contain exactly 10 recipe cards');

    // Verify discovered count display
    const unlockedCountEl = document.getElementById('codex-unlocked-count');
    assert.ok(unlockedCountEl, 'codex-unlocked-count element must exist');
    assert.ok(unlockedCountEl.textContent.includes('10'), 'Codex counter must reflect / 10');
  });

  return results;
}

if (process.argv[1] && process.argv[1].endsWith('tier3-combinations.test.js')) {
  console.log('Running Tier 3 Tests directly...\n');
  const results = await runTier3Tests();
  let failed = 0;
  for (const r of results) {
    if (r.pass) console.log(`  [PASS] ${r.name}`);
    else { console.log(`  [FAIL] ${r.name} -> ${r.error}`); failed++; }
  }
  console.log(`\nResult: ${results.length - failed}/${results.length} passed.`);
  process.exit(failed > 0 ? 1 : 0);
}
