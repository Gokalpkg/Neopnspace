// ==============================================================================
// Neon Space Survivor — Master Automated Test Runner (Tiers 1–4)
// Requirement-Driven E2E & Unit Test Suite
// ==============================================================================

import { runTier1Tests } from './tier1-features.test.js';
import { runTier2Tests } from './tier2-boundary.test.js';
import { runTier3Tests } from './tier3-combinations.test.js';
import { runTier4Tests } from './tier4-acceptance.test.js';

const startTime = Date.now();

// Parse command line arguments
const args = process.argv.slice(2);
const targetTierArg = args.find(a => a.startsWith('--tier=') || /^[1-4]$/.test(a));
const targetTier = targetTierArg ? targetTierArg.replace('--tier=', '') : null;

console.log('='.repeat(78));
console.log(' NEON SPACE SURVIVOR — AUTOMATED TEST SUITE (TIERS 1–4)');
console.log(' Target Architecture: HTML5 Canvas, Vanilla ES Modules, Vite, Capacitor');
console.log(' Test Engine: Headless Node.js Runner with Full Simulation Harness');
console.log('='.repeat(78));
console.log();

const suites = [
  { tier: 1, name: 'Tier 1 — Feature Coverage (15 Core Systems)', fn: runTier1Tests },
  { tier: 2, name: 'Tier 2 — Boundary & Corner Cases', fn: runTier2Tests },
  { tier: 3, name: 'Tier 3 — Cross-Feature Combinations & Math Stacking', fn: runTier3Tests },
  { tier: 4, name: 'Tier 4 — Acceptance Validation & 9-Language i18n Audit', fn: runTier4Tests }
];

const allResults = [];
let totalPassed = 0;
let totalFailed = 0;

for (const suite of suites) {
  if (targetTier && String(suite.tier) !== targetTier) {
    continue;
  }

  console.log(`>>> Executing [${suite.name}]...`);
  const suiteResults = await suite.fn();
  let suitePassed = 0;
  let suiteFailed = 0;

  for (const r of suiteResults) {
    if (r.pass) {
      console.log(`  [PASS] ${r.name}`);
      suitePassed++;
      totalPassed++;
    } else {
      console.log(`  [FAIL] ${r.name}`);
      console.log(`         Error: ${r.error}`);
      if (r.stack) {
        const stackLines = r.stack.split('\n').slice(1, 4).map(l => '         ' + l.trim()).join('\n');
        console.log(stackLines);
      }
      suiteFailed++;
      totalFailed++;
    }
  }

  allResults.push({
    tier: suite.tier,
    name: suite.name,
    total: suiteResults.length,
    passed: suitePassed,
    failed: suiteFailed
  });
  console.log(`--- Result: ${suitePassed}/${suiteResults.length} passed (${suiteFailed} failed)\n`);
}

const elapsedMs = Date.now() - startTime;

console.log('='.repeat(78));
console.log(' TEST SUITE EXECUTION SUMMARY');
console.log('='.repeat(78));
console.log(` Total Suites Executed: ${allResults.length}`);
console.log(` Total Tests Executed:  ${totalPassed + totalFailed}`);
console.log(` Passed:                ${totalPassed}`);
console.log(` Failed:                ${totalFailed}`);
console.log(` Total Duration:        ${elapsedMs} ms`);
console.log();

for (const r of allResults) {
  const status = r.failed === 0 ? 'PASS' : 'FAIL';
  console.log(` [${status}] Tier ${r.tier}: ${r.passed}/${r.total} passed`);
}

console.log('='.repeat(78));

if (totalFailed > 0) {
  console.error(`\nFAILED: ${totalFailed} test(s) failed.`);
  process.exit(1);
} else {
  console.log(`\nSUCCESS: All ${totalPassed} automated tests passed! Test suite is ready.`);
  process.exit(0);
}
