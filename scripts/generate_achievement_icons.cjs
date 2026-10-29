const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const outDir = path.join(__dirname, '..', 'play_store_assets', 'achievements');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// CRC32 table for valid PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const combined = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(combined), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0; // filter none
    rgba.copy(raw, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }
  const compressed = zlib.deflateSync(raw, { level: 6 });
  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const ACHIEVEMENTS = [
  { key: 'first_flight', color1: '#00F0FF', color2: '#070B19', shape: 'ship', tier: 1 },
  { key: 'first_blood', color1: '#FF0055', color2: '#1A0510', shape: 'crosshair', tier: 1 },
  { key: 'first_upgrade', color1: '#FFBE0B', color2: '#191204', shape: 'bolt', tier: 1 },
  { key: 'boss_vanguard', color1: '#FF9100', color2: '#1C0D02', shape: 'skull', tier: 2 },
  { key: 'crystal_magnet', color1: '#05FFA1', color2: '#031A10', shape: 'diamond', tier: 1 },
  { key: 'kills_500', color1: '#38BDF8', color2: '#061524', shape: 'sword', tier: 1 },
  { key: 'kills_2500', color1: '#A855F7', color2: '#140724', shape: 'sword', tier: 2 },
  { key: 'kills_10000', color1: '#F43F5E', color2: '#240610', shape: 'sword', tier: 3 },
  { key: 'crystals_1000', color1: '#10B981', color2: '#041E15', shape: 'diamond', tier: 1 },
  { key: 'crystals_10000', color1: '#00F0FF', color2: '#041A24', shape: 'diamond', tier: 2 },
  { key: 'crystals_50000', color1: '#FFD700', color2: '#241C04', shape: 'diamond', tier: 3 },
  { key: 'pilot_level_50', color1: '#C084FC', color2: '#180826', shape: 'star', tier: 2 },
  { key: 'asteroids_300', color1: '#FB923C', color2: '#211004', shape: 'meteor', tier: 2 },
  { key: 'boss_dreadnought', color1: '#FF1744', color2: '#210309', shape: 'skull', tier: 2 },
  { key: 'boss_nebula', color1: '#00E5FF', color2: '#031D21', shape: 'eye', tier: 2 },
  { key: 'boss_titan', color1: '#05FFA1', color2: '#032115', shape: 'shield', tier: 3 },
  { key: 'boss_chrono', color1: '#FFBE0B', color2: '#241903', shape: 'clock', tier: 3 },
  { key: 'boss_apex', color1: '#D946EF', color2: '#210526', shape: 'crown', tier: 3 },
  { key: 'ship_unlock_2', color1: '#38BDF8', color2: '#051824', shape: 'ship', tier: 2 },
  { key: 'fleet_commander', color1: '#FFD700', color2: '#261E04', shape: 'crown', tier: 3 },
  { key: 'tech_master', color1: '#00F0FF', color2: '#041D24', shape: 'gear', tier: 3 },
  { key: 'ship_5star', color1: '#FACC15', color2: '#241D04', shape: 'star', tier: 3 },
  { key: 'wheel_10', color1: '#EC4899', color2: '#240617', shape: 'wheel', tier: 2 },
  { key: 'graze_master', color1: '#2DD4BF', color2: '#04211D', shape: 'wing', tier: 2 },
  { key: 'combo_50', color1: '#F97316', color2: '#240E04', shape: 'bolt', tier: 2 },
  { key: 'storm_survivor', color1: '#8B5CF6', color2: '#130726', shape: 'vortex', tier: 3 },
  { key: 'hyper_slayer', color1: '#EF4444', color2: '#260606', shape: 'skull', tier: 3 },
  { key: 'flawless_victory', color1: '#05FFA1', color2: '#042417', shape: 'shield', tier: 3 },
  { key: 'edge_of_death', color1: '#F43F5E', color2: '#26050C', shape: 'heart', tier: 2 },
  { key: 'pacifist_run', color1: '#60A5FA', color2: '#061426', shape: 'wing', tier: 2 },
  { key: 'overload_combo', color1: '#E879F9', color2: '#220626', shape: 'bolt', tier: 3 },
  { key: 'time_freeze_12', color1: '#38BDF8', color2: '#041B26', shape: 'clock', tier: 3 }
];

const W = 512, H = 512;

ACHIEVEMENTS.forEach((ach, index) => {
  const rgba = Buffer.alloc(W * H * 4);
  const [r1, g1, b1] = hexToRgb(ach.color1);
  const [r2, g2, b2] = hexToRgb(ach.color2);
  const cx = W / 2, cy = H / 2;
  const seed = (index + 1) * 17.3;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Base dark radial background
      const bgGrad = Math.min(1, dist / 260);
      let r = Math.round(r2 * (1 - bgGrad * 0.5));
      let g = Math.round(g2 * (1 - bgGrad * 0.5));
      let b = Math.round(b2 * (1 - bgGrad * 0.5));

      // Outer polygonal / neon ring (unique per index & tier)
      const sides = 5 + (index % 4);
      const polyCos = Math.cos(Math.floor(0.5 + angle / (2 * Math.PI / sides)) * (2 * Math.PI / sides) - angle);
      const polyDist = dist * polyCos;

      // Outer glowing frame
      const ringRadius = 195 + (ach.tier * 6);
      const ringDiff = Math.abs(polyDist - ringRadius);
      if (ringDiff < 12) {
        const intensity = 1 - ringDiff / 12;
        r = Math.min(255, Math.round(r + r1 * intensity));
        g = Math.min(255, Math.round(g + g1 * intensity));
        b = Math.min(255, Math.round(b + b1 * intensity));
      }

      // Inner emblem geometry unique to each achievement
      const innerRot = angle + (index * 0.45);
      const wave = Math.sin(innerRot * (ach.tier + 2) + seed) * (18 + (index % 5) * 4);
      const coreRadius = 85 + wave;
      if (dist < coreRadius) {
        const coreFactor = Math.pow(1 - dist / coreRadius, 0.65);
        r = Math.min(255, Math.round(r + r1 * coreFactor + 90 * Math.pow(coreFactor, 3)));
        g = Math.min(255, Math.round(g + g1 * coreFactor + 90 * Math.pow(coreFactor, 3)));
        b = Math.min(255, Math.round(b + b1 * coreFactor + 90 * Math.pow(coreFactor, 3)));
      }

      // Tier stars / pips at bottom
      for (let t = 0; t < ach.tier; t++) {
        const sx = cx + (t - (ach.tier - 1) / 2) * 48;
        const sy = H - 64;
        const sDist = Math.hypot(x - sx, y - sy);
        if (sDist < 14) {
          const sf = 1 - sDist / 14;
          r = Math.min(255, Math.round(r + 255 * sf));
          g = Math.min(255, Math.round(g + 220 * sf));
          b = Math.min(255, Math.round(b + 120 * sf));
        }
      }

      const idx = (y * W + x) * 4;
      rgba[idx] = r;
      rgba[idx + 1] = g;
      rgba[idx + 2] = b;
      rgba[idx + 3] = 255;
    }
  }

  const filePath = path.join(outDir, `${String(index + 1).padStart(2, '0')}_${ach.key}.png`);
  fs.writeFileSync(filePath, encodePNG(W, H, rgba));
});

console.log('Generated 32 unique 512x512 PNG achievement icons in:', outDir);
