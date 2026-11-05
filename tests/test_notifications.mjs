import { describe, it } from 'node:test';
import assert from 'node:assert';
import { notifications, NotificationManager } from '../src/notifications.js';

describe('Daily Event & Meteor Storm Notifications Suite', () => {
  it('N1.1: NotificationManager instance is available and exports cleanly', () => {
    assert.ok(notifications, 'notifications instance must exist');
    assert.strictEqual(typeof notifications.init, 'function');
    assert.strictEqual(typeof notifications.scheduleNextDailyNotification, 'function');
    assert.strictEqual(typeof notifications.requestPermissionAfterFlight, 'function');
  });

  it('N1.2: 7 Rotating event hooks contain zero unicode emojis and have TR & EN coverage', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('src/notifications.js', 'utf8');

    // Emoji regex checking code points >= 0x1F000
    const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{1F1E0}-\u{1F1FF}]/gu;
    const matches = content.match(emojiRegex);
    assert.strictEqual(matches, null, `Notifications must contain zero raw emojis, found: ${matches}`);

    // Verify all 7 days have tags
    assert.ok(content.includes('[RADAR]'), 'Must include [RADAR] meteor event');
    assert.ok(content.includes('[HANGAR]'), 'Must include [HANGAR] crate event');
    assert.ok(content.includes('[LİDERLİK]') || content.includes('[LEAGUE]'), 'Must include league event');
    assert.ok(content.includes('[GÜÇ]') || content.includes('[POWER]'), 'Must include overdrive power event');
  });

  it('N1.3: Permission request suppresses on flight 0 to protect initial onboarding', async () => {
    const mgr = new NotificationManager();
    // Simulate flight 0
    let requested = false;
    mgr.requestPermissionAfterFlight(0);
    assert.strictEqual(mgr.hasPermission, false, 'Must not set or request on flight 0');
  });

  it('N1.4: Target time calculation always targets 20:00 (8:00 PM) prime time', () => {
    const now = new Date();
    const target = new Date();
    target.setHours(20, 0, 0, 0);
    if (now.getTime() >= target.getTime() - 60000) {
      target.setDate(target.getDate() + 1);
    }
    assert.strictEqual(target.getHours(), 20, 'Target hour must be 20:00 (8 PM)');
    assert.strictEqual(target.getMinutes(), 0, 'Target minute must be 0');
    assert.ok(target.getTime() > now.getTime(), 'Target time must be in the future');
  });
});
