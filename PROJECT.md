# Project: Neon Space / Neon Galaxy — Rogue-Lite Mobile Market Gap Analysis & Polish Plan

## Architecture
- **Client Engine**: HTML5 2D Canvas (`canvas#game-canvas`), virtual viewport 360x740 responsive scaling, zero-allocation pooling engine (`src/pool-manager.js:PoolManager`), 60 FPS `requestAnimationFrame` game loop.
- **Controls & Input**: 1:1 single-finger relative touch drag with 42px vertical finger offset (`fingerTouchOffset = 42`), 0.55 rad spring-damper aerodynamic banking tilt, dual combat zone hysteresis (0.67 entry / 0.73 exit).
- **Combat & Visual FX**: 14x7 px high-contrast neon magenta-red enemy projectiles (`#ff0055`) with bright white cores (`#ffffff`), 24 screen projectile cap, multi-layer defensive gates (28-frame normal hit I-frames, Shield-Gate 42 frames + 120px wipe, Last-Stand "Son Nefes" 60 frames + 165px wipe + 28-frame slow-mo).
- **Audio & Haptics**: Procedural Web Audio API synthesizer (`src/audio.js`) with dynamic low-pass filters (`setComboFilter`), combo pitch ramping, clamped audio throttling; dual fallback haptics (`Haptics.impact` on native, `navigator.vibrate` on web).
- **Meta-Progression & Economy**: Guaranteed death consolation crystals (`Math.max(30, Math.round(gameTime * 0.65) + player.level * 5)`), 5-stat permanent tech tree (Hull, Shield, Damage, Magnet, Crit), Infinite Quantum Overclock (0-999), Ship Star-Up (1-5 stars), 1-tap quick upgrade `#btn-restart` on defeat.
- **Weapon Evolutions**: 10 super-weapons (`src/game.js:getEvolutionRecipes()` and `Codex RECIPES`) including Supernova, Emerald HyperPlasma Scythe, Singularity Vortex; smart synergy RNG granting +60% card weight to complementary items.
- **Leaderboard & Cloud**: Firebase Cloud Firestore (`leaderboard_storm`, `leaderboard_campaign`) with live top 50 syncing, procedural offline fallback, Cosmic League 6-tier ladder, Google Play Games Services achievements.
- **Mobile Native Bridge**: Capacitor 7.0.1 wrapping HTML5 app into native Android package `com.kaunos.neonspace` (versionCode 56, versionName 1.7.8).

---

## Feature Inventory & Market Feedback Comparison Matrix

Every item from the market feedback and survey investigation is categorized below:

