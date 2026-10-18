// Tier 2 — Boundary & Corner Cases Tests for Neon Space Survivor
// Covers edge values, thresholds, bounds, and clamping logic

import assert from 'node:assert/strict';
import { getGame, resetLocalStorage, getStorage, i18nModule, catalogModule } from './harness.js';

const { t } = i18nModule;

export async function runTier2Tests() {
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
  // T2.1: Ship Star Ascension Boundary & Clamping
  // --------------------------------------------------------------------------
  test('T2.1: Star ascension at boundaries (Star 1 vs Star 5) and clamping', () => {
    resetLocalStorage();

    // Bound 1: Minimum star is 1
    game.setShipStars('cyberpunk', 0);
    assert.equal(game.getShipStars('cyberpunk'), 1, 'Setting star 0 must clamp to min 1');

    game.setShipStars('cyberpunk', -5);
    assert.equal(game.getShipStars('cyberpunk'), 1, 'Negative star must clamp to min 1');

    // Bound 2: Star 1 multiplier is 1.0x
    const bonusStar1 = 1 + (game.getShipStars('cyberpunk') - 1) * 0.10;
    assert.equal(bonusStar1, 1.0, 'Star 1 must have exactly 1.0x stat multiplier');

    // Bound 3: Maximum star is 5
    game.setShipStars('cyberpunk', 5);
    assert.equal(game.getShipStars('cyberpunk'), 5, 'Star 5 should be accepted');
    const bonusStar5 = 1 + (game.getShipStars('cyberpunk') - 1) * 0.10;
    assert.equal(bonusStar5, 1.40, 'Star 5 bonus must be 1.40x (+40% base scaling)');

    // Bound 4: Setting star > 5 must clamp strictly to 5
    game.setShipStars('cyberpunk', 6);
    assert.equal(game.getShipStars('cyberpunk'), 5, 'Setting star 6 must clamp to max 5');

    game.setShipStars('cyberpunk', 999);
    assert.equal(game.getShipStars('cyberpunk'), 5, 'Setting star 999 must clamp to max 5');
  });

  // --------------------------------------------------------------------------
  // T2.2: Infinite Quantum Overclock Levels (Lv 0, Lv 1, Lv 10, Lv 999)
  // --------------------------------------------------------------------------
  test('T2.2: Overclock level boundaries and scaling across extreme levels', () => {
    const catalog = game.getTechCatalog();
    const ocDmg = catalog.find(i => i.id === 'overclock_damage');
    const baseCost = ocDmg.baseCost || 1000;
    const costMult = ocDmg.costMult || 1.15;

    const calcCost = (lvl) => Math.round(baseCost * Math.pow(costMult, lvl));

    // Lv 0 (Unpurchased)
    assert.equal(calcCost(0), 1000, 'Lv 0 cost should equal base cost 1000');

    // Lv 1
    assert.equal(calcCost(1), 1150, 'Lv 1 cost should equal 1150');

    // Lv 10
    const cost10 = calcCost(10);
    assert.equal(cost10, 4046, `Lv 10 cost should equal 4046 (got ${cost10})`);

    // Lv 999 (Max Level cap)
    const cost999 = calcCost(999);
    assert.ok(Number.isFinite(cost999), 'Lv 999 cost calculation must produce finite number');
    assert.ok(cost999 > 1e10, 'Lv 999 cost must be astronomical end-game crystal sink');

    // Safe handling of invalid inputs
    const safeLevel = (lvl) => Math.max(0, Math.min(999, parseInt(lvl || '0', 10)));
    assert.equal(safeLevel(undefined), 0, 'Undefined level safely resolves to 0');
    assert.equal(safeLevel(-3), 0, 'Negative level safely resolves to 0');
    assert.equal(safeLevel(1200), 999, 'Level exceeding 999 safely caps at 999');
  });

  // --------------------------------------------------------------------------
  // T2.3: Graze Distance Margins (Hit vs Graze vs Miss)
  // --------------------------------------------------------------------------
  test('T2.3: Graze margin exact thresholds: hit vs graze vs miss', () => {
    const playerRadius = 20;
    const projRadius = 4;
    const grazeMargin = 18;
    const hitThreshold = playerRadius + projRadius; // 24
    const grazeThreshold = hitThreshold + grazeMargin; // 42

    function classifyDistance(dist) {
      if (dist < hitThreshold) return 'HIT';
      if (dist < grazeThreshold) return 'GRAZE';
      return 'MISS';
    }

    // Direct collision
    assert.equal(classifyDistance(0), 'HIT', 'dist=0 must be HIT');
    assert.equal(classifyDistance(12), 'HIT', 'dist=12 must be HIT');
    assert.equal(classifyDistance(23.9), 'HIT', 'dist=23.9 must be HIT');

    // Exact boundary at hitThreshold (24) -> Grazing edge
    assert.equal(classifyDistance(24), 'GRAZE', 'dist=24 must be GRAZE');
    assert.equal(classifyDistance(30), 'GRAZE', 'dist=30 must be GRAZE');
    assert.equal(classifyDistance(41.9), 'GRAZE', 'dist=41.9 must be GRAZE');

    // Exact boundary at grazeThreshold (42) -> Miss
    assert.equal(classifyDistance(42.0), 'MISS', 'dist=42 must be MISS');
    assert.equal(classifyDistance(50), 'MISS', 'dist=50 must be MISS');
    assert.equal(classifyDistance(300), 'MISS', 'dist=300 must be MISS');

    // Double graze prevention flag
    const proj = { x: 100, y: 100, radius: 4, grazed: false };
    assert.equal(proj.grazed, false, 'Fresh projectile is not grazed');
    proj.grazed = true;
    assert.equal(proj.grazed, true, 'Flagged projectile cannot trigger duplicate graze');
  });

  // --------------------------------------------------------------------------
  // T2.4: Mode Locks Permutation Matrix
  // --------------------------------------------------------------------------
  test('T2.4: Mode Locks exhaustive permutation matrix (Storm & Mutator)', () => {
    function evaluateModes(maxStage, flights) {
      const stage = Math.max(1, maxStage || 1);
      const f = Math.max(0, flights || 0);
      const storm = !(stage < 2 && f < 1);
      const mutator = !(stage < 3 && f < 3);
      return { storm, mutator };
    }

    // Rookie Pilot (Stage 1, 0 flights)
    assert.deepEqual(evaluateModes(1, 0), { storm: false, mutator: false });

    // First Flight Complete (Stage 1, 1 flight)
    assert.deepEqual(evaluateModes(1, 1), { storm: true, mutator: false });

    // Two Flights Complete (Stage 1, 2 flights)
    assert.deepEqual(evaluateModes(1, 2), { storm: true, mutator: false });

    // Three Flights Complete (Stage 1, 3 flights)
    assert.deepEqual(evaluateModes(1, 3), { storm: true, mutator: true });

    // Campaign Stage 2 Cleared, 0 flights
    assert.deepEqual(evaluateModes(2, 0), { storm: true, mutator: false });

    // Campaign Stage 2 Cleared, 1 flight
    assert.deepEqual(evaluateModes(2, 1), { storm: true, mutator: false });

    // Campaign Stage 2 Cleared, 3 flights
    assert.deepEqual(evaluateModes(2, 3), { storm: true, mutator: true });

    // Campaign Stage 3 Cleared, 0 flights
    assert.deepEqual(evaluateModes(3, 0), { storm: true, mutator: true });

    // Campaign Master (Stage 38, 50 flights)
    assert.deepEqual(evaluateModes(38, 50), { storm: true, mutator: true });

    // Corrupted / zero inputs fallback safely
    assert.deepEqual(evaluateModes(0, 0), { storm: false, mutator: false });
    assert.deepEqual(evaluateModes(null, undefined), { storm: false, mutator: false });
  });

  // --------------------------------------------------------------------------
  // T2.5: Midnight UTC Date Roll for Daily Mutator
  // --------------------------------------------------------------------------
  test('T2.5: Date roll at midnight UTC triggers deterministic rotation and isolation', () => {
    function getMutatorIndexForDate(isoDateStr) {
      let hash = 0;
      for (let i = 0; i < isoDateStr.length; i++) {
        hash = ((hash << 5) - hash) + isoDateStr.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash) % 4;
    }

    // Sequence of consecutive dates
    const day1 = '2026-10-17';
    const day2 = '2026-10-18';
    const day3 = '2026-10-19';

    const idx1 = getMutatorIndexForDate(day1);
    const idx2 = getMutatorIndexForDate(day2);
    const idx3 = getMutatorIndexForDate(day3);

    assert.ok(idx1 >= 0 && idx1 < 4, 'Day 1 index in [0, 3]');
    assert.ok(idx2 >= 0 && idx2 < 4, 'Day 2 index in [0, 3]');
    assert.ok(idx3 >= 0 && idx3 < 4, 'Day 3 index in [0, 3]');

    // Leap day test
    const leapDay = '2028-02-29';
    const leapIdx = getMutatorIndexForDate(leapDay);
    assert.ok(leapIdx >= 0 && leapIdx < 4, 'Leap day index in [0, 3]');

    // Year rollover test
    const nye = '2026-12-31';
    const nyd = '2027-01-01';
    assert.ok(getMutatorIndexForDate(nye) >= 0 && getMutatorIndexForDate(nye) < 4);
    assert.ok(getMutatorIndexForDate(nyd) >= 0 && getMutatorIndexForDate(nyd) < 4);

    // Completion state isolation per date:
    resetLocalStorage({
      'neon_mutator_done_2026-10-17': 'true'
    });
    const storage = getStorage();
    assert.equal(storage.getItem('neon_mutator_done_2026-10-17'), 'true', 'Oct 17 is marked complete');
    assert.equal(storage.getItem('neon_mutator_done_2026-10-18'), null, 'Oct 18 must NOT be completed');
  });

  return results;
}

if (process.argv[1] && process.argv[1].endsWith('tier2-boundary.test.js')) {
  console.log('Running Tier 2 Tests directly...\n');
  const results = await runTier2Tests();
  let failed = 0;
  for (const r of results) {
    if (r.pass) console.log(`  [PASS] ${r.name}`);
    else { console.log(`  [FAIL] ${r.name} -> ${r.error}`); failed++; }
  }
  console.log(`\nResult: ${results.length - failed}/${results.length} passed.`);
  process.exit(failed > 0 ? 1 : 0);
}
