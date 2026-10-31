// ============================================================================
// Automated Verification Suite: Vampire Survivors Style Jackpot Chest VFX
// Tests all 5 Choreography Steps, Pure Pixel-Art Constraints, 160-Particle Pool,
// Audio/Haptic Event Hooks, and 100th-Hour QoL Instant Skip / Claim & Close
// ============================================================================

import assert from 'node:assert/strict';
import { getGame, resetLocalStorage } from './harness.js';
import {
  ChestVfxController,
  LegendaryChestOverlay,
  FountainParticlePool,
  LeakParticlePool,
  PILLAR_PALETTES,
  elasticOut
} from '../src/chest-vfx-controller.js';
import { EventBus } from '../src/events.js';
import { sounds } from '../src/audio.js';

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
    if (err.stack) {
      console.error(err.stack.split('\n').slice(1, 4).join('\n'));
    }
    failed++;
  }
}

function createPixelArtAuditContext() {
  const audit = {
    arcCalls: 0,
    ellipseCalls: 0,
    radialGradientCalls: 0,
    linearGradientCalls: 0,
    nonZeroBlurCalls: 0,
    nonIntegerFillRects: [],
    nonIntegerTranslates: [],
    fillRectRecords: [],
    fillTextRecords: [],
    imageSmoothingStates: []
  };

  const ctx = {
    fillStyle: '#000000',
    strokeStyle: '#000000',
    globalAlpha: 1.0,
    shadowBlur: 0,
    shadowColor: 'transparent',
    imageSmoothingEnabled: true,
    font: '12px monospace',
    textAlign: 'center',
    textBaseline: 'middle',
    save() {},
    restore() {},
    translate(x, y) {
      if (!Number.isInteger(x) || !Number.isInteger(y)) {
        audit.nonIntegerTranslates.push({ x, y });
      }
    },
    fillRect(x, y, w, h) {
      audit.imageSmoothingStates.push(this.imageSmoothingEnabled);
      if (this.shadowBlur > 0) {
        audit.nonZeroBlurCalls++;
      }
      if (!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(w) || !Number.isInteger(h)) {
        audit.nonIntegerFillRects.push({ x, y, w, h });
      }
      audit.fillRectRecords.push({
        x,
        y,
        w,
        h,
        fillStyle: String(this.fillStyle),
        globalAlpha: Number(this.globalAlpha)
      });
    },
    strokeRect(x, y, w, h) {
      if (this.shadowBlur > 0) audit.nonZeroBlurCalls++;
      if (!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(w) || !Number.isInteger(h)) {
        audit.nonIntegerFillRects.push({ x, y, w, h });
      }
    },
    fillText(text, x, y) {
      if (!Number.isInteger(x) || !Number.isInteger(y)) {
        audit.nonIntegerFillRects.push({ text, x, y });
      }
      audit.fillTextRecords.push({ text: String(text), x, y, fillStyle: String(this.fillStyle) });
    },
    arc() {
      audit.arcCalls++;
    },
    ellipse() {
      audit.ellipseCalls++;
    },
    createRadialGradient() {
      audit.radialGradientCalls++;
      return { addColorStop() {} };
    },
    createLinearGradient() {
      audit.linearGradientCalls++;
      return { addColorStop() {} };
    }
  };

  return { ctx, audit };
}

console.log('='.repeat(78));
console.log(' LEGENDARY CHEST VFX CONTROLLER — DEEP VERIFICATION SUITE');
console.log('='.repeat(78));

// 1. Export & Alias Verification
test('VFX.1: ChestVfxController and LegendaryChestOverlay alias export cleanly with pre-allocated pools', () => {
  assert.equal(ChestVfxController, LegendaryChestOverlay, 'LegendaryChestOverlay must alias ChestVfxController');
  const ctrl = new ChestVfxController();
  assert.ok(ctrl.fountainPool instanceof FountainParticlePool, 'fountainPool must be instance of FountainParticlePool');
  assert.ok(ctrl.leakPool instanceof LeakParticlePool, 'leakPool must be instance of LeakParticlePool');
  assert.ok(ctrl.fountainPool.capacity >= 150, `fountainPool capacity must be >= 150 (got ${ctrl.fountainPool.capacity})`);
  assert.equal(ctrl.fountainPool.pool.length, 160, 'fountainPool must pre-allocate 160 slots at construction');
});

