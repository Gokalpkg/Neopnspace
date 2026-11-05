// ==============================================================================
// NEON SPACE SURVIVOR — 5 PILLARS OVERHAUL COMPREHENSIVE TEST SUITE
// Sütun 1: Relic / Kozmik Eserler Sistemi (20 Pasif Eser, Drafting, Mekanikler)
// Sütun 2: Boss Phase 2 & Kırılabilir Zırh / Açık Çekirdek (2.5x Crit)
// Sütun 3: Vuruş Hissi & Sub-Bass Audio & Yüzen Metalik Enkaz
// Sütun 4: Arena & Manevra Özgürlüğü (62% Dikey Alan, Çapraz Flanker / Alt Süpürme)
// Sütun 5: Performans & 120 FPS Glow Cache & Sıfır Emoji Doğrulaması
// ==============================================================================

import './harness.js';
import assert from 'node:assert';
import fs from 'node:fs';
import { COSMIC_RELICS, RELIC_TIERS, getRandomRelicChoices } from '../src/relics.js';
import { CATALOG } from '../src/catalog-i18n.js';
import { sounds } from '../src/audio.js';
import { Enemy } from '../src/enemies.js';
import { drawCachedNeonGlow, ParticleSystem } from '../src/particles.js';
import { particleDebrisPool } from '../src/pool-manager.js';

