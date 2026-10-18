// ==============================================================================
// NEON SPACE SURVIVOR — HIGH-FIDELITY SHIP ART & VECTOR ENGINE
// Bespoke geometries, layered titanium plating, animated thrusters & distinct silhouettes
// ==============================================================================

export const SHIP_VISUAL_CONFIGS = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'SİBERPUNK',
    title: 'Dengeli Saldırı Jeti',
    archetype: 'interceptor',
    primary: '#00f0ff',
    secondary: '#ff0077',
    cockpit: '#00f0ff',
    flame: '#00f0ff',
    hullDark: '#080d1a',
    hullMid: '#131e36',
    hullLight: '#1e2f52',
    accent: '#ff0077',
    glow: 'rgba(0, 240, 255, 0.55)',
    engineCount: 2
  },
  solar: {
    id: 'solar',
    name: 'GÜNEŞ FIRTINASI',
    title: 'Ağır Taarruz Jeti',
    archetype: 'heavy_gunship',
    primary: '#ffbe0b',
    secondary: '#ff5722',
    cockpit: '#ff9100',
    flame: '#ff3d00',
    hullDark: '#140c08',
    hullMid: '#2d1810',
    hullLight: '#472718',
    accent: '#ff3d00',
    glow: 'rgba(255, 190, 11, 0.55)',
    engineCount: 3
  },
  toxic: {
    id: 'toxic',
    name: 'ZEHİR NEON',
    title: 'Gözcü & Hasatçı',
    archetype: 'bio_scout',
    primary: '#05ffa1',
    secondary: '#7209b7',
    cockpit: '#b5179e',
    flame: '#05ffa1',
    hullDark: '#05140e',
    hullMid: '#0c2e20',
    hullLight: '#154a34',
    accent: '#a855f7',
    glow: 'rgba(5, 255, 161, 0.55)',
    engineCount: 2
  },
  vortex: {
    id: 'vortex',
    name: 'VORTEX NEBULA',
    title: 'Kozmik Girdap Avcısı',
    archetype: 'singularity_cruiser',
    primary: '#bf5af2',
    secondary: '#38bdf8',
    cockpit: '#f0abfc',
    flame: '#c084fc',
    hullDark: '#0d0c24',
    hullMid: '#1b1842',
    hullLight: '#2c2766',
    accent: '#38bdf8',
    glow: 'rgba(191, 90, 242, 0.55)',
    engineCount: 2
  },
  phantom: {
    id: 'phantom',
    name: 'HAYALET PLAZMA',
    title: 'Kuantum Savunma Jeti',
    archetype: 'stealth_raider',
    primary: '#e0f7fa',
    secondary: '#00e5ff',
    cockpit: '#80deea',
    flame: '#00e5ff',
    hullDark: '#09131c',
    hullMid: '#122538',
    hullLight: '#1f3d59',
    accent: '#00e5ff',
    glow: 'rgba(0, 229, 255, 0.55)',
    engineCount: 2
  },
  chrono: {
    id: 'chrono',
    name: 'CHRONO APEX',
    title: 'Altın Zaman Kruvazörü',
    archetype: 'temporal_flagship',
    primary: '#ffd700',
    secondary: '#ffffff',
    cockpit: '#fef08a',
    flame: '#ffbe0b',
    hullDark: '#16121a',
    hullMid: '#2d2438',
    hullLight: '#473859',
    accent: '#ffd700',
    glow: 'rgba(255, 215, 0, 0.55)',
    engineCount: 5
  }
};

