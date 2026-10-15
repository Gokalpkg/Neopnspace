const fs = require('fs');

const devtoolsPortFile = fs.readFileSync('C:\\Users\\USER\\AppData\\Local\\Google\\Chrome\\User Data\\DevToolsActivePort', 'utf8').trim().split(/\r?\n/);
const port = devtoolsPortFile[0];
const browserPath = devtoolsPortFile[1];
const wsUrl = `ws://127.0.0.1:${port}${browserPath}`;

console.log('Connecting to browser ws:', wsUrl);

let reqId = 1;
const callbacks = {};

const ws = new WebSocket(wsUrl);

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && callbacks[msg.id]) {
    if (msg.error) callbacks[msg.id].reject(msg.error);
    else callbacks[msg.id].resolve(msg.result);
    delete callbacks[msg.id];
  }
};

ws.onerror = (err) => console.error('WebSocket error:', err);
ws.onclose = () => console.log('WebSocket closed');

const RELEASE_NOTES = `<tr-TR>
- Parmak görüş engeli giderildi: Gemi dokunma noktasının 42px yukarısında seyreder, kontrol ve mermi görüşü %100 açıldı.
- Siberpunk Pilot Karşılama Brifingi (FTUE) ve anında +500 Hoş Geldin Kristali eklendi.
- Canlı rekor kırma heyecanı: Uçuş sırasında en iyi skor geçildiği an altın parlama, ses çınlaması ve haptik kutlama devreye girdi.
- Düşman çeşitliliği zenginleştirildi: Ritmik tehlike uyarıları sonrasında dalış yapan Kamikaze ve Dalış Avcısı (Dive Bomber) dronları eklendi.
- Dinamik Kademeli Müzik: Uçuş süresine göre sakin ambiyanstan aksiyon temposuna ve Boss savaşına yükselen synthwave melodisi optimize edildi.
</tr-TR>`;

function send(method, params = {}, sId = null) {
  return new Promise((resolve, reject) => {
    const id = reqId++;
    callbacks[id] = { resolve, reject };
    const payload = { id, method, params };
    if (sId) payload.sessionId = sId;
    ws.send(JSON.stringify(payload));
  });
}

ws.onopen = async () => {
  try {
    const targetsRes = await send('Target.getTargets');
    const targets = targetsRes.targetInfos;
    const target = targets.find(t => t.url && t.url.includes('4975743417199686988'));
    if (!target) {
      throw new Error('Play Console target not found');
    }

    console.log('Attaching to target:', target.title, target.targetId);
    const attachRes = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sId = attachRes.sessionId;

    await send('Page.enable', {}, sId);

    // Check bundle status
    console.log('Checking bundle status...');
    for (let i = 0; i < 20; i++) {
      const pageInfo = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const body = document.body.innerText;
          const isOptimizing = body.includes('optimised for distribution') || body.includes('Yükleniyor');
          const hasBundle = body.includes('NeonSpace_v1.3.7') || body.includes('29 (1.3.7)') || body.includes('1.3.7');
          const errorToast = body.includes('An unexpected error has occurred');
          return { isOptimizing, hasBundle, errorToast };
        })()`
      }, sId);

      console.log(`[Status check ${i+1}]`, pageInfo.result.value);
      if (!pageInfo.result.value.isOptimizing && pageInfo.result.value.hasBundle) {
        console.log('Optimization complete and bundle 1.3.7 is ready!');
        break;
      }
      await new Promise(r => setTimeout(r, 3000));
    }

    // Dismiss any error toast if present by clicking X
    await send('Runtime.evaluate', {
      expression: `(() => {
        const dismissBtns = Array.from(document.querySelectorAll('button[aria-label*="Dismiss"], button[aria-label*="Kapat"], snackbar button'));
        for (const b of dismissBtns) b.click();
      })()`
    }, sId);

    // Set Release Notes
    console.log('Setting release notes in textarea...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const textareas = Array.from(document.querySelectorAll('textarea'));
        for (const ta of textareas) {
          ta.value = ${JSON.stringify(RELEASE_NOTES)};
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          ta.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()`
    }, sId);

    await new Promise(r => setTimeout(r, 2000));

    // Click "Next" or "Save as draft"
    console.log('Clicking Next / Save as draft...');
    const clickNext = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button')).filter(b => !b.disabled);
        const nextBtn = btns.find(b => /^(next|ileri)$/i.test((b.innerText || '').trim()));
        if (nextBtn) {
          nextBtn.click();
          return 'clicked next: ' + nextBtn.innerText;
        }
        const saveDraftBtn = btns.find(b => /save as draft|taslağı kaydet/i.test((b.innerText || '').trim()));
        if (saveDraftBtn) {
          saveDraftBtn.click();
          return 'clicked save draft: ' + saveDraftBtn.innerText;
        }
        return 'no button found. Available: ' + btns.map(b => b.innerText.trim()).join(', ');
      })()`
    }, sId);
    console.log('Action result:', clickNext.result.value);

    // Wait 5 seconds and take screenshot
    await new Promise(r => setTimeout(r, 5000));
    const ss = await send('Page.captureScreenshot', { format: 'png' }, sId);
    fs.writeFileSync('C:\\Users\\USER\\.gemini\\antigravity\\brain\\995dc029-06a7-4876-b1a7-d623264d4dcc\\play_console_final.png', Buffer.from(ss.data, 'base64'));
    console.log('Saved screenshot to play_console_final.png');

    ws.close();
  } catch (err) {
    console.error('Error in finalize:', err);
    ws.close();
  }
};
