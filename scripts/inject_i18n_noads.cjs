const fs = require('fs');
let code = fs.readFileSync('src/i18n.js', 'utf8');

const additions = {
  'en-GB': {
    settings_no_ads_title: 'REMOVE ADS (VIP)',
    settings_no_ads_desc: 'Permanently removes all interstitial ads.',
    settings_no_ads_btn: 'REMOVE ADS - $1.99',
    settings_no_ads_active: '✨ NO-ADS ACTIVE',
    settings_restore_btn: 'RESTORE',
    toast_no_ads_success: 'All interstitial ads have been removed!',
    toast_restore_success: 'Purchases restored successfully!'
  },
  'tr-TR': {
    settings_no_ads_title: 'REKLAMLARI KALDIR (VIP)',
    settings_no_ads_desc: 'Tüm geçiş reklamlarını kalıcı olarak kapatır.',
    settings_no_ads_btn: 'REKLAMLARI KALDIR - 49.99 ₺',
    settings_no_ads_active: '✨ NO-ADS AKTİF',
    settings_restore_btn: 'GERİ YÜKLE',
    toast_no_ads_success: 'Tüm geçiş reklamları kaldırıldı!',
    toast_restore_success: 'Satın alımlar başarıyla geri yüklendi!'
  },
  'fr-FR': {
    settings_no_ads_title: 'SUPPRIMER PUBS (VIP)',
    settings_no_ads_desc: 'Supprime définitivement toutes les pubs interstitielles.',
    settings_no_ads_btn: 'SUPPRIMER PUBS - 1,99 €',
    settings_no_ads_active: '✨ SANS PUB ACTIF',
    settings_restore_btn: 'RESTAURER',
    toast_no_ads_success: 'Toutes les publicités interstitielles sont supprimées !',
    toast_restore_success: 'Achats restaurés avec succès !'
  },
  'fr-CA': {
    settings_no_ads_title: 'SUPPRIMER LES ANNONCES (VIP)',
    settings_no_ads_desc: 'Supprime en permanence les annonces interstitielles.',
    settings_no_ads_btn: 'SUPPRIMER ANNONCES - 2,79 $',
    settings_no_ads_active: '✨ SANS ANNONCES ACTIF',
    settings_restore_btn: 'RESTAURER',
    toast_no_ads_success: 'Toutes les annonces interstitielles ont été retirées !',
    toast_restore_success: 'Achats restaurés avec succès !'
  },
  'de-DE': {
    settings_no_ads_title: 'WERBUNG ENTFERNEN (VIP)',
    settings_no_ads_desc: 'Entfernt dauerhaft alle Interstitial-Werbungen.',
    settings_no_ads_btn: 'WERBEFREI - 1,99 €',
    settings_no_ads_active: '✨ WERBEFREI AKTIV',
    settings_restore_btn: 'WIEDERHERSTELLEN',
    toast_no_ads_success: 'Alle Interstitial-Werbungen wurden entfernt!',
    toast_restore_success: 'Käufe erfolgreich wiederhergestellt!'
  },
  'zh-HK': {
    settings_no_ads_title: '移除廣告 (VIP)',
    settings_no_ads_desc: '永久移除所有插頁式廣告。',
    settings_no_ads_btn: '移除廣告 - HK$15.00',
    settings_no_ads_active: '✨ 無廣告已啟用',
    settings_restore_btn: '恢復購買',
    toast_no_ads_success: '所有插頁廣告已成功移除！',
    toast_restore_success: '購買項目已成功恢復！'
  },
  'zh-CN': {
    settings_no_ads_title: '去广告 (VIP)',
    settings_no_ads_desc: '永久移除所有插屏广告。',
    settings_no_ads_btn: '移除广告 - ¥12.00',
    settings_no_ads_active: '✨ 无广告已生效',
    settings_restore_btn: '恢复购买',
    toast_no_ads_success: '所有插屏广告已全部移除！',
    toast_restore_success: '购买记录已成功恢复！'
  },
  'zh-TW': {
    settings_no_ads_title: '移除廣告 (VIP)',
    settings_no_ads_desc: '永久移除所有插頁式廣告。',
    settings_no_ads_btn: '移除廣告 - NT$60',
    settings_no_ads_active: '✨ 無廣告已生效',
    settings_restore_btn: '恢復購買',
    toast_no_ads_success: '所有插頁廣告已成功移除！',
    toast_restore_success: '購買記錄已成功恢復！'
  },
  'ja-JP': {
    settings_no_ads_title: '広告を削除 (VIP)',
    settings_no_ads_desc: 'すべてのインタースティシャル広告を永久に削除します。',
    settings_no_ads_btn: '広告を削除 - ¥300',
    settings_no_ads_active: '✨ 広告なし有効',
    settings_restore_btn: '復元',
    toast_no_ads_success: 'すべてのインタースティシャル広告が削除されました！',
    toast_restore_success: '購入内容が正常に復元されました！'
  }
};

for (const [lang, kv] of Object.entries(additions)) {
  const targetAnchor = 'settings_cloud_save:';
  const langKey = "'" + lang + "':";
  const langIdx = code.indexOf(langKey);
  if (langIdx !== -1) {
    const anchorIdx = code.indexOf(targetAnchor, langIdx);
    if (anchorIdx !== -1) {
      const lineStart = code.lastIndexOf('\n', anchorIdx) + 1;
      let injected = '';
      for (const [k, v] of Object.entries(kv)) {
        injected += `    ${k}: "${v}",\n`;
      }
      code = code.slice(0, lineStart) + injected + code.slice(lineStart);
    }
  }
}

fs.writeFileSync('src/i18n.js', code, 'utf8');
console.log('Successfully injected No-Ads keys into 9 languages in src/i18n.js');
