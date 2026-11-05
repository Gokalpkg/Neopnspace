// === NEON SPACE SURVIVOR - KOZMİK ESERLER / RELIC SİSTEMİ ===
// Elit düşmanları yenince veya sektör atlayınca sunulan 3 seçenekli pasif eserler

export const COSMIC_RELICS = [
  {
    id: 'reactive_overload',
    tier: 'cosmic',
    nameKey: 'relic_reactive_overload_name',
    descKey: 'relic_reactive_overload_desc',
    icon: 'bomb',
    color: '#00f0ff',
    rarityScore: 90
  },
  {
    id: 'quantum_mirror',
    tier: 'legendary',
    nameKey: 'relic_quantum_mirror_name',
    descKey: 'relic_quantum_mirror_desc',
    icon: 'target',
    color: '#bf5af2',
    rarityScore: 80
  },
  {
    id: 'graze_mines',
    tier: 'rare',
    nameKey: 'relic_graze_mines_name',
    descKey: 'relic_graze_mines_desc',
    icon: 'bomb',
    color: '#ffbe0b',
    rarityScore: 65
  },
  {
    id: 'glass_annihilator',
    tier: 'cosmic',
    nameKey: 'relic_glass_annihilator_name',
    descKey: 'relic_glass_annihilator_desc',
    icon: 'sword',
    color: '#ff0055',
    rarityScore: 95
  },
  {
    id: 'chrono_drift',
    tier: 'legendary',
    nameKey: 'relic_chrono_drift_name',
    descKey: 'relic_chrono_drift_desc',
    icon: 'freeze',
    color: '#38bdf8',
    rarityScore: 85
  },
  {
    id: 'plasma_leech',
    tier: 'rare',
    nameKey: 'relic_plasma_leech_name',
    descKey: 'relic_plasma_leech_desc',
    icon: 'shield',
    color: '#05ffa1',
    rarityScore: 70
  },
  {
    id: 'orbital_familiar',
    tier: 'legendary',
    nameKey: 'relic_orbital_familiar_name',
    descKey: 'relic_orbital_familiar_desc',
    icon: 'ship',
    color: '#ffd700',
    rarityScore: 85
  },
  {
    id: 'chain_lightning',
    tier: 'rare',
    nameKey: 'relic_chain_lightning_name',
    descKey: 'relic_chain_lightning_desc',
    icon: 'energy',
    color: '#00f0ff',
    rarityScore: 60
  },
  {
    id: 'void_singularity',
    tier: 'cosmic',
    nameKey: 'relic_void_singularity_name',
    descKey: 'relic_void_singularity_desc',
    icon: 'target',
    color: '#a855f7',
    rarityScore: 92
  },
  {
    id: 'supercharged_dash',
    tier: 'rare',
    nameKey: 'relic_supercharged_dash_name',
    descKey: 'relic_supercharged_dash_desc',
    icon: 'fire',
    color: '#ff5500',
    rarityScore: 60
  },
  {
    id: 'astral_harvester',
    tier: 'rare',
    nameKey: 'relic_astral_harvester_name',
    descKey: 'relic_astral_harvester_desc',
    icon: 'magnet',
    color: '#05ffa1',
    rarityScore: 60
  },
  {
    id: 'berserker_core',
    tier: 'legendary',
    nameKey: 'relic_berserker_core_name',
    descKey: 'relic_berserker_core_desc',
    icon: 'skull',
    color: '#ff0055',
    rarityScore: 80
  },
  {
    id: 'titan_bulkhead',
    tier: 'rare',
    nameKey: 'relic_titan_bulkhead_name',
    descKey: 'relic_titan_bulkhead_desc',
    icon: 'hull',
    color: '#64748b',
    rarityScore: 65
  },
  {
    id: 'photon_accelerator',
    tier: 'legendary',
    nameKey: 'relic_photon_accelerator_name',
    descKey: 'relic_photon_accelerator_desc',
    icon: 'speed',
    color: '#ffbe0b',
    rarityScore: 75
  },
  {
    id: 'frostbite_shards',
    tier: 'rare',
    nameKey: 'relic_frostbite_shards_name',
    descKey: 'relic_frostbite_shards_desc',
    icon: 'freeze',
    color: '#38bdf8',
    rarityScore: 65
  },
  {
    id: 'magnetic_overdrive',
    tier: 'rare',
    nameKey: 'relic_magnetic_overdrive_name',
    descKey: 'relic_magnetic_overdrive_desc',
    icon: 'magnet',
    color: '#c084fc',
    rarityScore: 60
  },
  {
    id: 'cosmic_catalyst',
    tier: 'legendary',
    nameKey: 'relic_cosmic_catalyst_name',
    descKey: 'relic_cosmic_catalyst_desc',
    icon: 'energy',
    color: '#00f0ff',
    rarityScore: 82
  },
  {
    id: 'nano_repair',
    tier: 'cosmic',
    nameKey: 'relic_nano_repair_name',
    descKey: 'relic_nano_repair_desc',
    icon: 'hull',
    color: '#10b981',
    rarityScore: 90
  },
  {
    id: 'hyper_thrusters',
    tier: 'rare',
    nameKey: 'relic_hyper_thrusters_name',
    descKey: 'relic_hyper_thrusters_desc',
    icon: 'speed',
    color: '#00f0ff',
    rarityScore: 65
  },
  {
    id: 'solar_flair',
    tier: 'legendary',
    nameKey: 'relic_solar_flair_name',
    descKey: 'relic_solar_flair_desc',
    icon: 'fire',
    color: '#ff3d00',
    rarityScore: 78
  }
];

export const RELIC_TIERS = {
  rare: { nameKey: 'relic_tier_rare', color: '#00f0ff', border: 'rgba(0, 240, 255, 0.5)' },
  legendary: { nameKey: 'relic_tier_legendary', color: '#ffd700', border: 'rgba(255, 215, 0, 0.6)' },
  cosmic: { nameKey: 'relic_tier_cosmic', color: '#ff0055', border: 'rgba(255, 0, 85, 0.7)' }
};

export function getRandomRelicChoices(activeRelics = {}, count = 3) {
  const available = COSMIC_RELICS.filter(r => !activeRelics[r.id]);
  if (available.length <= count) return [...available];

  // Weighted shuffle based on rarity
  const pool = [...available].sort(() => Math.random() - 0.5);
  return pool.slice(0, count);
}
