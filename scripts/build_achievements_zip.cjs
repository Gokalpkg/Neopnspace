const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const achDir = path.join(__dirname, '..', 'play_store_assets', 'achievements');
const zipPath = path.join(__dirname, '..', 'play_store_assets', 'NeonSpace_Achievements_Import.zip');

const LIST = [
  // 1. Kategori: İlk Adımlar
  { key: 'first_flight', name: 'Kozmik Ateşleme', desc: 'Neon Space\'te ilk uzay uçuşuna başla.', inc: 'False', steps: '', state: 'Revealed', pts: 10 },
  { key: 'first_blood', name: 'İlk Kan', desc: 'Herhangi bir türde ilk düşman gemisini imha et.', inc: 'False', steps: '', state: 'Revealed', pts: 10 },
  { key: 'first_upgrade', name: 'Gelişmiş Donanım', desc: 'Seviye atlayarak ilk silah yükseltme kartını seç.', inc: 'False', steps: '', state: 'Revealed', pts: 15 },
  { key: 'boss_vanguard', name: 'Öncü Tehdit', desc: 'İlk boss olan Öncü Komutan\'ı mağlup et.', inc: 'False', steps: '', state: 'Revealed', pts: 25 },
  { key: 'crystal_magnet', name: 'Kozmik Mıknatıs', desc: 'Tek bir seferde en az 100 Kristal topla.', inc: 'False', steps: '', state: 'Revealed', pts: 15 },

  // 2. Kategori: Artımlı Maratonlar
  { key: 'kills_500', name: 'Uzay Temizliği I', desc: 'Toplam 500 düşman gemisi yok et.', inc: 'True', steps: '500', state: 'Revealed', pts: 20 },
  { key: 'kills_2500', name: 'Uzay Temizliği II', desc: 'Toplam 2500 düşman gemisi yok et.', inc: 'True', steps: '2500', state: 'Revealed', pts: 40 },
  { key: 'kills_10000', name: 'Uzay Temizliği III', desc: 'Toplam 10000 düşman gemisi yok et.', inc: 'True', steps: '10000', state: 'Revealed', pts: 100 },
  { key: 'crystals_1000', name: 'Kristal Madencisi I', desc: 'Toplam 1000 Kristal topla.', inc: 'True', steps: '1000', state: 'Revealed', pts: 20 },
  { key: 'crystals_10000', name: 'Kristal Madencisi II', desc: 'Toplam 10000 Kristal topla.', inc: 'True', steps: '10000', state: 'Revealed', pts: 50 },
  { key: 'crystals_50000', name: 'Kristal Zengini III', desc: 'Toplam 50000 Kristal topla.', inc: 'True', steps: '50000', state: 'Revealed', pts: 100 },
  { key: 'pilot_level_50', name: 'Kıdemli Pilot', desc: 'Oyunda toplam 50 seviye atla.', inc: 'True', steps: '50', state: 'Revealed', pts: 35 },
  { key: 'asteroids_300', name: 'Göktaşı Kırıcı', desc: 'Toplam 300 asteroid imha et.', inc: 'True', steps: '300', state: 'Revealed', pts: 30 },

  // 3. Kategori: Sektör ve Boss Hakimiyeti
  { key: 'boss_dreadnought', name: 'Karanlığın Sonu', desc: 'Sektör 1 Boss\'u Kara Muhafız\'ı alt et.', inc: 'False', steps: '', state: 'Revealed', pts: 30 },
  { key: 'boss_nebula', name: 'Nebula Körlüğü', desc: 'Sektör 2 Boss\'u Nebula Gözcüsü\'nü darmadağın et.', inc: 'False', steps: '', state: 'Revealed', pts: 40 },
  { key: 'boss_titan', name: 'Demir Kıran', desc: 'Sektör 3 Boss\'u Demir Titan\'ı hurdaya çevir.', inc: 'False', steps: '', state: 'Revealed', pts: 50 },
  { key: 'boss_chrono', name: 'Zaman Hırsızı', desc: 'Sektör 4 Boss\'u Kronos Hükümdarı\'nı bozguna uğrat.', inc: 'False', steps: '', state: 'Revealed', pts: 70 },
  { key: 'boss_apex', name: 'Boyut Hakimi', desc: 'Zirve Boss Kuantum Apex\'i mağlup et ve galaksiyi kurtar.', inc: 'False', steps: '', state: 'Revealed', pts: 150 },

  // 4. Kategori: Hangar, Filo ve Atölye
  { key: 'ship_unlock_2', name: 'Yeni Bir Kanat', desc: 'Hangardan ikinci uzay gemini satın al.', inc: 'False', steps: '', state: 'Revealed', pts: 25 },
  { key: 'fleet_commander', name: 'Filo Komutanı', desc: 'Tüm gemilerin kilidini aç.', inc: 'False', steps: '', state: 'Revealed', pts: 100 },
  { key: 'tech_master', name: 'Mühendislik Harikası', desc: 'Atölyede herhangi bir yükseltmeyi Seviye 10\'a ulaştır.', inc: 'False', steps: '', state: 'Revealed', pts: 60 },
  { key: 'ship_5star', name: 'Yıldız Yağmuru', desc: 'Herhangi bir gemini 5 Yıldız rütbesine yükselt.', inc: 'False', steps: '', state: 'Revealed', pts: 75 },
  { key: 'wheel_10', name: 'Şanslı Pilot', desc: 'Çarkıfeleği 10 kez çevir.', inc: 'True', steps: '10', state: 'Revealed', pts: 25 },

  // 5. Kategori: Beceri, Kombo ve Hayatta Kalma
  { key: 'graze_master', name: 'Refleks Ustası', desc: 'Tek bir koşuda en az 50 mermiyi teğet geç.', inc: 'False', steps: '', state: 'Revealed', pts: 35 },
  { key: 'combo_50', name: 'Durdurulamaz Kombo', desc: 'Kombo sayacını 50x seviyesine ulaştır.', inc: 'False', steps: '', state: 'Revealed', pts: 50 },
  { key: 'storm_survivor', name: 'Fırtına Süvarisi', desc: 'Fırtına Modunda tek bir koşuda 5 dakika hayatta kal.', inc: 'False', steps: '', state: 'Revealed', pts: 65 },
  { key: 'hyper_slayer', name: 'Hiper Tehdit', desc: 'Hiper Dalga etkinken bir Boss yenilgiye uğrat.', inc: 'False', steps: '', state: 'Revealed', pts: 80 },
  { key: 'flawless_victory', name: 'Kusursuz Zafer', desc: 'Hiç hasar almadan bir boss savaşını tamamla.', inc: 'False', steps: '', state: 'Revealed', pts: 100 },

  // 6. Kategori: Gizli Başarımlar
  { key: 'edge_of_death', name: 'Ölümün Kıyısında', desc: 'Canın yüzde 5\'in altındayken bir dalgayı sağ salim bitir.', inc: 'False', steps: '', state: 'Hidden', pts: 40 },
  { key: 'pacifist_run', name: 'Pasifist Manevra', desc: 'Bir koşunun ilk 40 saniyesinde hiç ateş etmeden hayatta kal.', inc: 'False', steps: '', state: 'Hidden', pts: 50 },
  { key: 'overload_combo', name: 'Aşırı Yükleme', desc: 'Aynı anda hem Overdrive\'ı hem de bir Şans Sandığı\'nı tetikle.', inc: 'False', steps: '', state: 'Hidden', pts: 45 },
  { key: 'time_freeze_12', name: 'Zamanı Durduran', desc: 'Chrono Apex süpernovası ile aynı anda en az 12 düşmanı dondur.', inc: 'False', steps: '', state: 'Hidden', pts: 75 }
];

const metaLines = [];
const iconLines = [];

LIST.forEach((item, idx) => {
  const order = idx + 1;
  const iconFile = `${String(order).padStart(2, '0')}_${item.key}.png`;
  metaLines.push(`${item.name},${item.desc},${item.inc},${item.steps},${item.state},${item.pts},${order}`);
  iconLines.push(`${item.name},${iconFile}`);
});

fs.writeFileSync(path.join(achDir, 'AchievementsMetadata.csv'), metaLines.join('\n') + '\n', 'utf8');
fs.writeFileSync(path.join(achDir, 'AchievementsIconsMappings.csv'), iconLines.join('\n') + '\n', 'utf8');
fs.writeFileSync(path.join(achDir, 'AchievementsLocalizations.csv'), '', 'utf8');

if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

execSync(`powershell -Command "Compress-Archive -Path '${achDir}\\*' -DestinationPath '${zipPath}' -Force"`);
console.log('Created bulk import ZIP at:', zipPath);
