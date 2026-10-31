import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDgWd0zp7rVdM9tw-YS7vIam009uuopwqo",
  authDomain: "neon-space-survivor.firebaseapp.com",
  projectId: "neon-space-survivor",
  storageBucket: "neon-space-survivor.firebasestorage.app",
  messagingSenderId: "871503811212",
  appId: "1:871503811212:web:197e8e82e7da898606e1a9",
  measurementId: "G-YV36V0764F"
};

export const PGS_CONFIG = {
  projectId: "871503811212",
  leaderboards: {
    storm: "CgkIjKWzza4ZEAIQAA",
    campaign: "CgkIjKWzza4ZEAIQAQ"
  },
  // Google Play Console Achievements (Başarımlar - Canlı Üretim Kimlikleri)
  achievements: {
    // 1. Kategori: İlk Adımlar (1 saat içinde açılanlar)
    first_flight: "CgkIjKWzza4ZEAIQDQ",     // Kozmik Ateşleme (10 Puan)
    first_blood: "CgkIjKWzza4ZEAIQEw",      // İlk Kan (10 Puan)
    first_upgrade: "CgkIjKWzza4ZEAIQFg",    // Gelişmiş Donanım (15 Puan)
    boss_vanguard: "CgkIjKWzza4ZEAIQEA",    // Öncü Tehdit (25 Puan)
    crystal_magnet: "CgkIjKWzza4ZEAIQBw",   // Kozmik Mıknatıs (15 Puan)

    // 2. Kategori: Artımlı Maratonlar (Incremental)
    kills_500: "CgkIjKWzza4ZEAIQFw",       // Uzay Temizliği I (20 Puan)
    kills_2500: "CgkIjKWzza4ZEAIQDg",      // Uzay Temizliği II (40 Puan)
    kills_10000: "CgkIjKWzza4ZEAIQGw",     // Uzay Temizliği III (100 Puan)
    crystals_1000: "CgkIjKWzza4ZEAIQFQ",   // Kristal Madencisi I (20 Puan)
    crystals_10000: "CgkIjKWzza4ZEAIQAg",  // Kristal Madencisi II (50 Puan)
    crystals_50000: "CgkIjKWzza4ZEAIQIA",  // Kristal Zengini III (100 Puan)
    pilot_level_50: "CgkIjKWzza4ZEAIQGA",  // Kıdemli Pilot (35 Puan)
    asteroids_300: "CgkIjKWzza4ZEAIQDw",   // Göktaşı Kırıcı (30 Puan)

    // 3. Kategori: Sektör & Boss Hakimiyeti
    boss_dreadnought: "CgkIjKWzza4ZEAIQHQ",// Karanlığın Sonu (30 Puan)
    boss_nebula: "CgkIjKWzza4ZEAIQAw",     // Nebula Körlüğü (40 Puan)
    boss_titan: "CgkIjKWzza4ZEAIQBQ",      // Demir Kıran (50 Puan)
    boss_chrono: "CgkIjKWzza4ZEAIQBA",     // Zaman Hırsızı (70 Puan)
    boss_apex: "CgkIjKWzza4ZEAIQEQ",       // Boyut Hakimi (150 Puan)

    // 4. Kategori: Hangar, Filo & Atölye
    ship_unlock_2: "CgkIjKWzza4ZEAIQGg",   // Yeni Bir Kanat (25 Puan)
    fleet_commander: "CgkIjKWzza4ZEAIQCg", // Filo Komutanı (100 Puan)
    tech_master: "CgkIjKWzza4ZEAIQHg",     // Mühendislik Harikası (60 Puan)
    ship_5star: "CgkIjKWzza4ZEAIQBg",      // Yıldız Yağmuru (75 Puan)
    wheel_10: "CgkIjKWzza4ZEAIQDA",        // Şanslı Pilot (25 Puan)

    // 5. Kategori: Beceri, Kombo & Hayatta Kalma
    graze_master: "CgkIjKWzza4ZEAIQCA",    // Refleks Ustası (35 Puan)
    combo_50: "CgkIjKWzza4ZEAIQHA",        // Durdurulamaz Kombo (50 Puan)
    storm_survivor: "CgkIjKWzza4ZEAIQGQ",  // Fırtına Süvarisi (65 Puan)
    hyper_slayer: "CgkIjKWzza4ZEAIQHw",    // Hiper Tehdit (80 Puan)
    flawless_victory: "CgkIjKWzza4ZEAIQEg",// Kusursuz Zafer (100 Puan)

    // 6. Kategori: Gizli Başarımlar (Hidden)
    edge_of_death: "CgkIjKWzza4ZEAIQFA",   // Ölümün Kıyısında (40 Puan)
    pacifist_run: "CgkIjKWzza4ZEAIQCw",    // Pasifist Manevra (50 Puan)
    overload_combo: "CgkIjKWzza4ZEAIQIQ",  // Aşırı Yükleme (45 Puan)
    time_freeze_12: "CgkIjKWzza4ZEAIQCQ"   // Zamanı Durduran (75 Puan)
  }
};

