// ==============================================================================
// NEON SPACE SURVIVOR — V1.8.0 WEAPON REBALANCE & RELIC SHOWCASE TEST SUITE
// 1. Yan Silah Dengelemesi (Füzeler, EMP, Koruyucu Dronlar, Tesla)
// 2. Mini Sürü Patlamaları (Cosmic Swarmers 0 GC Nesne Havuzu)
// 3. Hangara "Kozmik Eserler (Relic) Koleksiyonu" Vitrini (20 Eser, Kalıcı Kayıt)
// 4. Sürüm 1.8.0, versionCode 58 & Sıfır Emoji Kuralı
// ==============================================================================

import './harness.js';
import assert from 'node:assert';
import fs from 'node:fs';
import { COSMIC_RELICS, RELIC_TIERS } from '../src/relics.js';
import { swarmerPool, PoolManager } from '../src/pool-manager.js';
import { Enemy } from '../src/enemies.js';
import { CATALOG } from '../src/catalog-i18n.js';

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
console.log(' NEON SPACE SURVIVOR — V1.8.0 WEAPON REBALANCE & RELIC SHOWCASE SUITE');
console.log('==============================================================================');

// --- 1. YAN SİLAH DENGELEMESİ ---
console.log('\n>>> [1] Yan Silah Dengelemesi (Füzeler, EMP, Dronlar, Tesla)');

runTest('W1.1: Güdümlü Mikro Füzeler taban hasarı ve atış sıklığı güçlendirildi', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  // Seviye 1 taban hasarı: (16 + 1 * 6.5) = 22.5 (önceden 7.7 idi!)
  assert.ok(gameSrc.includes('16 + this.player.upgrades.missiles * 6.5'), 'Füze taban hasarı güçlendirilmeli');
  assert.ok(gameSrc.includes('Math.max(48, 92 - this.player.upgrades.missiles * 12)'), 'Füze ateş aralığı sıklaştırılmalı');
});

runTest('W1.2: Güdümlü füzeler patlama yarıçapı ve mermi buharlaştırma alan hasarı uygular', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  assert.ok(gameSrc.includes('isClusterMissile ? 80 : 46') || (gameSrc.includes('spawnShockwave(mX, mY, \'#ff7700\', 46)') && gameSrc.includes('spawnShockwave(mX, mY, \'#ff3d00\', 80)')), 'Füze patlama şok dalgası tanımlı');
  assert.ok(gameSrc.includes('splashDmg = missile.damage * 0.75'), 'Standart füze çevre düşmanlara %75 alan hasarı saçmalı');
  assert.ok(gameSrc.includes('36 * 36'), 'Standart füze çarpışmada 36px yarıçaptaki düşman mermilerini buharlaştırmalı');
});

runTest('W1.3: EMP Şok Dalgası bekleme süresi 4.5 saniyeye (270 kare) çekildi ve sersemletme hissi güçlendirildi', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  assert.ok(gameSrc.includes('Math.max(160, 270 - (this.player.upgrades.emp - 1) * 40)'), 'EMP Seviye 1 aralığı 270 kare (4.5s) olmalı');
  assert.ok(gameSrc.includes('180 + this.player.upgrades.emp * 30'), 'EMP yarıçapı genişletilmeli (180px+)');
  assert.ok(gameSrc.includes('28 + this.player.upgrades.emp * 16'), 'EMP hasarı güçlendirilmeli (28+)');
  assert.ok(gameSrc.includes('enemy.slowTimer = 120 + this.player.upgrades.emp * 40'), 'EMP sersemletme / yavaşlatma süresi artırılmalı');
  assert.ok(gameSrc.includes('enemy.freezeTimer = 25'), 'EMP donma süresi en az 25 kare olmalı');
});

runTest('W1.4: Koruyucu Dronlar temel vuruş hasarı ve menzili artırıldı', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  assert.ok(gameSrc.includes('14 + this.player.upgrades.drones * 5.0'), 'Dron vuruş hasarı (14 + 5*seviye) olmalı');
  assert.ok(gameSrc.includes('minDist = 480'), 'Dron hedef arama menzili 480px olmalı');
  assert.ok(gameSrc.includes('maxRange: 820'), 'Dron mermi menzili 820px olmalı');
  assert.ok(gameSrc.includes('Math.max(30, 56 - this.player.upgrades.drones * 8)'), 'Dron atış sıklığı sıklaştırılmalı');
});