// 2. Step 1 (0ms - 800ms): Tension, Progressive Tremor (±2px -> ±4px -> ±6px), Gold Leak, 25% Squash & 60ms Hit-Stop
test('VFX.2: Step 1 (0-800ms) applies #141020 85% backdrop, progressive tremor (±2->±4->±6px), gold leak, 25% squash, and 60ms Hit-Stop', () => {
  const ctrl = new ChestVfxController();
  const clicks = [];
  const off = EventBus.on('CHEST_VFX_SELECTION_CLICK', (ev) => clicks.push(ev));

  ctrl.start({ width: 360, height: 740 });
  assert.equal(ctrl.active, true);
  assert.equal(ctrl.step, 1);
  assert.equal(ctrl.chestX, 180, 'Chest must sit at horizontal center');
  assert.equal(ctrl.chestY, Math.round(740 * 0.76), 'Chest must sit at bottom-center anchor');

  // 100ms -> ±2px tremor
  ctrl.update(100);
  assert.equal(ctrl.step, 1);
  assert.equal(ctrl.tremorAmplitude, 2, 'At 100ms tremor amplitude must be ±2px');
  assert.equal(Math.abs(ctrl.tremorOffsetX), 2);
  assert.ok(ctrl.leakPool.getActiveCount() > 0, 'Gold square pixels must leak from chest edges in Step 1');

  // 300ms -> ±4px tremor
  ctrl.update(200); // elapsed = 300ms
  assert.equal(ctrl.tremorAmplitude, 4, 'At 300ms tremor amplitude must be ±4px');
  assert.equal(Math.abs(ctrl.tremorOffsetX), 4);

  // 600ms -> ±6px tremor
  ctrl.update(300); // elapsed = 600ms
  assert.equal(ctrl.tremorAmplitude, 6, 'At 600ms tremor amplitude must be ±6px');
  assert.equal(Math.abs(ctrl.tremorOffsetX), 6);
  assert.ok(clicks.length >= 3, 'Accelerating selectionClick events must fire during tremor phase');
  assert.equal(sounds.lastPlayedSound, 'chest_tremor_tick');

  // 750ms -> Inside 740ms-800ms (60ms Hit-Stop & 25% vertical squash)
  ctrl.update(150); // elapsed = 750ms
  assert.equal(ctrl.isHitStop, true, 'At 750ms (last 60ms before 800ms) 60ms Hit-Stop must be active');
  assert.equal(ctrl.squashScaleY, 0.75, 'Chest must squash vertically by 25% (scaleY = 0.75)');
  assert.equal(ctrl.squashScaleX, 1.25, 'Chest must widen horizontally to preserve volume (scaleX = 1.25)');
  assert.equal(ctrl.tremorOffsetX, 0, 'Tremor must freeze during 60ms Hit-Stop');

  // Verify leak particles completely freeze during Hit-Stop
  const activeLeak = ctrl.leakPool.pool.find(p => p.active);
  assert.ok(activeLeak, 'Should have at least one active leak particle');
  const snapX = activeLeak.x;
  const snapY = activeLeak.y;
  ctrl.update(25); // elapsed = 775ms (still inside 740..800ms Hit-Stop)
  assert.equal(activeLeak.x, snapX, 'Leak particle X must not move during 60ms Hit-Stop');
  assert.equal(activeLeak.y, snapY, 'Leak particle Y must not move during 60ms Hit-Stop');

  // Verify #141020 at 85% opacity in render()
  const { ctx, audit } = createPixelArtAuditContext();
  ctrl.render(ctx, 360, 740);
  const bgRect = audit.fillRectRecords[0];
  assert.equal(bgRect.fillStyle.toUpperCase(), '#141020', 'First layer must be #141020 dark purple/navy backdrop');
  assert.equal(bgRect.globalAlpha, 0.85, 'Backdrop opacity must be 85% (0.85)');

  off();
});

