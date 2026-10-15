import fs from 'fs';

const game = fs.readFileSync(new URL('../src/game.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const i18n = fs.readFileSync(new URL('../src/i18n.js', import.meta.url), 'utf8');
const gradle = fs.readFileSync(new URL('../android/app/build.gradle', import.meta.url), 'utf8');
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const fails = [];
const expect = (ok, msg) => { if (!ok) fails.push(msg); };

expect(!/hpMult = 1\.45/.test(game), 'level 1 still uses the 1.45 wall');
expect(/dismissTutorial\(\), 9000\)/.test(game), 'tutorial still closes at 4.5s');
expect(/asteroid: \[40, 160, 500, 1200, 3000\]/.test(game), 'asteroid ladder missing');
expect(!/GLOBAL LEADERBOARD|GLOBAL LİDER|CLASSEMENT MONDIAL|GLOBALE BESTENLISTE|全球排行榜|グローバルランキング/.test(i18n), 'leaderboard title still says global');
expect(/flag-code/.test(game) && !/flag-emoji/.test(game), 'flag emoji still rendered');
expect(/_lastFeelFrame/.test(game), 'hit-feel throttle missing');
expect(/openingHooksLeft = 3/.test(game), 'opening hook is not three waves');

const rewardFn = html.slice(html.indexOf('window.showRewardedAd'), html.indexOf('window.triggerGameOverInterstitial'));
expect(rewardFn.includes('fastHighId') && !rewardFn.includes('interstitialNormalId'), 'reward buttons still open a skippable interstitial');
expect(!rewardFn.includes('3940256099942544'), 'reward path still falls back to a Google test ad');
expect(html.includes('ad-loading-shield'), 'ad shield missing');

const vc = Number((gradle.match(/versionCode\s+(\d+)/) || [])[1]);
const vn = (gradle.match(/versionName\s+"([^"]+)"/) || [])[1];
expect(vc >= 22, 'versionCode is not ahead of the last store build');
expect(vn === pkg.version, 'package.json and the Android version name disagree');

if (fails.length) {
  console.error(fails.join('\n'));
  process.exit(1);
}
console.log('balance checks ok', { versionCode: vc, versionName: vn });