runTest('W1.5: Tesla Yıldırımı tetiklenme şansı, hasarı ve 230px sıçrama menzili güçlendirildi', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  assert.ok(gameSrc.includes('0.35 + this.player.upgrades.tesla * 0.12'), 'Tesla proc şansı %35 taban + %12/lvl olmalı');
  assert.ok(gameSrc.includes('9 + this.player.upgrades.tesla * 4.5'), 'Tesla hasarı (9 + 4.5*seviye) olmalı');
  assert.ok(gameSrc.includes('ed < 230'), 'Tesla ark sıçrama menzili 230px olmalı');
});

// --- 2. MİNİ SÜRÜ PATLAMALARI (COSMIC SWARMERS) ---
console.log('\n>>> [2] Mini Sürü Patlamaları (Cosmic Swarmers, 0 GC Pool)');

runTest('S2.1: SwarmerPool havuz yöneticisine entegre ve 0 GC ile mikro böcek üretir', () => {
  assert.ok(swarmerPool, 'swarmerPool singleton mevcut olmalı');
  assert.strictEqual(swarmerPool.capacity, 35, 'Havuz kapasitesi en az 35 olmalı');
  
  const swarmer = swarmerPool.acquire(150, 20, 1.0, 1.2);
  assert.ok(swarmer, 'Swarmer nesnesi edinildi');
  assert.strictEqual(swarmer.type, 'cosmic_swarmer');
  assert.strictEqual(swarmer.hp, 1, 'Tek vuruşluk 1 HP can');
  assert.strictEqual(swarmer.maxDamagePerHitRatio, 1.0, 'Tek vuruşta imha olmalı');
  assert.strictEqual(swarmer.isSwarmer, true);

  // Havuz salma kontrolü
  swarmerPool.release(swarmer);
  assert.strictEqual(swarmer.active, false);
  assert.strictEqual(swarmer.toRemove, true);
});

runTest('S2.2: Cosmic Swarmer organik sinüs dalgalı ve atik hareket eder', () => {
  const swarmer = swarmerPool.acquire(200, 50, 1.0, 1.0);
  const initialX = swarmer.x;
  const initialY = swarmer.y;
  swarmer.update(200, 600, [], 400, 800, 2.0);
  assert.notStrictEqual(swarmer.x, initialX, 'X koordinatı sinüs hareketiyle oynamalı');
  assert.ok(swarmer.y > initialY, 'Y koordinatı aşağı akmalı');
  swarmerPool.release(swarmer);
});

runTest('S2.3: game.js içinde her 18-24 saniyede bir 20-25 adetlik sürü patlaması tetiklenir', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  assert.ok(gameSrc.includes('spawnCosmicSwarmBurst()'), 'spawnCosmicSwarmBurst fonksiyonu tanımlı olmalı');
  assert.ok(gameSrc.includes('20 + Math.floor(Math.random() * 6)'), '20-25 adet mikro parazit üretilmeli');
  assert.ok(gameSrc.includes('this.nextSwarmTime = this.gameTime + 18 + Math.random() * 6') || gameSrc.includes('this.nextSwarmTime = 18 + Math.random() * 6'), '18-24 saniye aralığında tetiklenmeli');
});

// --- 3. HANGARDA KOZMİK ESERLER (RELIC) KOLEKSİYONU VİTRİNİ ---
console.log('\n>>> [3] Hangara "Kozmik Eserler Koleksiyonu" Vitrini');

runTest('R3.1: index.html içinde #codex-relics-grid ve alt sekme butonları mevcut', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.ok(html.includes('id="btn-codex-subtab-evolutions"'), 'Silah evrimleri alt sekme butonu bulunmalı');
  assert.ok(html.includes('id="btn-codex-subtab-relics"'), 'Kozmik eserler alt sekme butonu bulunmalı');
  assert.ok(html.includes('id="codex-relics-grid"'), 'id="codex-relics-grid" bulunmalı');
});

runTest('R3.2: renderCodex 20 eseri listeler, keşfedilenler parıldayan kart, kilitliler siluet görünür', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  assert.ok(gameSrc.includes('getDiscoveredRelics()'), 'getDiscoveredRelics fonksiyonu tanımlı olmalı');
  assert.ok(gameSrc.includes('recordDiscoveredRelic('), 'recordDiscoveredRelic fonksiyonu tanımlı olmalı');
  assert.ok(gameSrc.includes('localStorage.getItem(\'neon_discovered_relics\')'), 'neon_discovered_relics localStorage senkronizasyonu olmalı');
  assert.ok(gameSrc.includes('relic-codex-card'), 'relic-codex-card sınıfı oluşturulmalı');
  assert.ok(gameSrc.includes('COSMIC_RELICS.forEach('), '20 kozmik eser döngüyle listelenmeli');
});

