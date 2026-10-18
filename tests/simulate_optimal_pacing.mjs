import { getGame, resetLocalStorage, enemiesModule } from './harness.js';
const { Enemy } = enemiesModule;

function stats(arr) {
  if (arr.length === 0) return { min: 0, max: 0, mean: 0, std: 0, median: 0 };
  const sorted = arr.slice().sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median = sorted[Math.floor(sorted.length / 2)];
  const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  const variance = sorted.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / sorted.length;
  const std = Math.sqrt(variance);
  return { min, max, mean, std, median };
}

function simulateConfiguration(config, runs = 100, flights = 0) {
  const game = getGame();
  const lvl1Times = [];
  const lvl2Times = [];
  const lvl3Times = [];

  const origSpawnScatteredHook = game.spawnScatteredHook.bind(game);
  const origDropEnemyLoot = game.dropEnemyLoot.bind(game);
  const origGetNextLevelXp = game.getNextLevelXp.bind(game);

  for (let r = 0; r < runs; r++) {
    resetLocalStorage({ neon_games_played: flights });

    game.getNextLevelXp = function(lvl) {
      if (lvl === 1) return config.lvl1Xp;
      if (lvl === 2) return config.lvl2Xp;
      if (lvl === 3) return config.lvl3Xp;
      if (lvl === 4) return 160;
      return Math.round(160 * Math.pow(1.36, lvl - 4));
    };

    let hookCount = 0;
    game.spawnScatteredHook = function(waveNum = 1) {
      hookCount++;
      this.openingSwarmPhase = waveNum;
      this.openingBombSpawned = true;
      this.openingClusterTimer = 0;
      this.openingHookGap = 0;

      const count = config.rocksPerHook != null ? config.rocksPerHook : 8;
      for (let i = 0; i < count; i++) {
        const x = 40 + Math.random() * Math.max(40, this.width - 80);
        const y = -18 - Math.random() * 120;
        const roll = Math.random();
        let type = 'asteroid_s';
        let hp = 1;
        if (roll > 0.86) {
          type = 'asteroid_m';
          hp = 2;
        } else if (roll > 0.72) {
          type = 'asteroid_gold';
        }
        const e = new Enemy(x, y, type, 1, 0.5);
        e.hp = hp;
        e.maxHp = hp;
        e.isOpeningCluster = true;
        e.speedX = (Math.random() - 0.5) * 0.3;
        e.speedY = 0.35 + Math.random() * 0.25;
        this.enemies.push(e);
      }

      const isBombHook = (config.bombHooks || [1]).includes(hookCount);
      if (isBombHook) {
        const bomb = new Enemy(
          this.width / 2 + (Math.random() - 0.5) * 80,
          -50 - Math.random() * 80,
          'asteroid_bomb', 1, 0.5
        );
        bomb.hp = 2;
        bomb.maxHp = 2;
        bomb.isOpeningCluster = true;
        bomb.isCoreBomb = true;
        bomb.speedX = 0;
        bomb.speedY = 0.4;
        this.enemies.push(bomb);
      }
    };

    game.startNewGame();
    if (config.openingHooksLeft != null) {
      game.openingHooksLeft = config.openingHooksLeft;
    }

    let tLvl1 = null;
    let tLvl2 = null;
    let tLvl3 = null;

    game.checkLevelUp = function() {
      while (this.player.xp >= this.player.nextXp) {
        if (this.player.level === 1 && tLvl1 === null) {
          tLvl1 = this.frames / 60;
        } else if (this.player.level === 2 && tLvl2 === null) {
          tLvl2 = this.frames / 60;
        } else if (this.player.level === 3 && tLvl3 === null) {
          tLvl3 = this.frames / 60;
        }
        this.player.xp -= this.player.nextXp;
        this.player.level++;
        this.player.nextXp = this.getNextLevelXp(this.player.level);
      }
    };

    for (let f = 1; f <= 7200; f++) {
      game.player.hp = game.player.maxHp;
      game.player.x = (game.width / 2) + Math.sin(f * 0.05) * 40;
      game.update(1.0);

      if (tLvl1 !== null && tLvl2 !== null && tLvl3 !== null) {
        break;
      }
    }

    if (tLvl1 !== null) lvl1Times.push(tLvl1);
    if (tLvl2 !== null) lvl2Times.push(tLvl2);
    if (tLvl3 !== null) lvl3Times.push(tLvl3);

    game.spawnScatteredHook = origSpawnScatteredHook;
    game.dropEnemyLoot = origDropEnemyLoot;
    game.getNextLevelXp = origGetNextLevelXp;
  }

  const s1 = stats(lvl1Times);
  const s2 = stats(lvl2Times);
  const s3 = stats(lvl3Times);

  const early = lvl1Times.filter(t => t < 24.0).length;
  const target = lvl1Times.filter(t => t >= 24.0 && t <= 30.0).length;
  const late = lvl1Times.filter(t => t > 30.0).length + (runs - lvl1Times.length);

  return {
    runs,
    flights,
    lvl1: { ...s1, early, target, late, count: lvl1Times.length },
    lvl2: { ...s2, count: lvl2Times.length },
    lvl3: { ...s3, count: lvl3Times.length }
  };
}

