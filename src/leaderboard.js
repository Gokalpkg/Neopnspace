import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
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
  }
};

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
      const isMe = docUid === myUid;
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