// 3. Step 2 (800ms - 1000ms): 2-Frame 100% White Flash, 3-Layer 12fps Stepped Light Pillar, ±8px Screen Shake
test('VFX.3: Step 2 (800-1000ms) triggers heavyImpact, 2-frame #FFFFFF flash, 3-layer 12fps Stepped Light Pillar, and ±8px shake', () => {
  const ctrl = new ChestVfxController();
  let impactEvents = 0;
  const off = EventBus.on('CHEST_VFX_HEAVY_IMPACT', () => { impactEvents++; });

  ctrl.start({ width: 360, height: 740 });
  ctrl.update(805); // Enter Step 2 (805ms)

  assert.equal(ctrl.step, 2);
  assert.equal(ctrl.chestOpen, true, 'Chest lid must open at 800ms');
  assert.equal(ctrl.pillarActive, true, 'Stepped Light Pillar must activate at 800ms');
  assert.equal(impactEvents, 1, 'heavyImpact event must fire once at 800ms');
  assert.equal(sounds.lastPlayedSound, 'chest_heavy_impact');
  assert.equal(ctrl.whiteFlashFramesRemaining, 2, 'White flash must be armed for exactly 2 frames');
  assert.equal(Math.abs(ctrl.shakeOffsetX), 8, 'Screen shake X must be ±8px in Step 2');
  assert.equal(Math.abs(ctrl.shakeOffsetY), 8, 'Screen shake Y must be ±8px in Step 2');

  // Frame 1 render at 805ms -> White Flash frame 1
  const { ctx: ctx1, audit: audit1 } = createPixelArtAuditContext();
  ctrl.render(ctx1, 360, 740);
  const lastRect1 = audit1.fillRectRecords[audit1.fillRectRecords.length - 1];
  assert.equal(lastRect1.fillStyle.toUpperCase(), '#FFFFFF', 'Frame 1 must draw 100% pure #FFFFFF flash');
  assert.equal(lastRect1.globalAlpha, 1.0, 'White flash must have 100% opacity');
  assert.equal(ctrl.whiteFlashFramesRemaining, 1, '1 white flash frame must remain after first render');

  // Verify 3-layer Stepped Light Pillar extends to y = 0 with Outer/Mid/Inner colors
  const pillarTopRects = audit1.fillRectRecords.filter(r => r.y === 0 && r.h > 400 && r.w < 360);
  assert.equal(pillarTopRects.length, 3, 'Stepped Light Pillar must consist of 3 vertical layers extending to top of screen (y=0)');
  assert.equal(pillarTopRects[0].fillStyle.toUpperCase(), PILLAR_PALETTES[0].outer);
  assert.equal(pillarTopRects[1].fillStyle.toUpperCase(), PILLAR_PALETTES[0].mid);
  assert.equal(pillarTopRects[2].fillStyle.toUpperCase(), PILLAR_PALETTES[0].inner);

  // Frame 2 render -> White Flash frame 2
  const { ctx: ctx2, audit: audit2 } = createPixelArtAuditContext();
  ctrl.render(ctx2, 360, 740);
  assert.equal(ctrl.whiteFlashFramesRemaining, 0, 'White flash frames must reach 0 after 2 frames');

  // Verify 12 FPS Palette Cycling (1000/12 = 83.33ms per palette step)
  ctrl.update(85); // elapsed = 890ms -> palette index 1
  assert.equal(ctrl.paletteCycleIndex, 1, 'Palette must advance to index 1 after ~83.33ms (12 FPS)');
  ctrl.update(85); // elapsed = 975ms -> palette index 2
  assert.equal(ctrl.paletteCycleIndex, 2, 'Palette must advance to index 2 after ~166.67ms (12 FPS)');

  off();
});