/**
 * Google Play Games Başarımını Kilidini Açar (Unlock)
 * Hem doğrudan ID hem de semantik anahtar (örn: 'first_flight') destekler.
 */
export function unlockPlayGamesAchievement(keyOrId) {
  if (!keyOrId) return;
  const achId = (PGS_CONFIG.achievements && PGS_CONFIG.achievements[keyOrId]) || keyOrId;
  const cacheKey = 'neon_pgs_ach_' + keyOrId;

  // Çevrimdışı / mükerrer çağrı engelleme
  if (localStorage.getItem(cacheKey) === 'true') return;

  console.log(`[PGS Achievement] Unlocking: ${keyOrId} -> ${achId}`);

  if (window.Capacitor && window.Capacitor.isNativePlatform) {
    const pg = window.PlayGames || window.Capacitor?.Plugins?.PlayGames;
    if (pg) {
      try {
        if (typeof pg.unlockAchievement === 'function') {
          pg.unlockAchievement({ achievementId: achId });
        } else if (typeof pg.unlock === 'function') {
          pg.unlock({ achievementId: achId });
        }
      } catch (err) {
        console.warn('[PGS Achievement] Native unlock error:', err);
      }
    }
  }

  try {
    localStorage.setItem(cacheKey, 'true');
  } catch (e) {}
}

/**
 * Google Play Games Artımlı Başarımını İlerletir (Increment)
 */
export function incrementPlayGamesAchievement(keyOrId, steps = 1) {
  if (!keyOrId) return;
  const achId = (PGS_CONFIG.achievements && PGS_CONFIG.achievements[keyOrId]) || keyOrId;

  if (window.Capacitor && window.Capacitor.isNativePlatform) {
    const pg = window.PlayGames || window.Capacitor?.Plugins?.PlayGames;
    if (pg) {
      try {
        const numSteps = Math.max(1, Math.round(steps));
        if (typeof pg.incrementAchievement === 'function') {
          pg.incrementAchievement({ achievementId: achId, steps: numSteps });
        } else if (typeof pg.increment === 'function') {
          pg.increment({ achievementId: achId, steps: numSteps });
        }
      } catch (err) {
        console.warn('[PGS Achievement] Native increment error:', err);
      }
    }
  }
}

/**
 * Google Play Games Başarımlar Arayüzünü Ekrana Getirir
 */
export function showPlayGamesAchievements() {
  if (window.Capacitor && window.Capacitor.isNativePlatform) {
    const pg = window.PlayGames || window.Capacitor?.Plugins?.PlayGames;
    if (pg) {
      try {
        if (typeof pg.showAchievements === 'function') {
          pg.showAchievements();
          return true;
        }
      } catch (err) {
        console.warn('[PGS Achievement] Show achievements error:', err);
      }
    }
  }
  return false;
}

if (typeof window !== 'undefined') {
  window.unlockPlayGamesAchievement = unlockPlayGamesAchievement;
  window.incrementPlayGamesAchievement = incrementPlayGamesAchievement;
  window.showPlayGamesAchievements = showPlayGamesAchievements;
}

let db = null;
let isInitialized = false;

export function getPlayerUid() {
  let uid = localStorage.getItem('neon_player_uid');
  if (!uid) {
    uid = 'pilot_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    localStorage.setItem('neon_player_uid', uid);
  }
  return uid;
}

export function initLeaderboard() {
  if (isInitialized) return db;
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    isInitialized = true;
    console.log('[Leaderboard] Firebase Cloud Firestore initialized successfully.');
  } catch (err) {
    console.warn('[Leaderboard] Firebase initialization error (offline fallback active):', err);
    db = null;
  }
  return db;
}

/**
 * Submit player score to Firestore. Only writes if score is higher than current saved score.
 */
export async function submitScoreToFirestore(mode, scoreData) {
  const firestore = initLeaderboard();
  if (!firestore) return false;

  const uid = getPlayerUid();
  const collectionName = mode === 'campaign' ? 'leaderboard_campaign' : 'leaderboard_storm';
  const playerRef = doc(firestore, collectionName, uid);

  try {
    let bestScore = mode === 'storm' ? Math.max(0, Math.floor(scoreData.score || 0)) : undefined;
    let bestLevel = mode !== 'storm' ? Math.max(1, Math.floor(scoreData.level || 1)) : undefined;
    let bestStars = mode !== 'storm' ? Math.max(1, Math.floor(scoreData.stars || 1)) : undefined;

    const existingSnap = await getDoc(playerRef);
    if (existingSnap.exists()) {
      const current = existingSnap.data();
      if (mode === 'storm') {
        bestScore = Math.max(current.score || 0, scoreData.score || 0);
      } else {
        const curScoreVal = (current.level || 1) * 1000 + (current.stars || 0);
        const newScoreVal = (scoreData.level || 1) * 1000 + (scoreData.stars || 0);
        if (curScoreVal > newScoreVal) {
          bestLevel = current.level || 1;
          bestStars = current.stars || 0;
        }
      }
    }

    const payload = {
      uid,
      name: scoreData.name || 'PILOT_ALPHA',
      country: scoreData.country || { code: 'TUR', flag: 'TR', emoji: '🇹🇷' },
      ship: scoreData.ship || 'Siberpunk',
      updatedAt: Date.now()
    };

    if (mode === 'storm') {
      payload.score = Math.max(0, Math.floor(bestScore || 0));
    } else {
      payload.level = Math.max(1, Math.floor(bestLevel || 1));
      payload.stars = Math.max(0, Math.floor(bestStars || 0));
      payload.score = payload.level * 1000 + payload.stars;
    }

    await setDoc(playerRef, payload, { merge: true });
    console.log(`[Leaderboard] Real score submitted to ${collectionName}:`, payload);
    return true;
  } catch (err) {
    console.warn(`[Leaderboard] Failed to submit score to ${collectionName}:`, err);
    return false;
  }
}

