// ==============================================================================
// Neon Space Survivor — Mathematical Progression & Balance Simulation
// Simulates combat loop, TTK, XP milestones, and crystal economy
// ==============================================================================

import assert from 'node:assert/strict';
import { XP_CURVE, DIFFICULTY_CURVE, ENEMY_BASE_HP, BOSS_ROSTER_HP, SHIP_BALANCE, TECH_WORKSHOP_CONFIG } from '../src/balance.js';

console.log('='.repeat(78));
console.log(' NEON SPACE SURVIVOR — MATHEMATICAL BALANCE & PROGRESSION SIMULATION');
console.log('='.repeat(78));

// 1. TTK (Time-To-Kill) Simulation on Starter Enemies
console.log('\n--- [1] TTK Calibration Simulation (Cyberpunk Starter DPS) ---');
const baseShip = SHIP_BALANCE.cyberpunk;
// Cyberpunk starter gun: fires twin 2.65 dmg bolts every 28 frames (at 60fps ~2.14 shots/s = ~11.3 DPS)
const starterDps = (2.65 * 1.05 + 2.65 * 0.95) * (60 / 28) * baseShip.dmgMult;
console.log(`Starter Cyberpunk Sustained DPS: ${starterDps.toFixed(2)} dmg/sec`);

const scoutHp = ENEMY_BASE_HP.scout;
const scoutTtk = scoutHp / starterDps;
console.log(`Basic Scout HP: ${scoutHp} | Scout TTK: ${scoutTtk.toFixed(2)}s`);
assert.ok(scoutTtk <= 0.65, `Scout must pop within 0.65s (got ${scoutTtk.toFixed(2)}s)`);

const asteroidHp = ENEMY_BASE_HP.asteroid_s;
const asteroidTtk = asteroidHp / starterDps;
console.log(`Small Asteroid HP: ${asteroidHp} | Asteroid TTK: ${asteroidTtk.toFixed(2)}s`);
assert.ok(asteroidTtk <= 0.25, `Small Asteroid must pop in 1-2 hits (< 0.25s)`);

// 2. XP Progression Curve & Level-Up Timings
console.log('\n--- [2] XP Progression Milestones Simulation ---');
const xpThresholds = [];
for (let lvl = 1; lvl <= 15; lvl++) {
  xpThresholds.push({ level: lvl, neededXp: XP_CURVE.calcLevelXp(lvl) });
}
console.table(xpThresholds.slice(0, 10));

assert.equal(XP_CURVE.calcLevelXp(1), 8, 'Level 1->2 must require 8 XP (2 basic gems)');
assert.equal(XP_CURVE.calcLevelXp(2), 15, 'Level 2->3 must require 15 XP');
assert.equal(XP_CURVE.calcLevelXp(3), 23, 'Level 3->4 must require 23 XP');
assert.ok(XP_CURVE.calcLevelXp(10) < 120, 'Level 10 must not exceed 120 XP');

// 3. Economy & First-Run Upgrade Guarantee Simulation
console.log('\n--- [3] Economy & Rookie Workshop Access Simulation ---');
// A rookie who dies in 50 seconds kills ~12 enemies and breaks 6 asteroids:
// Average gems: 18 * ~3.5 CR = ~63 crystals
const rookieCrystals = 65;
const cheapestWorkshopCost = Math.min(
  TECH_WORKSHOP_CONFIG.hullMax.costs[0],
  TECH_WORKSHOP_CONFIG.shieldMax.costs[0],
  TECH_WORKSHOP_CONFIG.damageBoost.costs[0],
  TECH_WORKSHOP_CONFIG.magnet.costs[0]
);
console.log(`Rookie Run (50s fail) Yield: ~${rookieCrystals} CR`);
console.log(`Cheapest Workshop Level 1 Cost: ${cheapestWorkshopCost} CR`);
assert.ok(rookieCrystals >= cheapestWorkshopCost, 'First run rookie MUST be able to buy at least 1 permanent upgrade!');

// 4. Boss Encounter & Vacuum Dopamine Simulation
console.log('\n--- [4] Boss Encounter & TTK Simulation ---');
const vanguardBaseHp = BOSS_ROSTER_HP.boss_vanguard;
// Player at minute 1.5 has ~Level 4 with Laser Lv2-3 (DPS ~22-28)
const playerMidDps = starterDps * 2.2;
const vanguardTtk = vanguardBaseHp / playerMidDps;
console.log(`Prologue Vanguard Boss HP: ${vanguardBaseHp} | Estimated TTK: ${vanguardTtk.toFixed(1)}s`);
assert.ok(vanguardTtk >= 14 && vanguardTtk <= 28, `Boss TTK should be tightly tuned between 14-28s (got ${vanguardTtk.toFixed(1)}s)`);

// 5. Difficulty Progression Without Rubber-Banding
console.log('\n--- [5] Difficulty Scaling (Time & Stage Only) ---');
const d0 = DIFFICULTY_CURVE.calcDifficulty(0, 1);
const d1 = DIFFICULTY_CURVE.calcDifficulty(1, 1); // 1 minute
const d2 = DIFFICULTY_CURVE.calcDifficulty(2, 1); // 2 minutes
const d3 = DIFFICULTY_CURVE.calcDifficulty(3, 1); // 3 minutes
console.log(`Difficulty Scale at t=0m: ${d0.toFixed(2)}x`);
console.log(`Difficulty Scale at t=1m: ${d1.toFixed(2)}x`);
console.log(`Difficulty Scale at t=2m: ${d2.toFixed(2)}x`);
console.log(`Difficulty Scale at t=3m: ${d3.toFixed(2)}x`);
assert.equal(d0, 1.0, 'Difficulty at t=0 must be 1.0x');
assert.ok(d1 > 1.5 && d1 < 1.8, 'Difficulty at 1m should scale naturally');
assert.ok(d3 > 3.0 && d3 < 4.5, 'Difficulty at 3m should reach intense pressure');

console.log('\n[PASS] All 5 Balance Simulation Assertions Verified Successfully!\n');