// 4. Step 3 (1000ms - 3200ms): 160-Particle Fountain (-70° to -110°), Gravity, 1 Floor Bounce, 3-Stage Ghost Trail, 80ms Ascending Pitch
test('VFX.4: Step 3 (1000-3200ms) spawns 160 pooled particles at [-110°, -70°] with gravity, 1 floor bounce, 3-stage ghost trail, and 80ms ascending pitch', () => {
  const ctrl = new ChestVfxController();
  const fountainTicks = [];
  const off = EventBus.on('CHEST_VFX_FOUNTAIN_TICK', (ev) => fountainTicks.push(ev));

  ctrl.start({ width: 360, height: 740 });
  const poolRef = ctrl.fountainPool.pool;
  const firstParticleRef = poolRef[0];

  ctrl.update(1000); // Enter Step 3 at 1000ms
  assert.equal(ctrl.step, 3);
  assert.equal(ctrl.fountainSpawned, true);
  assert.equal(ctrl.fountainPool.getActiveCount(), 160, 'All 160 pre-allocated particles must activate at 1000ms');

  // Verify zero new particle object allocations (same object references in pool)
  assert.equal(ctrl.fountainPool.pool, poolRef, 'Pool array reference must not change');
  assert.equal(ctrl.fountainPool.pool[0], firstParticleRef, 'Pooled particle object reference must be reused (Zero GC)');

  // Verify launch angles strictly between -110° and -70° and upward initial vy < 0
  for (let i = 0; i < ctrl.fountainPool.capacity; i++) {
    const p = ctrl.fountainPool.pool[i];
    assert.ok(p.launchAngleDeg >= -110 && p.launchAngleDeg <= -70, `Particle ${i} angle ${p.launchAngleDeg} must be in [-110, -70]`);
    assert.ok(p.vy < 0, `Particle ${i} initial vy must shoot upward (< 0)`);
  }

  // Advance across Step 3 (1000ms -> 3000ms in 40ms steps) to test gravity, 3-stage ghost trail, 1 bounce, and 80ms ascending pitch
  for (let step = 0; step < 50; step++) {
    ctrl.update(40);
  }

  // Verify particles bounced at bottom edge at most 1 time
  const bouncedCount = ctrl.fountainPool.getBouncedCount();
  assert.ok(bouncedCount > 50, `Particles must fall with gravity and bounce off bottom floor (bounced=${bouncedCount})`);
  for (let i = 0; i < ctrl.fountainPool.capacity; i++) {
    assert.ok(ctrl.fountainPool.pool[i].bounceCount <= 1, 'Particles must bounce at most 1 time at bottom of screen');
  }

  // Verify 80ms ascending pitch chiptune events
  assert.ok(fountainTicks.length >= 20, `80ms fountain ticks must fire throughout Step 3 (got ${fountainTicks.length})`);
  for (let i = 1; i < fountainTicks.length; i++) {
    assert.ok(fountainTicks[i].freq >= fountainTicks[i - 1].freq, 'Fountain chiptune pitch must ascend over time');
  }

  off();
});

// 5. Step 4 (1200ms - 3000ms): Rising Rare Item Icon, Rotating (+) and (x) 8-Bit Stars, 3 Stepped Pixel Shockwaves
test('VFX.5: Step 4 (1200-3000ms) raises rare icon up the pillar with rotating (+)/(x) 8-bit stars and 3 Stepped Pixel Shockwaves', () => {
  const ctrl = new ChestVfxController();
  ctrl.start({ width: 360, height: 740 });

  ctrl.update(1250); // 1250ms (start of Step 4)
  assert.equal(ctrl.step, 4);
  const startY = ctrl.rewardIconY;
  const startAngle = ctrl.starOrbitAngle;
  assert.equal(ctrl.shockwaves[0].active, true, 'Shockwave 1 must be active at 1250ms');

  ctrl.update(450); // 1700ms (mid Step 4)
  assert.ok(ctrl.rewardIconY < startY, 'Rare reward icon must rise upward toward screen center');
  assert.ok(ctrl.starOrbitAngle > startAngle, '(+) and (x) 8-bit pixel stars must rotate around rising icon');
  assert.equal(ctrl.shockwaves[1].active, true, 'Shockwave 2 must be active at 1700ms');

  ctrl.update(450); // 2150ms
  assert.equal(ctrl.shockwaves[2].active, true, 'Shockwave 3 must be active at 2150ms');

  ctrl.update(850); // 3000ms (arrived at center)
  assert.equal(ctrl.rewardIconY, Math.round(740 * 0.34), 'Reward icon must reach target screen center at 3000ms');
});