// Test a range of candidate configurations
const candidateModels = [
  // Model A: openingHooksLeft = 1 (single hook with bomb), varying thresholds
  { name: 'Model A1: 1 Hook (bomb), Lv1=20, Lv2=48, Lv3=96', openingHooksLeft: 1, bombHooks: [1], lvl1Xp: 20, lvl2Xp: 48, lvl3Xp: 96 },
  { name: 'Model A2: 1 Hook (bomb), Lv1=22, Lv2=48, Lv3=96', openingHooksLeft: 1, bombHooks: [1], lvl1Xp: 22, lvl2Xp: 48, lvl3Xp: 96 },
  { name: 'Model A3: 1 Hook (bomb), Lv1=24, Lv2=48, Lv3=96', openingHooksLeft: 1, bombHooks: [1], lvl1Xp: 24, lvl2Xp: 48, lvl3Xp: 96 },
  
  // Model B: openingHooksLeft = 2 (Hook 1 bomb, Hook 2 no bomb), varying thresholds
  { name: 'Model B1: 2 Hooks (H1 bomb), Lv1=24, Lv2=48, Lv3=96', openingHooksLeft: 2, bombHooks: [1], lvl1Xp: 24, lvl2Xp: 48, lvl3Xp: 96 },
  { name: 'Model B2: 2 Hooks (H1 bomb), Lv1=26, Lv2=48, Lv3=96', openingHooksLeft: 2, bombHooks: [1], lvl1Xp: 26, lvl2Xp: 48, lvl3Xp: 96 },
  { name: 'Model B3: 2 Hooks (H1 bomb), Lv1=28, Lv2=48, Lv3=96', openingHooksLeft: 2, bombHooks: [1], lvl1Xp: 28, lvl2Xp: 48, lvl3Xp: 96 },

  // Model C: openingHooksLeft = 3 (Baseline hooks = 3), threshold tuning
  { name: 'Model C1: 3 Hooks (All bomb), Lv1=34, Lv2=48, Lv3=96', openingHooksLeft: 3, bombHooks: [1, 2, 3], lvl1Xp: 34, lvl2Xp: 48, lvl3Xp: 96 },
  { name: 'Model C2: 3 Hooks (All bomb), Lv1=36, Lv2=48, Lv3=96', openingHooksLeft: 3, bombHooks: [1, 2, 3], lvl1Xp: 36, lvl2Xp: 48, lvl3Xp: 96 },
  { name: 'Model C3: 3 Hooks (H1 bomb only), Lv1=22, Lv2=48, Lv3=96', openingHooksLeft: 3, bombHooks: [1], lvl1Xp: 22, lvl2Xp: 48, lvl3Xp: 96 },
  { name: 'Model C4: 3 Hooks (H1 bomb only), Lv1=24, Lv2=48, Lv3=96', openingHooksLeft: 3, bombHooks: [1], lvl1Xp: 24, lvl2Xp: 48, lvl3Xp: 96 },
];

console.log('=== RUNNING CANDIDATE MODEL SIMULATIONS (100 RUNS EACH) ===\n');

for (const m of candidateModels) {
  const f0 = simulateConfiguration(m, 100, 0);
  const f1 = simulateConfiguration(m, 100, 1);
  console.log(`----------------------------------------------------------------`);
  console.log(`CANDIDATE: ${m.name}`);
  console.log(`[F0] Lv1: Mean=${f0.lvl1.mean.toFixed(2)}s | Med=${f0.lvl1.median.toFixed(2)}s | StdDev=${f0.lvl1.std.toFixed(2)}s | Early(<24s)=${f0.lvl1.early}% | Target(24-30s)=${f0.lvl1.target}% | Late(>30s)=${f0.lvl1.late}%`);
  console.log(`     Lv2: Mean=${f0.lvl2.mean.toFixed(2)}s | Med=${f0.lvl2.median.toFixed(2)}s | StdDev=${f0.lvl2.std.toFixed(2)}s (Count=${f0.lvl2.count})`);
  console.log(`     Lv3: Mean=${f0.lvl3.mean.toFixed(2)}s | Med=${f0.lvl3.median.toFixed(2)}s | StdDev=${f0.lvl3.std.toFixed(2)}s (Count=${f0.lvl3.count})`);

  console.log(`[F1] Lv1: Mean=${f1.lvl1.mean.toFixed(2)}s | Med=${f1.lvl1.median.toFixed(2)}s | StdDev=${f1.lvl1.std.toFixed(2)}s | Early(<24s)=${f1.lvl1.early}% | Target(24-30s)=${f1.lvl1.target}% | Late(>30s)=${f1.lvl1.late}%`);
  console.log(`     Lv2: Mean=${f1.lvl2.mean.toFixed(2)}s | Med=${f1.lvl2.median.toFixed(2)}s | StdDev=${f1.lvl2.std.toFixed(2)}s (Count=${f1.lvl2.count})`);
  console.log(`     Lv3: Mean=${f1.lvl3.mean.toFixed(2)}s | Med=${f1.lvl3.median.toFixed(2)}s | StdDev=${f1.lvl3.std.toFixed(2)}s (Count=${f1.lvl3.count})`);
}

process.exit(0);
