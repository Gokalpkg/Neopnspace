// Tier 4 — Acceptance Validation Tests for Neon Space Survivor
// Verifies build output, package.json integrity, and exhaustive 9-language i18n completeness

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { i18nModule, catalogModule } from './harness.js';

const { TRANSLATIONS, SUPPORTED_LANGUAGES } = i18nModule;
const { CATALOG } = catalogModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export async function runTier4Tests() {
  const results = [];
  function test(name, fn) {
    try {
      fn();
      results.push({ name, pass: true });
    } catch (err) {
      results.push({ name, pass: false, error: err.message, stack: err.stack });
    }
  }

  // --------------------------------------------------------------------------
  // T4.1: Project Configuration & Package Integrity
  // --------------------------------------------------------------------------
  test('T4.1: package.json and project build configuration integrity', () => {
    const pkgPath = path.join(rootDir, 'package.json');
    assert.ok(fs.existsSync(pkgPath), 'package.json must exist in root');

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    assert.equal(pkg.name, 'neon-space-survivor', 'Package name must be neon-space-survivor');
    assert.ok(pkg.version, 'Package version must be defined');
    assert.equal(pkg.type, 'module', 'Package must use ES modules (type: module)');

    assert.ok(pkg.scripts, 'scripts object must exist');
    assert.ok(pkg.scripts.build, 'build script must exist');
    assert.ok(pkg.scripts.dev, 'dev script must exist');

    const viteConfig = path.join(rootDir, 'vite.config.js');
    assert.ok(fs.existsSync(viteConfig), 'vite.config.js must exist');

    const indexHtml = path.join(rootDir, 'index.html');
    assert.ok(fs.existsSync(indexHtml), 'index.html must exist');
  });

  // --------------------------------------------------------------------------
  // T4.2: Build Output Verification (dist/ bundle)
  // --------------------------------------------------------------------------
  test('T4.2: Build output dist directory contains production artifacts', () => {
    const distPath = path.join(rootDir, 'dist');
    assert.ok(fs.existsSync(distPath), 'dist/ directory must exist');

    const distIndex = path.join(distPath, 'index.html');
    assert.ok(fs.existsSync(distIndex), 'dist/index.html must exist');

    const assetsPath = path.join(distPath, 'assets');
    assert.ok(fs.existsSync(assetsPath), 'dist/assets directory must exist');

    const assetFiles = fs.readdirSync(assetsPath);
    const hasJs = assetFiles.some(f => f.endsWith('.js'));
    const hasCss = assetFiles.some(f => f.endsWith('.css'));

    assert.ok(hasJs, 'dist/assets must contain bundled JS files');
    assert.ok(hasCss, 'dist/assets must contain bundled CSS files');
  });

  // --------------------------------------------------------------------------
  // T4.3: 9 Supported Languages Definition Integrity
  // --------------------------------------------------------------------------
  test('T4.3: 9 Supported languages defined in SUPPORTED_LANGUAGES', () => {
    assert.ok(Array.isArray(SUPPORTED_LANGUAGES), 'SUPPORTED_LANGUAGES must be an array');
    assert.equal(SUPPORTED_LANGUAGES.length, 9, 'Exactly 9 languages must be supported');

    const expectedCodes = ['en-GB', 'tr-TR', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];
    const actualCodes = SUPPORTED_LANGUAGES.map(l => l.code);

    for (const code of expectedCodes) {
      assert.ok(actualCodes.includes(code), `Language ${code} must be present in SUPPORTED_LANGUAGES`);
      assert.ok(TRANSLATIONS[code], `TRANSLATIONS object must have dictionary for ${code}`);
    }
  });

  // --------------------------------------------------------------------------
  // T4.4: Milestone 1 Localization Completeness (FTUE, Modes, Graze)
  // --------------------------------------------------------------------------
  test('T4.4: Milestone 1 keys translated with 0 missing across all 9 languages', () => {
    const m1Keys = [
      'toast_storm_locked',
      'toast_mutator_locked',
      'toast_unlocked_celebration',
      'graze_callout',
      'ftue_overdrive_active'
    ];

    const langCodes = ['en-GB', 'tr-TR', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];
    const missing = [];

    for (const lang of langCodes) {
      const dict = TRANSLATIONS[lang] || {};
      for (const key of m1Keys) {
        const val = dict[key];
        if (!val || val.trim() === '') {
          missing.push(`${lang}.${key}`);
        }
      }
    }

    assert.equal(
      missing.length,
      0,
      `All Milestone 1 keys must be fully translated across all 9 languages. Missing: ${missing.join(', ')}`
    );
  });

  // --------------------------------------------------------------------------
  // T4.5: Language Purity (No untranslated Turkish characters in non-TR locales)
  // --------------------------------------------------------------------------
  test('T4.5: Non-Turkish language dictionaries contain no stray Turkish characters', () => {
    const nonTrLangs = ['en-GB', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];
    const allowedWords = ['Türkçe'];
    const strictlyTurkishOnly = /[ıİğĞşŞ]/;

    const violations = [];
    for (const lang of nonTrLangs) {
      const dict = TRANSLATIONS[lang] || {};
      for (const [key, val] of Object.entries(dict)) {
        if (typeof val !== 'string') continue;
        if (allowedWords.some(w => val.includes(w))) continue;
        if (strictlyTurkishOnly.test(val)) {
          violations.push(`${lang}.${key} = "${val}"`);
        }
      }
    }

    assert.equal(
      violations.length,
      0,
      `Non-Turkish dictionaries must not contain stray Turkish characters (found: ${violations.slice(0, 5).join(', ')})`
    );
  });

  // --------------------------------------------------------------------------
  // T4.6: Multi-Language Parity & Full Dictionary Audit
  // --------------------------------------------------------------------------
  test('T4.6: Multi-language parity audit across all 9 languages', () => {
    const enDict = TRANSLATIONS['en-GB'];
    assert.ok(enDict, 'English (en-GB) reference dictionary must exist');
    const enKeys = Object.keys(enDict);

    const otherLangs = ['tr-TR', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];
    const coverageStats = {};

    for (const lang of otherLangs) {
      const dict = TRANSLATIONS[lang] || {};
      let matched = 0;
      for (const key of enKeys) {
        if (dict[key] || (CATALOG[lang] && CATALOG[lang][key])) {
          matched++;
        }
      }
      coverageStats[lang] = `${matched}/${enKeys.length} (${((matched / enKeys.length) * 100).toFixed(1)}%)`;
      // Verify high coverage (> 85% baseline)
      assert.ok(matched / enKeys.length > 0.85, `${lang} translation coverage must exceed 85% (got ${matched}/${enKeys.length})`);
    }
  });

  // --------------------------------------------------------------------------
  // T4.7: Tech Workshop & Infinite Overclock Catalog Translation Coverage
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // T4.7: Tech Catalog Overclock 9-Language Localization
  // --------------------------------------------------------------------------
  test('T4.7: Tech Catalog overclock translations defined across all 9 languages in CATALOG and TRANSLATIONS', () => {
    const requiredOverclockKeys = [
      'tech_overclock_dmg_name',
      'tech_overclock_dmg_desc',
      'tech_overclock_def_name',
      'tech_overclock_def_desc',
      'tech_overclock_cry_name',
      'tech_overclock_cry_desc'
    ];

    const langCodes = ['en-GB', 'tr-TR', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];
    for (const lang of langCodes) {
      const dict = TRANSLATIONS[lang] || {};
      const cat = CATALOG[lang] || {};
      for (const k of requiredOverclockKeys) {
        const val = dict[k] || cat[k];
        assert.ok(val && val.length > 0, `Overclock key ${k} must exist in ${lang}`);
      }
    }
  });

  // --------------------------------------------------------------------------
  // T4.8: Milestone 2 Localization Completeness (Codex, Evolutions, Boss Reroll)
  // --------------------------------------------------------------------------
  test('T4.8: Milestone 2 keys translated with 0 missing across all 9 languages', () => {
    const m2CommonKeys = [
      'banner_boss_reroll',
      'tab_codex',
      'codex_title',
      'codex_subtitle',
      'codex_discovered',
      'codex_undiscovered',
      'codex_unknown',
      'codex_recipe',
      'codex_recipe_hint'
    ];
    const evoIds = [
      'vortex', 'cluster', 'ion_storm', 'bastion', 'cryo',
      'saws', 'supernova', 'matrix', 'hyper_plasma', 'void_drones'
    ];
    const m2RecipeKeys = [];
    for (const id of evoIds) {
      m2RecipeKeys.push(`codex_title_${id}`);
      m2RecipeKeys.push(`codex_desc_${id}`);
      m2RecipeKeys.push(`codex_lore_${id}`);
    }
    const allM2Keys = [...m2CommonKeys, ...m2RecipeKeys];
    const langCodes = ['en-GB', 'tr-TR', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];
    const missing = [];

    for (const lang of langCodes) {
      const dict = TRANSLATIONS[lang] || {};
      for (const key of allM2Keys) {
        const val = dict[key];
        if (!val || val.trim() === '') {
          missing.push(`${lang}.${key}`);
        }
      }
    }

    assert.equal(
      missing.length,
      0,
      `All Milestone 2 keys must be fully translated across all 9 languages. Missing: ${missing.join(', ')}`
    );
  });

  // --------------------------------------------------------------------------
  // T4.9: Milestone 3 Localization Completeness (Overclock, Star Ascension, Daily Mutators)
  // --------------------------------------------------------------------------
  test('T4.9: Milestone 3 keys translated with 0 missing across all 9 languages', () => {
    const m3Keys = [
      'tech_overclock_dmg_name',
      'tech_overclock_dmg_desc',
      'tech_overclock_def_name',
      'tech_overclock_def_desc',
      'tech_overclock_cry_name',
      'tech_overclock_cry_desc',
      'starup_btn',
      'starup_max',
      'starup_toast_success',
      'starup_toast_insufficient',
      'mutator_hyper_plasma_name',
      'mutator_hyper_plasma_desc',
      'mutator_glass_cannon_name',
      'mutator_glass_cannon_desc',
      'mutator_meteor_swarm_name',
      'mutator_meteor_swarm_desc',
      'mutator_boss_rush_name',
      'mutator_boss_rush_desc'
    ];
    const langCodes = ['en-GB', 'tr-TR', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];
    const missing = [];

    for (const lang of langCodes) {
      const dict = TRANSLATIONS[lang] || {};
      const cat = CATALOG[lang] || {};
      for (const key of m3Keys) {
        const val = dict[key] || cat[key];
        if (!val || val.trim() === '') {
          missing.push(`${lang}.${key}`);
        }
      }
    }

    assert.equal(
      missing.length,
      0,
      `All Milestone 3 keys must be fully translated across all 9 languages. Missing: ${missing.join(', ')}`
    );
  });

  return results;
}

if (process.argv[1] && process.argv[1].endsWith('tier4-acceptance.test.js')) {
  console.log('Running Tier 4 Tests directly...\n');
  const results = await runTier4Tests();
  let failed = 0;
  for (const r of results) {
    if (r.pass) console.log(`  [PASS] ${r.name}`);
    else { console.log(`  [FAIL] ${r.name} -> ${r.error}`); failed++; }
  }
  console.log(`\nResult: ${results.length - failed}/${results.length} passed.`);
  process.exit(failed > 0 ? 1 : 0);
}