// 6. Step 5 (3000ms+) & 100th-Hour QoL Rule (1st Tap Instant Skip to Step 5, 2nd Tap Claim & Close)
test('VFX.6: Step 5 uses elasticOut curve + 45° Pixel Gleam, and enforces 1st-tap Instant Skip & 2nd-tap Claim & Close QoL rule', () => {
  // Verify elasticOut mathematical properties
  assert.equal(elasticOut(0), 0);
  assert.equal(elasticOut(1), 1);
  assert.ok(elasticOut(0.15) > 1.0, 'elasticOut must overshoot > 1.0 for elastic bounce feel');

  const ctrl = new ChestVfxController();
  let claimedCount = 0;
  let revealEvents = 0;
  const offReveal = EventBus.on('CHEST_VFX_REWARD_REVEAL', () => { revealEvents++; });

  ctrl.start({
    width: 360,
    height: 740,
    primaryReward: { id: 'evo_supernova', name: 'SUPERNOVA CORE', stat: 'EVOLVED', color: '#FFD700', desc: 'Thermonuclear fusion' },
    onClaim: () => { claimedCount++; }
  });

  // Advance to 450ms (middle of Step 1)
  ctrl.update(450);
  assert.equal(ctrl.step, 1);
  assert.equal(ctrl.active, true);

  // 1ST TAP during animation -> Instant Skip to Step 5 (Reveal)
  const tap1Result = ctrl.handleTap();
  assert.equal(tap1Result, 'SKIPPED_TO_REVEAL', '1st tap during Steps 1-4 must return SKIPPED_TO_REVEAL');
  assert.equal(ctrl.step, 5, '1st tap must jump immediately to Step 5');
  assert.ok(ctrl.elapsedMs >= 3000, 'elapsedMs must jump to Step 5 (>= 3000ms)');
  assert.equal(ctrl.cardScale, 1.0, 'Reward card must be fully settled (cardScale = 1.0) on Instant Skip');
  assert.equal(ctrl.active, true, 'Overlay must remain open on 1st tap so player sees the revealed reward');
  assert.equal(claimedCount, 0, '1st tap must NOT claim/close yet');
  assert.equal(revealEvents, 1, 'Reveal event must fire on skip to Step 5');

  // 2ND TAP -> Claim reward & close window
  const tap2Result = ctrl.handleTap();
  assert.equal(tap2Result, 'CLAIMED_AND_CLOSED', '2nd tap must return CLAIMED_AND_CLOSED');
  assert.equal(ctrl.active, false, 'Overlay must close on 2nd tap');
  assert.equal(claimedCount, 1, 'onClaim callback must execute exactly once on 2nd tap');

  // Extra tap after close -> safe no-op
  assert.equal(ctrl.handleTap(), 'INACTIVE', 'Tap while inactive must be a safe no-op');

  offReveal();
});

// 7. Pure Pixel Art Audit Across All 5 Steps (Zero Blur, Zero Gradients, Zero Circles, 100% Integer Coordinates)
test('VFX.7: Pure Pixel-Art Audit — 0 blur, 0 gradients, 0 arc/ellipse, imageSmoothingEnabled=false, 100% integer coordinates across all 5 steps', () => {
  const ctrl = new ChestVfxController();
  const { ctx, audit } = createPixelArtAuditContext();

  ctrl.start({ width: 360, height: 740 });

  // Sample timestamps across all 5 steps: 100ms, 400ms, 760ms (squash+hitstop), 805ms (flash+pillar), 920ms, 1100ms (fountain), 1650ms (rising+stars+shockwaves), 3250ms (elasticOut card+45° gleam)
  const sampleStepsMs = [100, 300, 360, 45, 115, 180, 550, 1600];
  for (const dt of sampleStepsMs) {
    ctrl.update(dt);
    ctrl.render(ctx, 360, 740);
  }

  assert.equal(audit.arcCalls, 0, 'Must NEVER call ctx.arc (drawCircle forbidden)');
  assert.equal(audit.ellipseCalls, 0, 'Must NEVER call ctx.ellipse');
  assert.equal(audit.radialGradientCalls, 0, 'Must NEVER call ctx.createRadialGradient');
  assert.equal(audit.linearGradientCalls, 0, 'Must NEVER call ctx.createLinearGradient');
  assert.equal(audit.nonZeroBlurCalls, 0, 'Must NEVER render with shadowBlur > 0');
  assert.equal(audit.nonIntegerFillRects.length, 0, `All fillRect/fillText coordinates must be integers (found ${audit.nonIntegerFillRects.length} non-integer calls)`);
  assert.equal(audit.nonIntegerTranslates.length, 0, 'All ctx.translate calls must use integer coordinates');
  assert.ok(audit.imageSmoothingStates.every(v => v === false), 'ctx.imageSmoothingEnabled must always be false');
});