let passedCount = 0;
let failedCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  [FAIL] ${name}:`, err.message);
    failedCount++;
  }
}

console.log('==============================================================================');
console.log(' NEON SPACE SURVIVOR — 5 PILLARS COMPREHENSIVE VERIFICATION SUITE');
console.log('==============================================================================');

console.log('\n>>> [SÜTUN 1] Relic / Kozmik Eserler Sistemi & 20 Pasif Eser');

runTest('S1.1: 20 Benzersiz Kozmik Eser Tanımlı ve Rarity Skorları Dengeli', () => {
  assert.strictEqual(COSMIC_RELICS.length, 20, '20 benzersiz eser tanımlı olmalı');
  const ids = new Set();
  COSMIC_RELICS.forEach(r => {
    assert.ok(r.id, 'Relic id bulunmalı');
    assert.ok(!ids.has(r.id), `Tekrarlanan relic id: ${r.id}`);
    ids.add(r.id);
    assert.ok(['rare', 'legendary', 'cosmic'].includes(r.tier), `Geçerli tier: ${r.tier}`);
    assert.ok(r.color.startsWith('#'), 'Geçerli hex renk kodu');
    assert.ok(r.nameKey && r.descKey, 'i18n keyleri mevcut');
    assert.ok(r.rarityScore > 0, 'Rarity score pozitif olmalı');
  });
});

runTest('S1.2: getRandomRelicChoices Sahip Olunmayan 3 Rastgele Eser Döndürür', () => {
  const activeRelics = { reactive_overload: true, quantum_mirror: true };
  const choices = getRandomRelicChoices(activeRelics, 3);
  assert.strictEqual(choices.length, 3, '3 seçenek üretilmeli');
  choices.forEach(c => {
    assert.ok(!activeRelics[c.id], `Sahip olunan eser seçeneklerde çıkmamalı: ${c.id}`);
  });
  // Tüm eserler alınmışsa boş dönmeli
  const allRelics = {};
  COSMIC_RELICS.forEach(r => { allRelics[r.id] = true; });
  const emptyChoices = getRandomRelicChoices(allRelics, 3);
  assert.strictEqual(emptyChoices.length, 0, 'Tüm eserler alınmışsa boş dönmeli');
});

runTest('S1.3: Tüm Desteklenen Dillerde 20 Eserin Adı ve Açıklaması Eksiksiz Tanımlı', () => {
  const langs = Object.keys(CATALOG);
  assert.ok(langs.length >= 7, 'En az 7 dil kataloğu mevcut olmalı');
  COSMIC_RELICS.forEach(r => {
    langs.forEach(lang => {
      assert.ok(CATALOG[lang][r.nameKey], `Eksik ad çevirisi: ${lang} -> ${r.nameKey}`);
      assert.ok(CATALOG[lang][r.descKey], `Eksik açıklama çevirisi: ${lang} -> ${r.descKey}`);
    });
  });
  // Modal başlıkları kontrolü
  langs.forEach(lang => {
    assert.ok(CATALOG[lang]['relic_modal_title'], `Eksik relic_modal_title: ${lang}`);
    assert.ok(CATALOG[lang]['relic_modal_subtitle'], `Eksik relic_modal_subtitle: ${lang}`);
    assert.ok(CATALOG[lang]['relic_modal_hint'], `Eksik relic_modal_hint: ${lang}`);
  });
});

runTest('S1.4: index.html İçinde #relic-modal ve #hud-relics-strip DOM Elemanları Mevcut', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.ok(html.includes('id="relic-modal"'), 'id="relic-modal" bulunmalı');
  assert.ok(html.includes('id="relic-cards-container"'), 'id="relic-cards-container" bulunmalı');
  assert.ok(html.includes('id="hud-relics-strip"'), 'id="hud-relics-strip" bulunmalı');
});

runTest('S1.5: src/game.js İçinde Relic Drafting ve Tetikleyicileri Entegre', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  assert.ok(gameSrc.includes('triggerRelicDraft()'), 'triggerRelicDraft() tanımlı olmalı');
  assert.ok(gameSrc.includes('acquireRelic(relic)'), 'acquireRelic() tanımlı olmalı');
  assert.ok(gameSrc.includes('updateRelicsHUD()'), 'updateRelicsHUD() tanımlı olmalı');
  assert.ok(gameSrc.includes('spawnGrazeMines('), 'spawnGrazeMines() tanımlı olmalı');
  assert.ok(gameSrc.includes('this.triggerRelicDraft();'), 'Boss ve elit zaferlerinde draft tetiklenmeli');
});

console.log('\n>>> [SÜTUN 2] Boss Phase 2 Yıkım & Kırılabilir Zırh / Açık Çekirdek (2.5x Crit)');

runTest('S2.1: Boss HP <= 45% İken Phase 2 Enrage & Renk Değişimi Tetiklenir', () => {
  const boss = new Enemy(200, 100, 'boss_dreadnought', 1.0, 1.0);
  assert.strictEqual(boss.phase, 1, 'Başlangıçta faz 1');
  assert.strictEqual(boss.justEnraged, false);
  
  // HP %40'a düşürülüyor
  boss.hp = boss.maxHp * 0.40;
  boss.update(200, 500, [], 400, 800, 1.0);
  
  assert.strictEqual(boss.phase, 2, 'Faz 2 aktif olmalı');
  assert.strictEqual(boss.justEnraged, true, 'justEnraged bayrağı kaldırılmalı');
  assert.strictEqual(boss.color, '#ff1744', 'Öfkeli renk atanmalı');
});

runTest('S2.2: Boss Silah Podları ve Zırh Plakaları Kırılınca coreExposed Aktif Olur', () => {
  const boss = new Enemy(200, 100, 'boss_dreadnought', 1.0, 1.0);
  assert.strictEqual(boss.coreExposed, false, 'Başlangıçta çekirdek kapalı');
  boss.leftPodDestroyed = true;
  boss.update(200, 500, [], 400, 800, 1.0);
  assert.strictEqual(boss.coreExposed, true, 'Pod yok edildiğinde çekirdek açığa çıkmalı');
});

runTest('S2.3: Açık Çekirdeğe Vuruş 2.5x Kritik Hasar Çarpanı Alır', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  assert.ok(gameSrc.includes('hitDamage *= 2.5;'), 'Açık çekirdeğe 2.5x hasar çarpanı uygulanmalı');
  assert.ok(gameSrc.includes('CORE CRIT x2.5!'), 'Çekirdek kritik vuruş görsel geribildirimi mevcut olmalı');
});

console.log('\n>>> [SÜTUN 3] Vuruş Hissi & Sub-Bass Audio & Yüzen Metalik Enkaz');

runTest('S3.1: src/audio.js Sub-Bass Frekans Ramping ve Acil Durum Sireni İle Güçlendirildi', () => {
  assert.ok(typeof sounds.playEmergencySiren === 'function', 'playEmergencySiren tanımlı');
  assert.ok(typeof sounds.playHeavyLaser === 'function', 'playHeavyLaser tanımlı');
  assert.ok(typeof sounds.playRelicAcquire === 'function', 'playRelicAcquire tanımlı');
  const audioSrc = fs.readFileSync('src/audio.js', 'utf8');
  assert.ok(audioSrc.includes('exponentialRampToValueAtTime(24'), 'Laser sub-bass frekans rampası mevcut');
  assert.ok(audioSrc.includes('exponentialRampToValueAtTime(20'), 'Explosion sub-bass frekans rampası mevcut');
});

runTest('S3.2: spawnDebris 3-4s Kalıcı Yüzen Metalik Parçalar ve Parıltılı Şarapneller Üretir', () => {
  const ps = new ParticleSystem();
  ps.spawnDebris(100, 100, '#00f0ff', 6);
  assert.ok(particleDebrisPool.getActiveCount() > 0, 'Parçacık havuzunda aktif enkaz bulunmalı');
  let foundMetallic = false;
  let foundShard = false;
  const activeList = particleDebrisPool.pool.filter(p => p.active);
  assert.ok(activeList.length > 0, 'Aktif enkaz elemanları mevcut');
  activeList.forEach(p => {
    assert.ok(p.decay <= 0.0055 && p.decay >= 0.0035, 'Enkaz decay oranı 3-4 saniye ömür sağlamalı');
    if (p.shapeType === 0) foundMetallic = true;
    if (p.shapeType === 1) foundShard = true;
  });
  assert.ok(foundMetallic, 'Metalik plaka enkazı üretildi');
  assert.ok(foundShard, 'Parıltılı neon şarapnel üretildi');
});

console.log('\n>>> [SÜTUN 4] Arena & Manevra Özgürlüğü');

runTest('S4.1: Oyuncu Dikey Hareket Alanı Ekran Yüksekliğinin %62\'sine Genişletildi', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  assert.ok(gameSrc.includes('const minY = Math.max(36, this.height * 0.38);'), 'minY ekran yüksekliğinin %38 üst sınırına ayarlandı');
});

runTest('S4.2: Çapraz Flanker ve Alt Süpürme Düşmanları Ekranı Doğru Gezinir', () => {
  const flanker = new Enemy(-20, 200, 'scout', 1.0, 2.0);
  flanker.isSideFlanker = true;
  flanker.speedX = 2.0;
  flanker.speedY = 0.5;
  flanker.update(200, 600, [], 400, 800, 1.0);
  assert.ok(flanker.x > -20, 'Flanker yatay hareket etti');
  
  const sweeper = new Enemy(300, 820, 'scout', 1.0, 1.5);
  sweeper.isLowerSweep = true;
  sweeper.speedY = -2.0;
  sweeper.update(200, 600, [], 400, 800, 1.0);
  assert.ok(sweeper.y < 820, 'Alt süpürme yukarı doğru tarama yaptı');
});

console.log('\n>>> [SÜTUN 5] Performans & 120 FPS Optimizasyonu');

runTest('S5.1: drawCachedNeonGlow Offscreen Canvas Önbelleğini Kullanır (0 GC)', () => {
  assert.ok(typeof drawCachedNeonGlow === 'function', 'drawCachedNeonGlow fonksiyonu export edilmiş');
  const particlesSrc = fs.readFileSync('src/particles.js', 'utf8');
  assert.ok(particlesSrc.includes('neonGlowCache.get(key)'), 'Offscreen canvas Map önbelleği kullanılıyor');
});

runTest('S5.2: Tüm Yeni Relic ve Banner Metinlerinde Sıfır Unicode Emoji Kuralı Sağlandı', () => {
  const relicSrc = fs.readFileSync('src/relics.js', 'utf8');
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert.ok(!emojiRegex.test(relicSrc), 'relics.js içinde emoji bulunmamalı');
  // Yeni eklenen relic_* çevirilerinde emoji kontrolü
  Object.keys(CATALOG).forEach(lang => {
    Object.keys(CATALOG[lang]).forEach(k => {
      if (k.startsWith('relic_') || k.startsWith('banner_boss_enraged')) {
        const str = CATALOG[lang][k];
        assert.ok(!emojiRegex.test(str), `Emoji tespit edildi: ${lang} -> ${k}: ${str}`);
      }
    });
  });
});

console.log('==============================================================================');
console.log(` SUMMARY: ${passedCount}/${passedCount + failedCount} passed (${failedCount} failed)`);
console.log('==============================================================================');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('SUCCESS: All 5 Pillars overhaul tests passed flawlessly!');
}