/**
 * Update pilot profile name & country across all leaderboard records immediately.
 */
export async function updatePlayerProfileInFirestore(callsign, country, ship) {
  const firestore = initLeaderboard();
  if (!firestore) return false;
  const uid = getPlayerUid();
  const updateData = {
    uid,
    name: callsign,
    country: country || { code: 'TUR', flag: 'TR', emoji: '🇹🇷' },
    ship: ship || 'Siberpunk',
    updatedAt: Date.now()
  };
  try {
    const stormRef = doc(firestore, 'leaderboard_storm', uid);
    const campaignRef = doc(firestore, 'leaderboard_campaign', uid);
    await Promise.allSettled([
      setDoc(stormRef, updateData, { merge: true }),
      setDoc(campaignRef, updateData, { merge: true })
    ]);
    return true;
  } catch (err) {
    console.warn('[Leaderboard] updatePlayerProfileInFirestore error:', err);
    return false;
  }
}

/**
 * Fetch top scores from Firestore.
 */
export async function fetchTopScoresFromFirestore(mode = 'storm', limitCount = 50) {
  const firestore = initLeaderboard();
  if (!firestore) return null;

  const collectionName = mode === 'campaign' ? 'leaderboard_campaign' : 'leaderboard_storm';
  try {
    const colRef = collection(firestore, collectionName);
    const q = query(colRef, orderBy('score', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);

    const scores = [];
    const myUid = getPlayerUid();
    const myCallsign = localStorage.getItem('neon_player_callsign') || 'PILOT_ALPHA';
    const myCountryCode = localStorage.getItem('neon_player_country') || 'TUR';

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docUid = data.uid || docSnap.id;
      const isMe = docUid === myUid || (data.name && data.name.toUpperCase() === myCallsign.toUpperCase());
      scores.push({
        uid: docUid,
        name: isMe ? myCallsign : data.name,
        country: isMe ? { code: myCountryCode, flag: myCountryCode } : (data.country || { code: 'TUR', flag: 'TR', emoji: '🇹🇷' }),
        score: data.score || 0,
        level: data.level || 1,
        stars: data.stars || 0,
        ship: data.ship || 'Siberpunk',
        isPlayer: isMe,
        updatedAt: data.updatedAt || Date.now()
      });
    });

    if (scores.length > 0) {
      localStorage.setItem(`neon_cached_lb_${mode}`, JSON.stringify(scores));
    }
    return scores;
  } catch (err) {
    console.warn(`[Leaderboard] Error fetching top scores from ${collectionName}:`, err);
    const cached = localStorage.getItem(`neon_cached_lb_${mode}`);
    if (cached) {
      try {
        const myUid = getPlayerUid();
        const myCallsign = localStorage.getItem('neon_player_callsign') || 'PILOT_ALPHA';
        const myCountryCode = localStorage.getItem('neon_player_country') || 'TUR';
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          parsed.forEach(item => {
            if (item.isPlayer || item.uid === myUid) {
              item.isPlayer = true;
              item.name = myCallsign;
              item.country = { code: myCountryCode, flag: myCountryCode };
            }
          });
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}

/**
 * Google Play Veri Güvenliği (Data Deletion) Politikası Gereği
 * Kullanıcının bulut liderlik tablosu kaydını kalıcı olarak siler.
 */
export async function deletePlayerDataFromFirestore() {
  const uid = localStorage.getItem('neon_player_uid');
  try {
    const firestore = initLeaderboard();
    if (firestore && uid) {
      await Promise.allSettled([
        deleteDoc(doc(firestore, 'leaderboard_storm', uid)),
        deleteDoc(doc(firestore, 'leaderboard_campaign', uid))
      ]);
    }
  } catch (err) {
    console.warn('[Leaderboard] Cloud data delete warning:', err);
  }
  try {
    localStorage.removeItem('neon_player_uid');
    localStorage.removeItem('neon_player_callsign');
    localStorage.removeItem('neon_cached_lb_storm');
    localStorage.removeItem('neon_cached_lb_campaign');
  } catch (e) {}
  return true;
}

if (typeof window !== 'undefined') {
  window.deletePlayerDataFromFirestore = deletePlayerDataFromFirestore;
}