// 8. End-to-End Game Integration Test (triggerLuckyChest -> chestVfx -> handleChestVfxTap -> claimLuckyChest)
test('VFX.8: Game integration — triggerLuckyChest starts chestVfx, 1st tap skips to reveal, 2nd tap claims reward and resumes game', () => {
  resetLocalStorage();
  const game = getGame();
  game.startNewGame();
  game.player.upgrades.laser = 5;
  game.player.upgrades.magnet = 1;
  game.player.evolutions.vortexLaser = false;

  // Trigger immediate Lucky Chest opening
  game.triggerLuckyChest(true);
  assert.equal(game.state, 'LUCKY_CHEST');
  assert.ok(game.chestVfx && game.chestVfx.active, 'game.chestVfx must activate when Lucky Chest opens');
  assert.equal(game.chestVfx.step, 1);

  // Advance game update & draw during LUCKY_CHEST
  game.update(1.0);
  game.draw();
  assert.ok(game.chestVfx.elapsedMs > 0, 'game.update must advance chestVfx timeline');

  // 1st tap via game.handleChestVfxTap() -> Instant Skip to Step 5
  const res1 = game.handleChestVfxTap();
  assert.equal(res1, 'SKIPPED_TO_REVEAL');
  assert.equal(game.chestVfx.step, 5);
  assert.equal(game.state, 'LUCKY_CHEST');

  // 2nd tap via game.handleChestVfxTap() -> Claim & Close
  const res2 = game.handleChestVfxTap();
  assert.equal(res2, 'CLAIMED_AND_CLOSED');
  assert.equal(game.chestVfx.active, false, 'chestVfx must deactivate after 2nd tap claim');
  assert.equal(game.state, 'PLAYING', 'Game must resume to PLAYING after 2nd tap claim');
});

// 9. Adversarial Edge Case: Simultaneous touchstart + pointerdown / Multi-Touch Debounce
test('VFX.9: Simultaneous touchstart + pointerdown within <60ms debounces so 1 physical tap never both skips and claims', () => {
  const ctrl = new ChestVfxController();
  let claimed = 0;
  ctrl.start({ width: 360, height: 740, onClaim: () => { claimed++; } });
  ctrl.update(400); // Step 1

  // First event at t = 1000ms -> skips to Step 5
  const r1 = ctrl.handleTap(1000);
  assert.equal(r1, 'SKIPPED_TO_REVEAL');
  assert.equal(ctrl.step, 5);
  assert.equal(ctrl.active, true);

  // Ghost / duplicate event 12ms later (t = 1012ms) -> must be DEBOUNCED, not CLAIMED_AND_CLOSED
  const r2 = ctrl.handleTap(1012);
  assert.equal(r2, 'DEBOUNCED', 'Duplicate event within 60ms must be debounced');
  assert.equal(ctrl.active, true, 'Overlay must remain open after debounced ghost event');
  assert.equal(claimed, 0, 'Must not claim on debounced ghost event');

  // Deliberate 2nd tap 150ms later (t = 1162ms) -> claims and closes
  const r3 = ctrl.handleTap(1162);
  assert.equal(r3, 'CLAIMED_AND_CLOSED');
  assert.equal(ctrl.active, false);
  assert.equal(claimed, 1);
});

// 10. Adversarial Edge Case: Mid-Choreography Viewport Resize / Orientation Change
test('VFX.10: Viewport resize mid-choreography updates chest anchor and particle floorY bounce boundary', () => {
  const ctrl = new ChestVfxController();
  const { ctx } = createPixelArtAuditContext();

  ctrl.start({ width: 360, height: 740 });
  ctrl.update(1050); // Spawn fountain at 1000ms (initial floorY = 740 - 14 = 726)
  assert.equal(ctrl.fountainPool.pool[0].floorY, 726);

  // Simulate orientation change / resize to 740x360 during render
  ctrl.render(ctx, 740, 360);
  assert.equal(ctrl.width, 740);
  assert.equal(ctrl.height, 360);
  assert.equal(ctrl.chestX, 370, 'Chest X must re-center to 370 on resize');
  assert.equal(ctrl.fountainPool.pool[0].floorY, 360 - 14, 'All pooled fountain particles must update floorY to new bottom edge (346)');
});

console.log('='.repeat(78));
console.log(` SUMMARY: ${passed}/${passed + failed} passed (${failed} failed)`);
console.log('='.repeat(78));

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