| # | Category | Market Feedback Requirement | Current Codebase Status | Repository Evidence & Files | Verification / Assessment | Milestone Assignment |
|---|---|---|---|---|---|---|
| F1 | Meta-Progression | Permanent upgrade tree using death crystals (Hull, Shield, Damage, Magnet, Crit, Overclock) | **Fully Implemented** | `src/game.js:5020–5148`, `src/balance.js:TECH_WORKSHOP_CONFIG` | Verified by `tier1-features.test.js:T1.9, T1.10`, `tier3-combinations.test.js:T3.1` | M1 (Verified) |
| F2 | Meta-Progression | Ship Star-Up ascension (1-5 stars, +10% stats/star) | **Fully Implemented** | `src/game.js:4850–4920` | Verified by `test_m3_challenger_empirical.mjs:S1.1` | M1 (Verified) |
| F3 | Meta-Progression | 1-tap quick upgrade on death (`#btn-restart` dynamic transform) | **Fully Implemented** | `src/game.js:12763–12809`, `updateGameOverRestartBtn` | Verified by `test_ftue_retention_overhaul.mjs:F1.1-F1.3` | M1 (Verified) |
| F4 | Meta-Progression | Guaranteed death consolation crystals ensuring progression feel | **Fully Implemented** | `src/game.js:12968–12978` (`Math.max(30, Math.round(gameTime * 0.65) + player.level * 5)`) | Verified in game loop defeat logic | M1 (Verified) |
| F5 | Weapon Evolutions | Level 5 pairs forming 10 super weapons (Supernova, Emerald Scythe, Singularity Vortex, etc.) | **Fully Implemented** | `src/game.js:2989–3001`, `Codex RECIPES` | Verified by `test_v16_m1_evolutions.mjs:1.1-5.2` (17/17 PASS) | M1 (Verified) |
| F6 | Weapon Evolutions | Smart synergy RNG (+60% card weight for complementary recipe items) | **Fully Implemented** | `src/game.js:15420–15445` (1.6x multiplier) | Verified by 500-run Monte Carlo in `test_m2_challenger_empirical.mjs` | M1 (Verified) |
| F7 | Weapon Evolutions | Cinematic presentation (1.5s freeze, 360° EMP wipe, 8s aura, double-tap lock) | **Fully Implemented** | `src/game.js:15620–15710` | Verified by `test_v16_m1_evolutions.mjs` | M1 (Verified) |
| F8 | Leaderboard | Competitive survivor leaderboards (Firebase Cloud Firestore, PGS, Cosmic League) | **Fully Implemented** | `src/leaderboard.js:15–243`, `src/game.js:8452–8461` | Verified by `tier1-features.test.js:T1.14`, `test_leaderboard_and_ui_fixes.mjs` | M1 (Verified) |
| F9 | Leaderboard | Weekly rankings with automated Firestore week partitioning & live countdown timer | **Partially Implemented (Gap)** | `src/game.js:8587` (`updateSeasonCountdown()` static text) | Gap identified: lacks automated weekly collection rotation and live timer | M2 (Gap / Polish) |
| F10 | Controls Tuning | Single-finger / thumb-friendly relative drag with 42px touch offset | **Fully Implemented** | `src/game.js:1192–1249`, `this.player.fingerTouchOffset = 42` | Verified by `test_v17_overhaul.mjs:V17.2, V17.3` | M1 (Verified) |
| F11 | Controls Tuning | Virtual joystick smoothness, banking tilt (0.55 rad), spring damping | **Fully Implemented** | `src/game.js:13559–13562` (0.55 rad tilt, 0.74 damping) | Rendered knob replaced by 1:1 relative touch to eliminate visual clutter | M1 (Verified) |
| F12 | Bullet Chaos | Enemy bullet contrast against dark background (magenta-red `#ff0055` + white `#ffffff` core) | **Fully Implemented** | `src/enemies.js:2001–2014` (14x7 px high-contrast) | Verified by `test_v17_overhaul.mjs:V17.6, V17.7` | M1 (Verified) |
| F13 | Bullet Chaos | Bullet density management (24-bullet cap, 36-frame telegraphs, 7 wipe systems) | **Fully Implemented** | `src/enemies.js:1052, 1077, 1148`, `test_anti_instant_death.mjs` | Verified by `test_anti_instant_death.mjs` (11/11 PASS) | M1 (Verified) |
| F14 | Store (ASO) Titles | Turkish Title ("Neon Space: Uzayda Hayatta Kalma") vs Google Play 30-char ceiling | **Discrepancy (32 chars > 30)** | `ASO_METINLERI_NEONSPACE.txt:6`, `KOPYALA_YAPISTIR_METINLER.txt:8` | Proposed title exceeds 30-char limit by 2 chars. Must adopt 25-char compliant title. | M2 (Gap / Polish) |
| F15 | Store (ASO) Titles | Global Title ("Neon Space Survivor: Rogue Space") vs Google Play 30-char ceiling | **Discrepancy (32 chars > 30)** | `ASO_METINLERI_NEONSPACE.txt:32`, `KOPYALA_YAPISTIR_METINLER.txt:41` | Proposed title exceeds 30-char limit by 2 chars. Must adopt 26-char compliant title. | M2 (Gap / Polish) |
| F16 | Store (ASO) Titles | Codebase legacy branding ("Neon Galaxy" in `strings.xml`, `index.html`, `i18n.js`) | **Discrepancy (Legacy)** | `android/.../strings.xml:3,4`, `index.html:9`, `src/i18n.js:249,774` | Needs harmonization to "Neon Space Survivor" across native manifests. | M2 (Gap / Polish) |
| F17 | Marketing Trailer | 15-second high-action trailer (100 enemies exploding with massive lasers) | **Unaddressed / Missing** | Entire repository (`*.mp4`, `*.webm` = 0) | Gap identified: requires video capture, beat sheet script, and YouTube link. | M2 (Gap / Polish) |
| F18 | Marketing Visuals | High-density in-game combat screenshots vs fictitious 3D AI mockups | **Partially Implemented (Risk)** | `play_store_assets/04_Ekran_2_Savas.png`, `03_screenshot_1_hangar.png` | `04_Ekran_2_Savas.png` is too sparse (2 enemies); AI mockups violate store policies. | M2 (Gap / Polish) |
| F19 | Store Localization | Store metadata localization in high-grossing survivor markets (DE, FR, JA, ZH) | **Partially Implemented (Gap)** | `ASO_METINLERI_NEONSPACE.txt` (only TR & EN) | In-game supports 9 languages, but store listings only exist for TR and EN. | M2 (Gap / Polish) |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Survey & Technical Assessment | Survey codebase & store assets via 3 parallel Explorers mapping R1, R2, R3 | none | **DONE** |
| M2 | Master Gap Analysis & Polish Deliverable | Author comprehensive gap analysis report, comparison matrix, and prioritized actionable recommendations (`GAP_ANALYSIS_AND_POLISH_REPORT.md`) | M1 | **IN_PROGRESS** |
| M3 | Comprehensive Multi-Agent Verification & Audit | Reviewers, Challenger, and Forensic Auditor verification of report claims, citations, test accuracy, and compliance | M2 | **PLANNED** |

---

## Code Layout & Artifact Locations
- Master Gap Analysis Deliverable: `GAP_ANALYSIS_AND_POLISH_REPORT.md` (project root)
- Store Metadata: `ASO_METINLERI_NEONSPACE.txt`, `play_store_assets/`
- Gameplay Core: `src/game.js`, `src/enemies.js`, `src/balance.js`, `src/leaderboard.js`, `src/pool-manager.js`
- Test Suites: `tests/runner.js`, `tests/*.mjs`
- Native Mobile Configs: `android/app/src/main/AndroidManifest.xml`, `android/app/src/main/res/values/strings.xml`, `capacitor.config.json`