runTest('R3.3: acquireRelic eseri anında neon_discovered_relics içine kaydeder', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  assert.ok(gameSrc.includes('this.recordDiscoveredRelic(relic.id)'), 'Eser alındığında kalıcı keşfe yazılmalı');
});

runTest('R3.4: Sürüm 1.8.1 ve versionCode 59 senkronizasyonu', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.strictEqual(pkg.version, '1.8.1', 'package.json version 1.8.1 olmalı');

  const gradle = fs.readFileSync('android/app/build.gradle', 'utf8');
  assert.ok(gradle.includes('versionCode 59'), 'build.gradle versionCode 59 olmalı');
  assert.ok(gradle.includes('versionName "1.8.1"'), 'build.gradle versionName 1.8.1 olmalı');

  const html = fs.readFileSync('index.html', 'utf8');
  assert.ok(html.includes('v1.8.1'), 'index.html v1.8.1 metni güncel olmalı');
});

runTest('R3.5: Sıfır Unicode Emoji kuralı tüm yeni özellik ve çevirilerde sağlandı', () => {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  ['src/relics.js', 'src/pool-manager.js', 'src/enemies.js'].forEach(f => {
    const txt = fs.readFileSync(f, 'utf8');
    assert.ok(!emojiRegex.test(txt), `${f} içinde emoji tespit edildi!`);
  });

  const langs = Object.keys(CATALOG);
  langs.forEach(lang => {
    Object.keys(CATALOG[lang]).forEach(k => {
      if (k.startsWith('relic_') || k.startsWith('codex_') || k.startsWith('float_cosmic_')) {
        const str = String(CATALOG[lang][k] || '');
        assert.ok(!emojiRegex.test(str), `Emoji tespit edildi: ${lang} -> ${k}: ${str}`);
      }
    });
  });
});

runTest('S2.4: Kaçan Cosmic Swarmer gezegen bariyer hasarı vermez ve komboyu bozmaz', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  assert.ok(gameSrc.includes('!enemy.isSwarmer && enemy.type !== \'cosmic_swarmer\' && !enemy.isIndestructible'), 'Bariyer kaçış kontrolünden swarmer muaf tutulmalı');
  assert.ok(gameSrc.includes('if (enemy && (enemy.isSwarmer || enemy.type === \'cosmic_swarmer\' || enemy.type === \'swarmer\')) return;'), 'handleEnemyEscaped içinde swarmer bariyere zarar vermemeli');
});

runTest('S2.5: Swarmer öldüğünde/kaçtığında swarmerPool.release ile havuza döner ve kirli durum temizlenir', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  assert.ok(gameSrc.includes('swarmerPool.release(enemy)'), 'Düşman öldüğünde/silindiğinde swarmerPool.release çağrılmalı');

  // Havuz kirli durum sıfırlama kontrolü
  const s1 = swarmerPool.acquire(100, 100, 1.0, 1.0);
  s1.barrierHit = true;
  s1.frozen = 60;
  s1.slowTimer = 90;
  swarmerPool.release(s1);

  const s2 = swarmerPool.acquire(150, 150, 1.0, 1.0);
  assert.strictEqual(s2.barrierHit, false, 'Geri dönüştürülen swarmer barrierHit sıfırlanmalı');
  assert.strictEqual(s2.frozen, 0, 'Geri dönüştürülen swarmer frozen sıfırlanmalı');
  assert.strictEqual(s2.slowTimer, 0, 'Geri dönüştürülen swarmer slowTimer sıfırlanmalı');
  swarmerPool.release(s2);
});

runTest('W1.6: Dron mermisi vurduğunda hasar istatistiği drones silahına yazılır', () => {
  const gameSrc = fs.readFileSync('src/game.js', 'utf8');
  assert.ok(gameSrc.includes('const weaponKey = bullet.isDroneShot ? \'drones\' : (bullet.isMissile ? \'missiles\' : \'laser\');'), 'Mermi hasarı doğru silaha kaydedilmeli');
});

runTest('A1.1: Çoklu sürü imhasında playComboStreak ses kanalı taşmasını önleyecek şekilde kısıtlanır', () => {
  const audioSrc = fs.readFileSync('src/audio.js', 'utf8');
  assert.ok(audioSrc.includes('_lastComboStreakTime') && audioSrc.includes('0.035'), 'playComboStreak ses kısıtlaması (throttling) mevcut olmalı');
});

console.log('==============================================================================');
console.log(` SUMMARY: ${passedCount}/${passedCount + failedCount} passed (${failedCount} failed)`);
console.log('==============================================================================');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('SUCCESS: All V1.8.0 Weapon Rebalance & Relic Showcase tests passed flawlessly!');
}