// ==============================================================================
// 1. HIGH-RESOLUTION SVG VECTOR RENDERER (For DOM showcases, cards, hangar)
// ==============================================================================
export function getShipSvg(skinId, size = 64) {
  const conf = SHIP_VISUAL_CONFIGS[skinId] || SHIP_VISUAL_CONFIGS.cyberpunk;
  const p = conf.primary;
  const s = conf.secondary;
  const c = conf.cockpit;
  const f = conf.flame;
  const hd = conf.hullDark;
  const hm = conf.hullMid;
  const hl = conf.hullLight;

  let content = '';

  switch (skinId) {
    case 'solar':
      // GÜNEŞ FIRTINASI: Geniş ağır delta, çift dev plazma namlusu, üçlü termonükleer alev
      content = `
        <defs>
          <linearGradient id="sol-hull-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${hl}"/>
            <stop offset="50%" stop-color="${hm}"/>
            <stop offset="100%" stop-color="${hd}"/>
          </linearGradient>
          <linearGradient id="sol-flame-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="30%" stop-color="${p}"/>
            <stop offset="70%" stop-color="${f}"/>
            <stop offset="100%" stop-color="transparent"/>
          </linearGradient>
        </defs>
        <!-- 3 Termonükleer İtki Alevi -->
        <polygon points="17,39 21,52 25,39" fill="url(#sol-flame-${size})" opacity="0.9"/>
        <polygon points="39,39 43,52 47,39" fill="url(#sol-flame-${size})" opacity="0.9"/>
        <polygon points="28,42 32,58 36,42" fill="url(#sol-flame-${size})"/>
        <polygon points="30,42 32,50 34,42" fill="#ffffff"/>

        <!-- Ağır Yan Top Namluları -->
        <rect x="13" y="10" width="5" height="24" rx="1.5" fill="#181112" stroke="${p}" stroke-width="1.2"/>
        <rect x="46" y="10" width="5" height="24" rx="1.5" fill="#181112" stroke="${p}" stroke-width="1.2"/>
        <line x1="13" y1="16" x2="18" y2="16" stroke="${s}" stroke-width="1"/>
        <line x1="46" y1="16" x2="51" y2="16" stroke="${s}" stroke-width="1"/>
        <circle cx="15.5" cy="10" r="1.5" fill="#ffffff"/>
        <circle cx="48.5" cy="10" r="1.5" fill="#ffffff"/>

        <!-- Ana Gövde: Kaslı Geniş Delta Kanat -->
        <polygon points="32,7 39,15 57,32 54,40 43,39 37,42 27,42 21,39 10,40 7,32 25,15" fill="url(#sol-hull-${size})" stroke="${p}" stroke-width="1.8"/>

        <!-- İç Zırh Plakaları & Isı Tahliye Izgaraları -->
        <polygon points="32,14 46,31 39,35 25,35 18,31" fill="#1a1114" stroke="${s}" stroke-width="1"/>
        <!-- Isı kanalları -->
        <line x1="22" y1="33" x2="27" y2="24" stroke="${f}" stroke-width="1.2"/>
        <line x1="42" y1="33" x2="37" y2="24" stroke="${f}" stroke-width="1.2"/>

        <!-- Ağır Kokpit Siperliği -->
        <polygon points="32,16 37,25 35,30 29,30 27,25" fill="${c}" stroke="#ffffff" stroke-width="0.8"/>
        <polygon points="32,18 35,24 33,28 31,28 29,24" fill="#ffffff" opacity="0.6"/>
      `;
      break;

    case 'toxic':
      // ZEHİR NEON: İleriye uzanan avcı orak/kıvrık kanatlar, çift zehir çenesi/mandibula, zümrüt biyo-çekirdek
      content = `
        <defs>
          <linearGradient id="tox-hull-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${hl}"/>
            <stop offset="60%" stop-color="${hm}"/>
            <stop offset="100%" stop-color="${hd}"/>
          </linearGradient>
          <linearGradient id="tox-flame-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="30%" stop-color="${p}"/>
            <stop offset="85%" stop-color="${s}"/>
            <stop offset="100%" stop-color="transparent"/>
          </linearGradient>
        </defs>
        <!-- Biyo-Plazma İtki Alevleri -->
        <polygon points="22,41 25,54 28,41" fill="url(#tox-flame-${size})"/>
        <polygon points="36,41 39,54 42,41" fill="url(#tox-flame-${size})"/>
        <circle cx="25" cy="56" r="1.2" fill="${p}" opacity="0.7"/>
        <circle cx="39" cy="57" r="1.5" fill="${p}" opacity="0.8"/>

        <!-- Orak Kanatlar (Forward-swept Scythe Talons) & Çift Çene -->
        <path d="M 32,14 
                 L 35,6 L 33,18 
                 L 41,20 L 59,12 L 56,26 L 49,38 L 42,41 L 37,38 L 32,41 
                 L 27,38 L 22,41 L 15,38 L 8,26 L 5,12 L 23,20 
                 L 31,18 L 29,6 Z" 
              fill="url(#tox-hull-${size})" stroke="${p}" stroke-width="1.6"/>

        <!-- Biyo-Zırh Kitin Katmanları -->
        <path d="M 32,16 L 41,25 L 36,36 L 28,36 L 23,25 Z" fill="#061c13" stroke="${s}" stroke-width="1.2"/>
        
        <!-- Biyo-Lüminesans Damar Hatları -->
        <path d="M 27,24 Q 18,22 11,18" stroke="${p}" stroke-width="1.2" fill="none"/>
        <path d="M 37,24 Q 46,22 53,18" stroke="${p}" stroke-width="1.2" fill="none"/>

        <!-- Organik Biyo-Sensör Kokpiti -->
        <ellipse cx="32" cy="27" rx="4.5" ry="6.5" fill="${c}" stroke="#ffffff" stroke-width="0.8"/>
        <ellipse cx="31.2" cy="25" rx="1.8" ry="3" fill="#ffffff" opacity="0.7"/>
      `;
      break;

    case 'vortex':
      // VORTEX NEBULA: Hilal manyetik ray kolları, merkezde dönen minyatür karadelik/tekillik küresi
      content = `
        <defs>
          <linearGradient id="vor-hull-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${hl}"/>
            <stop offset="50%" stop-color="${hm}"/>
            <stop offset="100%" stop-color="${hd}"/>
          </linearGradient>
          <radialGradient id="vor-singularity-${size}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#05030a"/>
            <stop offset="60%" stop-color="#24083a"/>
            <stop offset="85%" stop-color="${p}"/>
            <stop offset="100%" stop-color="${s}"/>
          </radialGradient>
        </defs>
        <!-- Kozmik Vortex Plazma Alevleri -->
        <polygon points="21,41 24,53 27,41" fill="${p}" opacity="0.9"/>
        <polygon points="37,41 40,53 43,41" fill="${p}" opacity="0.9"/>
        <polygon points="22.5,41 24,47 25.5,41" fill="#ffffff"/>
        <polygon points="38.5,41 40,47 41.5,41" fill="#ffffff"/>

        <!-- Hilal Gövde & Manyetik Hızlandırıcı Ray Kolları -->
        <path d="M 23,6 Q 27,15 28,21 L 21,25 L 7,31 L 11,40 L 23,39 L 28,42 L 36,42 L 41,39 L 53,40 L 57,31 L 43,25 L 36,21 Q 37,15 41,6 L 36,11 Q 32,16 28,11 Z"
              fill="url(#vor-hull-${size})" stroke="${p}" stroke-width="1.7"/>

        <!-- Manyetik Bobinler (Raylar üstünde mavi şarj halkaları) -->
        <rect x="23" y="11" width="3" height="2" fill="${s}"/>
        <rect x="25" y="15" width="3" height="2" fill="${s}"/>
        <rect x="38" y="11" width="3" height="2" fill="${s}"/>
        <rect x="36" y="15" width="3" height="2" fill="${s}"/>

        <!-- Merkez Tekillik Çemberi & Akresyon Diski -->
        <circle cx="32" cy="27" r="7.5" fill="url(#vor-singularity-${size})" stroke="${s}" stroke-width="1.4"/>
        <ellipse cx="32" cy="27" rx="9" ry="3.5" fill="none" stroke="${p}" stroke-width="1" stroke-dasharray="3,2"/>
        <circle cx="32" cy="27" r="2.2" fill="#ffffff"/>

        <!-- Kristal Kokpit Prizması (Tekilliğin hemen arkasında) -->
        <polygon points="32,32 35,38 29,38" fill="${c}" stroke="#ffffff" stroke-width="0.7"/>
      `;
      break;

    case 'phantom':
      // HAYALET PLAZMA: Tam gizli (stealth) elmas/okucu geometri, kesintisiz kuantum yarık alevi, buz mavisi faz panelleri
      content = `
        <defs>
          <linearGradient id="pha-hull-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${hl}"/>
            <stop offset="45%" stop-color="${hm}"/>
            <stop offset="100%" stop-color="${hd}"/>
          </linearGradient>
          <linearGradient id="pha-flame-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="35%" stop-color="${s}"/>
            <stop offset="100%" stop-color="transparent"/>
          </linearGradient>
        </defs>
        <!-- Süpersonik Faz İtki Yarık Tabakası -->
        <polygon points="20,40 32,53 44,40" fill="url(#pha-flame-${size})" opacity="0.85"/>
        <polygon points="26,40 32,47 38,40" fill="#ffffff" opacity="0.9"/>

        <!-- Stealth Elmas Okucu Gövde (F-117 & SR-71 esintili) -->
        <polygon points="32,5 45,22 58,35 52,40 44,38 38,42 26,42 20,38 12,40 6,35 19,22" 
                 fill="url(#pha-hull-${size})" stroke="${s}" stroke-width="1.6"/>

        <!-- Kuantum Faz / Yansıtıcı Zırh Plakaları -->
        <polygon points="32,9 41,23 32,36 23,23" fill="#0d2133" stroke="${p}" stroke-width="1"/>
        <polygon points="32,9 32,36 23,23" fill="#132c45" opacity="0.6"/>

        <!-- Yan Gizlilik Dikey Yüzgeçleri -->
        <line x1="20" y1="31" x2="16" y2="39" stroke="${s}" stroke-width="1.4"/>
        <line x1="44" y1="31" x2="48" y2="39" stroke="${s}" stroke-width="1.4"/>

        <!-- Gömme Kuantum Kokpit -->
        <polygon points="32,15 36,24 32,29 28,24" fill="${c}" stroke="#ffffff" stroke-width="0.8"/>
        <polygon points="32,16 34,23 32,27" fill="#ffffff" opacity="0.8"/>
      `;
      break;

    case 'chrono':
      // CHRONO APEX: Asil kraliyet altın spearhead, krono-kadran halkaları, 5 noktalı iyon itki
      content = `
        <defs>
          <linearGradient id="chr-hull-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#5a471b"/>
            <stop offset="40%" stop-color="#2a2012"/>
            <stop offset="100%" stop-color="${hd}"/>
          </linearGradient>
          <linearGradient id="chr-gold-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff275"/>
            <stop offset="50%" stop-color="${p}"/>
            <stop offset="100%" stop-color="#b8860b"/>
          </linearGradient>
        </defs>
        <!-- 5-Noktalı Altın İyon Alevi -->
        <polygon points="17,38 19,48 21,38" fill="${p}" opacity="0.8"/>
        <polygon points="24,39 26,51 28,39" fill="${p}" opacity="0.9"/>
        <polygon points="30,41 32,56 34,41" fill="#ffffff"/>
        <polygon points="36,39 38,51 40,39" fill="${p}" opacity="0.9"/>
        <polygon points="43,38 45,48 47,38" fill="${p}" opacity="0.8"/>

        <!-- Altın Taç Spearhead & Süslü Kanatlar -->
        <polygon points="32,4 37,12 55,27 52,36 43,34 38,40 32,38 26,40 21,34 12,36 9,27 27,12"
                 fill="url(#chr-hull-${size})" stroke="url(#chr-gold-${size})" stroke-width="1.8"/>

        <!-- Kraliyet Altın Telkari Süslemeleri & Kanat Kanartları -->
        <polygon points="32,8 35,14 42,16 34,22 32,17" fill="url(#chr-gold-${size})"/>
        <polygon points="32,8 29,14 22,16 30,22 32,17" fill="url(#chr-gold-${size})"/>

        <!-- Merkez Dönen Krono-Kadranı (Zaman Çarkı) -->
        <circle cx="32" cy="27" r="6" fill="#1b1424" stroke="${p}" stroke-width="1.2"/>
        <circle cx="32" cy="27" r="4.2" fill="none" stroke="#ffffff" stroke-width="0.8" stroke-dasharray="2,2"/>
        <line x1="32" y1="23" x2="32" y2="27" stroke="${p}" stroke-width="1.2"/>
        <line x1="32" y1="27" x2="35" y2="29" stroke="#ffffff" stroke-width="1"/>
        <circle cx="32" cy="27" r="1.5" fill="#ffffff"/>

        <!-- Asil Elmas Kesim Kokpit -->
        <polygon points="32,12 35,17 32,20 29,17" fill="${c}" stroke="#ffffff" stroke-width="0.7"/>
      `;
      break;

    case 'cyberpunk':
    default:
      // SİBERPUNK (X1 APEX INTERCEPTOR): İğne burun, çift kanart, stepped kanat, çift iyon podu, siber hatlar
      content = `
        <defs>
          <linearGradient id="cyb-hull-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${hl}"/>
            <stop offset="50%" stop-color="${hm}"/>
            <stop offset="100%" stop-color="${hd}"/>
          </linearGradient>
          <linearGradient id="cyb-flame-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="35%" stop-color="${p}"/>
            <stop offset="80%" stop-color="${s}"/>
            <stop offset="100%" stop-color="transparent"/>
          </linearGradient>
        </defs>
        <!-- İkiz İyon İtki Alevi -->
        <polygon points="21,40 24,54 27,40" fill="url(#cyb-flame-${size})"/>
        <polygon points="37,40 40,54 43,40" fill="url(#cyb-flame-${size})"/>
        <polygon points="22.5,40 24,47 25.5,40" fill="#ffffff"/>
        <polygon points="38.5,40 40,47 41.5,40" fill="#ffffff"/>

        <!-- Motor Nozül Podları -->
        <rect x="20" y="34" width="7" height="7" rx="1.5" fill="#0b1220" stroke="${p}" stroke-width="1.2"/>
        <rect x="37" y="34" width="7" height="7" rx="1.5" fill="#0b1220" stroke="${p}" stroke-width="1.2"/>

        <!-- Kanat Ucu Lazer Namluları -->
        <rect x="7" y="24" width="3" height="14" rx="1" fill="#0f172a" stroke="${p}" stroke-width="1"/>
        <rect x="54" y="24" width="3" height="14" rx="1" fill="#0f172a" stroke="${p}" stroke-width="1"/>
        <circle cx="8.5" cy="24" r="1.5" fill="${s}"/>
        <circle cx="55.5" cy="24" r="1.5" fill="${s}"/>

        <!-- Ana Gövde & Basamaklı Kanatlar -->
        <polygon points="32,5 36,13 42,16 37,21 55,30 52,38 41,36 36,41 28,41 23,36 12,38 9,30 27,21 22,16 28,13"
                 fill="url(#cyb-hull-${size})" stroke="${p}" stroke-width="1.7"/>

        <!-- İç Zırh Plakaları & Neon İletim Hatları -->
        <polygon points="32,13 41,25 35,35 29,35 23,25" fill="#0b1326" stroke="${s}" stroke-width="1"/>
        <line x1="28" y1="24" x2="16" y2="33" stroke="${p}" stroke-width="1.2"/>
        <line x1="36" y1="24" x2="48" y2="33" stroke="${p}" stroke-width="1.2"/>

        <!-- Füzyon Reaktör Çekirdeği -->
        <circle cx="32" cy="30" r="3" fill="${p}"/>
        <circle cx="32" cy="30" r="1.5" fill="#ffffff"/>

        <!-- Elmas Kesim Kokpit Camı -->
        <polygon points="32,15 36,23 32,27 28,23" fill="${c}" stroke="#ffffff" stroke-width="0.8"/>
        <polygon points="32,16 34,22 32,25" fill="#ffffff" opacity="0.75"/>
      `;
      break;
  }

  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" style="filter: drop-shadow(0 0 10px ${conf.glow}); display: block; overflow: visible;">
    ${content}
  </svg>`;
}

// Backward-compatible alias for existing callers
export function getShipPixelSvg(skinId, size = 52) {
  return getShipSvg(skinId, size);
}

// ==============================================================================
// 2. HIGH-PERFORMANCE CANVAS VECTOR RENDERER (For in-game flight & menu showcase)
// ==============================================================================
export function drawShip(ctx, skinId, r = 26, options = {}) {
  const conf = SHIP_VISUAL_CONFIGS[skinId] || SHIP_VISUAL_CONFIGS.cyberpunk;
  const frames = options.frames || 0;
  const isFever = !!options.isFever;
  const overchargeTimer = options.overchargeTimer || 0;
  const combatZone = options.combatZone || 'mid';
  const morphAnim = options.morphAnim || 0;
  const hitFlash = !!options.hitFlash;
  const isStationary = !!options.isStationary;
  const flameScale = options.flameScale || 1.0;
  const trailColor = options.trailColor || null;

  const primary = isFever ? '#ffbe0b' : conf.primary;
  const secondary = isFever ? '#ffffff' : conf.secondary;
  const cockpit = isFever ? '#ffffff' : conf.cockpit;
  const flameCol = trailColor || (isFever ? '#ffbe0b' : conf.flame);

  ctx.save();

  // Overcharge Aurası (Halkalar ve Dış Enerji Dalgası)
  if (overchargeTimer > 0) {
    ctx.save();
    const pulse1 = Math.sin(frames * 0.25) * 3;
    const auraGrad = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r + 18 + pulse1);
    auraGrad.addColorStop(0, 'rgba(0, 240, 255, 0.15)');
    auraGrad.addColorStop(0.6, 'rgba(191, 90, 242, 0.25)');
    auraGrad.addColorStop(1, 'rgba(191, 90, 242, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r + 18 + pulse1, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = primary;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, r + 12 + pulse1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Gemiye Özel Çizim Rutinleri
  switch (skinId) {
    case 'solar':
      drawSolarShip(ctx, r, conf, primary, secondary, cockpit, flameCol, frames, overchargeTimer, combatZone, flameScale);
      break;
    case 'toxic':
      drawToxicShip(ctx, r, conf, primary, secondary, cockpit, flameCol, frames, overchargeTimer, combatZone, flameScale);
      break;
    case 'vortex':
      drawVortexShip(ctx, r, conf, primary, secondary, cockpit, flameCol, frames, overchargeTimer, combatZone, flameScale);
      break;
    case 'phantom':
      drawPhantomShip(ctx, r, conf, primary, secondary, cockpit, flameCol, frames, overchargeTimer, combatZone, flameScale);
      break;
    case 'chrono':
      drawChronoShip(ctx, r, conf, primary, secondary, cockpit, flameCol, frames, overchargeTimer, combatZone, flameScale);
      break;
    case 'cyberpunk':
    default:
      drawCyberpunkShip(ctx, r, conf, primary, secondary, cockpit, flameCol, frames, overchargeTimer, combatZone, morphAnim, isStationary, flameScale);
      break;
  }

  // Hit Flash (Beyaz Hasar Parlaması)
  if (hitFlash) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ff3366';
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// ==============================================================================
// 3. SHIP IMPLEMENTATIONS (CANVAS 2D)
// ==============================================================================

// --- 1. CYBERPUNK (X1 APEX INTERCEPTOR) ---
function drawCyberpunkShip(ctx, r, conf, primary, secondary, cockpit, flameCol, frames, overchargeTimer, combatZone, morphAnim, isStationary, flameScale) {
  const flamePulse = 0.8 + Math.sin(frames * 0.35) * 0.3;
  const baseLen = (overchargeTimer > 0 ? 28 : (combatZone === 'rear' ? 16 : 10)) * flameScale;
  const fLen = baseLen * flamePulse;

  // İkiz İyon Nozülleri & Alevleri
  const podW = 5;
  const podH = 8;
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = primary;
  ctx.lineWidth = 1.4;
  ctx.fillRect(-10, r * 0.55, podW, podH);
  ctx.strokeRect(-10, r * 0.55, podW, podH);
  ctx.fillRect(5, r * 0.55, podW, podH);
  ctx.strokeRect(5, r * 0.55, podW, podH);

  // Sol & Sağ İyon Plazması
  ctx.fillStyle = flameCol;
  ctx.beginPath();
  ctx.moveTo(-10, r * 0.85);
  ctx.lineTo(-7.5, r * 0.85 + fLen);
  ctx.lineTo(-5, r * 0.85);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(5, r * 0.85);
  ctx.lineTo(7.5, r * 0.85 + fLen);
  ctx.lineTo(10, r * 0.85);
  ctx.closePath();
  ctx.fill();

  // Akkor Çekirdek
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(-9, r * 0.85);
  ctx.lineTo(-7.5, r * 0.85 + fLen * 0.5);
  ctx.lineTo(-6, r * 0.85);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(6, r * 0.85);
  ctx.lineTo(7.5, r * 0.85 + fLen * 0.5);
  ctx.lineTo(9, r * 0.85);
  ctx.closePath();
  ctx.fill();

  // Kanat Ucu Lazer Namluları
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = primary;
  ctx.lineWidth = 1.3;
  ctx.fillRect(-r * 1.35, -r * 0.25, 3.5, r * 0.95);
  ctx.strokeRect(-r * 1.35, -r * 0.25, 3.5, r * 0.95);
  ctx.fillRect(r * 1.35 - 3.5, -r * 0.25, 3.5, r * 0.95);
  ctx.strokeRect(r * 1.35 - 3.5, -r * 0.25, 3.5, r * 0.95);

  ctx.fillStyle = secondary;
  ctx.fillRect(-r * 1.35, -r * 0.45, 3.5, 3.5);
  ctx.fillRect(r * 1.35 - 3.5, -r * 0.45, 3.5, 3.5);

  // Ana Gövde
  ctx.save();
  const bodyGrad = ctx.createLinearGradient(0, -r * 1.55, 0, r * 1.05);
  bodyGrad.addColorStop(0, '#1e293b');
  bodyGrad.addColorStop(0.5, '#0f172a');
  bodyGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = primary;
  ctx.lineWidth = 2.4;

  let wingTipX = r * 1.35;
  let wingTipY = r * 0.65;
  let canardTipX = r * 0.58;
  if (combatZone === 'front') {
    wingTipX = r * 1.48;
    wingTipY = r * 0.22;
    canardTipX = r * 0.72;
  } else if (combatZone === 'rear') {
    wingTipX = r * 1.1;
    wingTipY = r * 0.88;
    canardTipX = r * 0.44;
  }

  ctx.beginPath();
  ctx.moveTo(0, -r * 1.55);
  ctx.lineTo(r * 0.28, -r * 0.9);
  ctx.lineTo(canardTipX, -r * 0.45);
  ctx.lineTo(r * 0.35, -r * 0.25);
  ctx.lineTo(wingTipX, wingTipY);
  ctx.lineTo(r * 1.25, r * 1.02);
  ctx.lineTo(r * 0.5, r * 0.65);
  ctx.lineTo(r * 0.3, r * 0.85);
  ctx.lineTo(0, r * 0.6);
  ctx.lineTo(-r * 0.3, r * 0.85);
  ctx.lineTo(-r * 0.5, r * 0.65);
  ctx.lineTo(-r * 1.25, r * 1.02);
  ctx.lineTo(-wingTipX, wingTipY);
  ctx.lineTo(-r * 0.35, -r * 0.25);
  ctx.lineTo(-canardTipX, -r * 0.45);
  ctx.lineTo(-r * 0.28, -r * 0.9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // İç Titanyum Zırh Plakaları
  ctx.fillStyle = '#334155';
  ctx.strokeStyle = secondary;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(0, -r * 1.15);
  ctx.lineTo(r * 0.24, -r * 0.2);
  ctx.lineTo(r * 0.85, r * 0.52);
  ctx.lineTo(r * 0.4, r * 0.48);
  ctx.lineTo(0, r * 0.4);
  ctx.lineTo(-r * 0.4, r * 0.48);
  ctx.lineTo(-r * 0.85, r * 0.52);
  ctx.lineTo(-r * 0.24, -r * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Merkez Reaktör
  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.arc(0, 0, 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 2, 0, Math.PI * 2);
  ctx.fill();

  // Neon Dağıtım Hatları
  ctx.strokeStyle = secondary;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-r * 0.22, -r * 0.1);
  ctx.lineTo(-r * 0.78, r * 0.48);
  ctx.moveTo(r * 0.22, -r * 0.1);
  ctx.lineTo(r * 0.78, r * 0.48);
  ctx.stroke();

  // Kokpit
  ctx.fillStyle = cockpit;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.85);
  ctx.lineTo(r * 0.22, -r * 0.25);
  ctx.lineTo(r * 0.18, r * 0.22);
  ctx.lineTo(0, r * 0.35);
  ctx.lineTo(-r * 0.18, r * 0.22);
  ctx.lineTo(-r * 0.22, -r * 0.25);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(-r * 0.06, -r * 0.65);
  ctx.lineTo(-r * 0.03, -r * 0.15);
  ctx.lineTo(-r * 0.1, -r * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// --- 2. SOLAR (SUNSTORM HEAVY GUNSHIP) ---
function drawSolarShip(ctx, r, conf, primary, secondary, cockpit, flameCol, frames, overchargeTimer, combatZone, flameScale) {
  const flamePulse = 0.8 + Math.sin(frames * 0.4) * 0.25;
  const fLen = (overchargeTimer > 0 ? 32 : 14) * flameScale * flamePulse;

  // 3 Ağır Termonükleer Nozül
  // Yan Nozüller (Sol & Sağ)
  ctx.fillStyle = '#1c130d';
  ctx.strokeStyle = primary;
  ctx.lineWidth = 1.4;
  ctx.fillRect(-r * 0.55, r * 0.65, 6, 8);
  ctx.strokeRect(-r * 0.55, r * 0.65, 6, 8);
  ctx.fillRect(r * 0.55 - 6, r * 0.65, 6, 8);
  ctx.strokeRect(r * 0.55 - 6, r * 0.65, 6, 8);
  // Merkez Nozül
  ctx.fillRect(-4, r * 0.72, 8, 9);
  ctx.strokeRect(-4, r * 0.72, 8, 9);

  // 3 Alev Konisi
  ctx.fillStyle = flameCol;
  // Sol alev
  ctx.beginPath();
  ctx.moveTo(-r * 0.55, r * 0.95);
  ctx.lineTo(-r * 0.55 + 3, r * 0.95 + fLen * 0.8);
  ctx.lineTo(-r * 0.55 + 6, r * 0.95);
  ctx.closePath();
  ctx.fill();
  // Sağ alev
  ctx.beginPath();
  ctx.moveTo(r * 0.55 - 6, r * 0.95);
  ctx.lineTo(r * 0.55 - 3, r * 0.95 + fLen * 0.8);
  ctx.lineTo(r * 0.55, r * 0.95);
  ctx.closePath();
  ctx.fill();
  // Merkez dev alev
  ctx.beginPath();
  ctx.moveTo(-4, r * 1.05);
  ctx.lineTo(0, r * 1.05 + fLen * 1.15);
  ctx.lineTo(4, r * 1.05);
  ctx.closePath();
  ctx.fill();
  // Merkez akkor çekirdek
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(-2, r * 1.05);
  ctx.lineTo(0, r * 1.05 + fLen * 0.5);
  ctx.lineTo(2, r * 1.05);
  ctx.closePath();
  ctx.fill();

  // Ağır Omuz Plazma Topları (Gövdenin iki yanında ileri fırlayan namlular)
  ctx.fillStyle = '#1a0e08';
  ctx.strokeStyle = primary;
  ctx.lineWidth = 1.6;
  ctx.fillRect(-r * 0.75, -r * 1.35, 5, r * 0.9);
  ctx.strokeRect(-r * 0.75, -r * 1.35, 5, r * 0.9);
  ctx.fillRect(r * 0.75 - 5, -r * 1.35, 5, r * 0.9);
  ctx.strokeRect(r * 0.75 - 5, -r * 1.35, 5, r * 0.9);

  ctx.fillStyle = '#ff3d00';
  ctx.fillRect(-r * 0.75, -r * 1.45, 5, 3.5);
  ctx.fillRect(r * 0.75 - 5, -r * 1.45, 5, 3.5);

  // Kaslı Ağır Delta Gövde
  ctx.save();
  const bodyGrad = ctx.createLinearGradient(0, -r * 1.35, 0, r * 1.0);
  bodyGrad.addColorStop(0, '#381c10');
  bodyGrad.addColorStop(0.5, '#1e110a');
  bodyGrad.addColorStop(1, '#2c150c');
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = primary;
  ctx.lineWidth = 2.6;

  ctx.beginPath();
  ctx.moveTo(0, -r * 1.25);
  ctx.lineTo(r * 0.35, -r * 0.9);
  ctx.lineTo(r * 0.75, -r * 0.4);
  ctx.lineTo(r * 1.55, r * 0.55);
  ctx.lineTo(r * 1.42, r * 0.95);
  ctx.lineTo(r * 0.75, r * 0.75);
  ctx.lineTo(r * 0.25, r * 0.85);
  ctx.lineTo(0, r * 0.7);
  ctx.lineTo(-r * 0.25, r * 0.85);
  ctx.lineTo(-r * 0.75, r * 0.75);
  ctx.lineTo(-r * 1.42, r * 0.95);
  ctx.lineTo(-r * 1.55, r * 0.55);
  ctx.lineTo(-r * 0.75, -r * 0.4);
  ctx.lineTo(-r * 0.35, -r * 0.9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Isı Radyatör Izgaraları (Kanatlarda kızgın lav kanalları)
  ctx.strokeStyle = secondary;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-r * 0.85, r * 0.1);
  ctx.lineTo(-r * 1.25, r * 0.5);
  ctx.moveTo(-r * 0.7, r * 0.25);
  ctx.lineTo(-r * 1.05, r * 0.65);
  ctx.moveTo(r * 0.85, r * 0.1);
  ctx.lineTo(r * 1.25, r * 0.5);
  ctx.moveTo(r * 0.7, r * 0.25);
  ctx.lineTo(r * 1.05, r * 0.65);
  ctx.stroke();

  // İç Ağır Zırh Plakası
  ctx.fillStyle = '#452010';
  ctx.strokeStyle = primary;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.9);
  ctx.lineTo(r * 0.45, -r * 0.05);
  ctx.lineTo(r * 0.55, r * 0.5);
  ctx.lineTo(0, r * 0.45);
  ctx.lineTo(-r * 0.55, r * 0.5);
  ctx.lineTo(-r * 0.45, -r * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Güneş Plazma Reaktörü (Merkezde akkor sarı/turuncu çekirdek)
  const corePulse = 0.5 + Math.sin(frames * 0.2) * 0.5;
  ctx.fillStyle = '#ff3d00';
  ctx.beginPath();
  ctx.arc(0, r * 0.15, 6 + corePulse * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffbe0b';
  ctx.beginPath();
  ctx.arc(0, r * 0.15, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, r * 0.15, 2, 0, Math.PI * 2);
  ctx.fill();

  // Ağır Açılı Kokpit Siperliği
  ctx.fillStyle = cockpit;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.75);
  ctx.lineTo(r * 0.25, -r * 0.2);
  ctx.lineTo(r * 0.18, r * 0.05);
  ctx.lineTo(-r * 0.18, r * 0.05);
  ctx.lineTo(-r * 0.25, -r * 0.2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  ctx.moveTo(-r * 0.1, -r * 0.6);
  ctx.lineTo(-r * 0.04, -r * 0.15);
  ctx.lineTo(-r * 0.18, -r * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// --- 3. TOXIC (VENOM STALKER) ---
function drawToxicShip(ctx, r, conf, primary, secondary, cockpit, flameCol, frames, overchargeTimer, combatZone, flameScale) {
  const flamePulse = 0.8 + Math.sin(frames * 0.45) * 0.3;
  const fLen = (overchargeTimer > 0 ? 30 : 12) * flameScale * flamePulse;

  // İkiz Asit İtki Nozülleri
  ctx.fillStyle = '#061710';
  ctx.strokeStyle = primary;
  ctx.lineWidth = 1.3;
  ctx.fillRect(-8, r * 0.65, 4.5, 7);
  ctx.strokeRect(-8, r * 0.65, 4.5, 7);
  ctx.fillRect(3.5, r * 0.65, 4.5, 7);
  ctx.strokeRect(3.5, r * 0.65, 4.5, 7);

  // Zümrüt Asit Alevleri
  ctx.fillStyle = flameCol;
  ctx.beginPath();
  ctx.moveTo(-8, r * 0.9);
  ctx.lineTo(-5.75, r * 0.9 + fLen);
  ctx.lineTo(-3.5, r * 0.9);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(3.5, r * 0.9);
  ctx.lineTo(5.75, r * 0.9 + fLen);
  ctx.lineTo(8, r * 0.9);
  ctx.closePath();
  ctx.fill();

  // Damlayan Asit Sporları
  if (Math.sin(frames * 0.3) > 0.3) {
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.arc(-5.75, r * 0.9 + fLen + 4, 1.8, 0, Math.PI * 2);
    ctx.arc(5.75, r * 0.9 + fLen + 6, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Biyo-Mekanik Gövde: İleri Doğru Orak Kanatlar (Forward Scythe Wings) & Çift Avcı Mandibula
  ctx.save();
  const bodyGrad = ctx.createLinearGradient(0, -r * 1.6, 0, r * 0.9);
  bodyGrad.addColorStop(0, '#0c2e1f');
  bodyGrad.addColorStop(0.5, '#061a12');
  bodyGrad.addColorStop(1, '#113a28');
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = primary;
  ctx.lineWidth = 2.4;

  ctx.beginPath();
  // Ön çeneler (Mandibulalar)
  ctx.moveTo(0, -r * 0.85);
  ctx.lineTo(r * 0.15, -r * 1.55); // Sağ çene ucu
  ctx.lineTo(r * 0.28, -r * 0.9);
  ctx.lineTo(r * 0.45, -r * 0.7);
  // İleriye uzanan orak kanat (Forward curved scythe)
  ctx.lineTo(r * 1.48, -r * 0.4); // İleri sivri uç
  ctx.lineTo(r * 1.35, r * 0.25);
  ctx.lineTo(r * 0.95, r * 0.65);
  ctx.lineTo(r * 0.4, r * 0.75);
  ctx.lineTo(0, r * 0.55);
  ctx.lineTo(-r * 0.4, r * 0.75);
  ctx.lineTo(-r * 0.95, r * 0.65);
  ctx.lineTo(-r * 1.35, r * 0.25);
  ctx.lineTo(-r * 1.48, -r * 0.4); // Sol ileri sivri uç
  ctx.lineTo(-r * 0.45, -r * 0.7);
  ctx.lineTo(-r * 0.28, -r * 0.9);
  ctx.lineTo(-r * 0.15, -r * 1.55); // Sol çene ucu
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Biyo-Kitin Kabuk Katmanları
  ctx.fillStyle = '#174732';
  ctx.strokeStyle = secondary;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.6);
  ctx.lineTo(r * 0.4, 0);
  ctx.lineTo(r * 0.65, r * 0.4);
  ctx.lineTo(0, r * 0.35);
  ctx.lineTo(-r * 0.65, r * 0.4);
  ctx.lineTo(-r * 0.4, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Biyo-Lüminesans Damar Hatları
  ctx.strokeStyle = primary;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(r * 0.3, -r * 0.3);
  ctx.quadraticCurveTo(r * 0.8, -r * 0.2, r * 1.25, -r * 0.25);
  ctx.moveTo(-r * 0.3, -r * 0.3);
  ctx.quadraticCurveTo(-r * 0.8, -r * 0.2, -r * 1.25, -r * 0.25);
  ctx.stroke();

  // Organik Biyo-Sensör Kokpiti (Oval Zümrüt/Mor Kubbe)
  ctx.fillStyle = cockpit;
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.1, r * 0.22, r * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.ellipse(-r * 0.06, -r * 0.2, r * 0.08, r * 0.16, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// --- 4. VORTEX (VOID CRUSHER / VORTEX NEBULA) ---
function drawVortexShip(ctx, r, conf, primary, secondary, cockpit, flameCol, frames, overchargeTimer, combatZone, flameScale) {
  const flamePulse = 0.8 + Math.sin(frames * 0.3) * 0.25;
  const fLen = (overchargeTimer > 0 ? 28 : 12) * flameScale * flamePulse;

  // Kozmik Egzos Nozülleri (Kanat Köklerinde)
  ctx.fillStyle = '#0f0e26';
  ctx.strokeStyle = primary;
  ctx.lineWidth = 1.3;
  ctx.fillRect(-r * 0.7, r * 0.5, 5, 8);
  ctx.strokeRect(-r * 0.7, r * 0.5, 5, 8);
  ctx.fillRect(r * 0.7 - 5, r * 0.5, 5, 8);
  ctx.strokeRect(r * 0.7 - 5, r * 0.5, 5, 8);

  // Mor Plazma Alevleri
  ctx.fillStyle = flameCol;
  ctx.beginPath();
  ctx.moveTo(-r * 0.7, r * 0.8);
  ctx.lineTo(-r * 0.7 + 2.5, r * 0.8 + fLen);
  ctx.lineTo(-r * 0.7 + 5, r * 0.8);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(r * 0.7 - 5, r * 0.8);
  ctx.lineTo(r * 0.7 - 2.5, r * 0.8 + fLen);
  ctx.lineTo(r * 0.7, r * 0.8);
  ctx.closePath();
  ctx.fill();

  // Hilal Manyetik Ray Kolları & Manta Kanat Gövdesi
  ctx.save();
  const bodyGrad = ctx.createLinearGradient(0, -r * 1.5, 0, r * 0.9);
  bodyGrad.addColorStop(0, '#2d2154');
  bodyGrad.addColorStop(0.5, '#120f2e');
  bodyGrad.addColorStop(1, '#231a47');
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = primary;
  ctx.lineWidth = 2.4;

  ctx.beginPath();
  // Hilal Ray Uçları (Sol & Sağ boynuzlar)
  ctx.moveTo(0, -r * 0.6);
  ctx.lineTo(r * 0.35, -r * 1.55); // Sağ boynuz ucu
  ctx.lineTo(r * 0.55, -r * 0.9);
  ctx.lineTo(r * 1.45, r * 0.35); // Dış Manta kanat ucu
  ctx.lineTo(r * 1.25, r * 0.8);
  ctx.lineTo(r * 0.65, r * 0.6);
  ctx.lineTo(r * 0.25, r * 0.8);
  ctx.lineTo(0, r * 0.55);
  ctx.lineTo(-r * 0.25, r * 0.8);
  ctx.lineTo(-r * 0.65, r * 0.6);
  ctx.lineTo(-r * 1.25, r * 0.8);
  ctx.lineTo(-r * 1.45, r * 0.35); // Sol Manta kanat ucu
  ctx.lineTo(-r * 0.55, -r * 0.9);
  ctx.lineTo(-r * 0.35, -r * 1.55); // Sol boynuz ucu
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Manyetik Bobin Çizgileri
  ctx.strokeStyle = secondary;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(r * 0.3, -r * 1.2);
  ctx.lineTo(r * 0.45, -r * 1.15);
  ctx.moveTo(r * 0.36, -r * 0.9);
  ctx.lineTo(r * 0.52, -r * 0.85);
  ctx.moveTo(-r * 0.3, -r * 1.2);
  ctx.lineTo(-r * 0.45, -r * 1.15);
  ctx.moveTo(-r * 0.36, -r * 0.9);
  ctx.lineTo(-r * 0.52, -r * 0.85);
  ctx.stroke();

  // MERKEZ MİNYATÜR KARADELİK / TEKİLLİK ÇEKİRDEĞİ (Dinamik Dönen Akresyon Halkaları)
  const rotAngle = frames * 0.06;
  ctx.save();
  ctx.translate(0, -r * 0.05);

  // Dış Mor/Mavi Akresyon Diski
  ctx.rotate(rotAngle);
  ctx.strokeStyle = primary;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.45, r * 0.2, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.rotate(-rotAngle * 2);
  ctx.strokeStyle = secondary;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.35, r * 0.16, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Merkez Karadelik Küresi (Işığı Yutan Olay Ufku)
  ctx.fillStyle = '#05030d';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = secondary;
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Merkez Akkor Işık
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Prizmatik Kristal Kokpit (Tekilliğin hemen ardında)
  ctx.fillStyle = cockpit;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.15);
  ctx.lineTo(r * 0.2, r * 0.45);
  ctx.lineTo(0, r * 0.52);
  ctx.lineTo(-r * 0.2, r * 0.45);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.18);
  ctx.lineTo(r * 0.1, r * 0.38);
  ctx.lineTo(0, r * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// --- 5. PHANTOM (QUANTUM PHASE RAIDER) ---
function drawPhantomShip(ctx, r, conf, primary, secondary, cockpit, flameCol, frames, overchargeTimer, combatZone, flameScale) {
  const flamePulse = 0.85 + Math.sin(frames * 0.5) * 0.2;
  const fLen = (overchargeTimer > 0 ? 30 : 13) * flameScale * flamePulse;

  // Kesintisiz Yatay Stealth Plazma Egzos Yarığı
  const slitGrad = ctx.createLinearGradient(0, r * 0.75, 0, r * 0.75 + fLen);
  slitGrad.addColorStop(0, '#ffffff');
  slitGrad.addColorStop(0.3, secondary);
  slitGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = slitGrad;
  ctx.beginPath();
  ctx.moveTo(-r * 0.45, r * 0.78);
  ctx.lineTo(0, r * 0.78 + fLen);
  ctx.lineTo(r * 0.45, r * 0.78);
  ctx.closePath();
  ctx.fill();

  // Ultra-Stealth Elmas / Çok Açılı Gövde (Faceted Stealth Geometry)
  ctx.save();
  const bodyGrad = ctx.createLinearGradient(0, -r * 1.65, 0, r * 0.85);
  bodyGrad.addColorStop(0, '#1a334d');
  bodyGrad.addColorStop(0.5, '#0b1622');
  bodyGrad.addColorStop(1, '#15293d');
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = secondary;
  ctx.lineWidth = 2.4;

  ctx.beginPath();
  ctx.moveTo(0, -r * 1.65); // Keskin elmas burun
  ctx.lineTo(r * 0.35, -r * 0.7);
  ctx.lineTo(r * 1.35, r * 0.45); // Stealth kanat ucu
  ctx.lineTo(r * 1.15, r * 0.85);
  ctx.lineTo(r * 0.55, r * 0.75); // İç açılı yarık
  ctx.lineTo(r * 0.25, r * 0.95);
  ctx.lineTo(0, r * 0.82);
  ctx.lineTo(-r * 0.25, r * 0.95);
  ctx.lineTo(-r * 0.55, r * 0.75);
  ctx.lineTo(-r * 1.15, r * 0.85);
  ctx.lineTo(-r * 1.35, r * 0.45);
  ctx.lineTo(-r * 0.35, -r * 0.7);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Stealth Faset Panelleri & Kuantum Faz Hatları
  ctx.fillStyle = '#12263a';
  ctx.strokeStyle = primary;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -r * 1.25);
  ctx.lineTo(r * 0.35, -r * 0.1);
  ctx.lineTo(0, r * 0.45);
  ctx.lineTo(-r * 0.35, -r * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Yan Stealth Dikey Kuyruk Yüzgeçleri
  ctx.strokeStyle = secondary;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(r * 0.5, r * 0.2);
  ctx.lineTo(r * 0.7, r * 0.7);
  ctx.moveTo(-r * 0.5, r * 0.2);
  ctx.lineTo(-r * 0.7, r * 0.7);
  ctx.stroke();

  // Gömme Faz Kokpiti
  ctx.fillStyle = cockpit;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.95);
  ctx.lineTo(r * 0.18, -r * 0.3);
  ctx.lineTo(0, 0);
  ctx.lineTo(-r * 0.18, -r * 0.3);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.85);
  ctx.lineTo(r * 0.08, -r * 0.35);
  ctx.lineTo(0, -r * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// --- 6. CHRONO (CHRONO APEX / TEMPORAL VANGUARD) ---
function drawChronoShip(ctx, r, conf, primary, secondary, cockpit, flameCol, frames, overchargeTimer, combatZone, flameScale) {
  const flamePulse = 0.8 + Math.sin(frames * 0.35) * 0.3;
  const fLen = (overchargeTimer > 0 ? 32 : 14) * flameScale * flamePulse;

  // 5-Noktalı İyon İtki Nozülleri
  const offsets = [-r * 0.7, -r * 0.35, 0, r * 0.35, r * 0.7];
  ctx.fillStyle = primary;
  for (let i = 0; i < offsets.length; i++) {
    const ox = offsets[i];
    const isCenter = (i === 2);
    const len = isCenter ? fLen * 1.15 : fLen * 0.75;

    ctx.beginPath();
    ctx.moveTo(ox - 2.5, r * 0.75);
    ctx.lineTo(ox, r * 0.75 + len);
    ctx.lineTo(ox + 2.5, r * 0.75);
    ctx.closePath();
    ctx.fill();

    if (isCenter) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(ox - 1.2, r * 0.75);
      ctx.lineTo(ox, r * 0.75 + len * 0.5);
      ctx.lineTo(ox + 1.2, r * 0.75);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = primary;
    }
  }

  // Asil Kraliyet Altın Gövdesi (Royal Flagship Spearhead)
  ctx.save();
  const bodyGrad = ctx.createLinearGradient(0, -r * 1.6, 0, r * 0.95);
  bodyGrad.addColorStop(0, '#4a3b19');
  bodyGrad.addColorStop(0.4, '#1c1626');
  bodyGrad.addColorStop(1, '#332918');
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = primary;
  ctx.lineWidth = 2.6;

  ctx.beginPath();
  ctx.moveTo(0, -r * 1.6); // Asil mızrak ucu
  ctx.lineTo(r * 0.25, -r * 1.05);
  ctx.lineTo(r * 0.45, -r * 0.85); // Altın kanart
  ctx.lineTo(r * 0.35, -r * 0.4);
  ctx.lineTo(r * 1.45, r * 0.45); // Süslü kanat ucu
  ctx.lineTo(r * 1.3, r * 0.8);
  ctx.lineTo(r * 0.8, r * 0.65);
  ctx.lineTo(r * 0.3, r * 0.85);
  ctx.lineTo(0, r * 0.7);
  ctx.lineTo(-r * 0.3, r * 0.85);
  ctx.lineTo(-r * 0.8, r * 0.65);
  ctx.lineTo(-r * 1.3, r * 0.8);
  ctx.lineTo(-r * 1.45, r * 0.45);
  ctx.lineTo(-r * 0.35, -r * 0.4);
  ctx.lineTo(-r * 0.45, -r * 0.85);
  ctx.lineTo(-r * 0.25, -r * 1.05);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Altın Telkari Süsleme Çizgileri
  ctx.strokeStyle = primary;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, -r * 1.3);
  ctx.lineTo(r * 0.2, -r * 0.7);
  ctx.lineTo(r * 0.85, r * 0.35);
  ctx.moveTo(0, -r * 1.3);
  ctx.lineTo(-r * 0.2, -r * 0.7);
  ctx.lineTo(-r * 0.85, r * 0.35);
  ctx.stroke();

  // MERKEZ KRONO-DİYAL (DÖNEN ZAMAN HALKALARI & ZAMAN KRİSTALİ)
  const dialAngle = frames * 0.04;
  ctx.save();
  ctx.translate(0, r * 0.08);

  ctx.rotate(dialAngle);
  ctx.strokeStyle = primary;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
  ctx.stroke();

  ctx.rotate(-dialAngle * 2.2);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.0;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Merkez Zaman Kristalleri
  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Asil Taç Kokpit
  ctx.fillStyle = cockpit;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.95);
  ctx.lineTo(r * 0.2, -r * 0.35);
  ctx.lineTo(0, -r * 0.1);
  ctx.lineTo(-r * 0.2, -r * 0.35);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.85);
  ctx.lineTo(r * 0.08, -r * 0.4);
  ctx.lineTo(0, -r * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
