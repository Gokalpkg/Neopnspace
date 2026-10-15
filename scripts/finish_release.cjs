const fs = require('fs');

console.log('[1] Reading DevToolsActivePort...');
const portLines = fs.readFileSync('C:\\Users\\USER\\AppData\\Local\\Google\\Chrome\\User Data\\DevToolsActivePort', 'utf8').trim().split(/\r?\n/);
const port = portLines[0];
const browserPath = portLines[1];
const wsUrl = `ws://127.0.0.1:${port}${browserPath}`;
console.log('[2] Connecting to wsUrl:', wsUrl);

const ws = new WebSocket(wsUrl);

let reqId = 1;
const callbacks = {};

function send(method, params = {}, sId = null, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const id = reqId++;
    const timer = setTimeout(() => {
      delete callbacks[id];
      reject(new Error(`CDP method ${method} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    callbacks[id] = { resolve: (res) => { clearTimeout(timer); resolve(res); }, reject: (err) => { clearTimeout(timer); reject(err); } };
    const payload = { id, method, params };
    if (sId) payload.sessionId = sId;
    ws.send(JSON.stringify(payload));
  });
}

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && callbacks[msg.id]) {
    if (msg.error) callbacks[msg.id].reject(msg.error);
    else callbacks[msg.id].resolve(msg.result);
    delete callbacks[msg.id];
  }
};

ws.onerror = (err) => {
  console.error('[WS Error]:', err);
};

ws.onclose = (ev) => {
  console.log('[WS Closed]:', ev.code, ev.reason);
};

ws.onopen = async () => {
  console.log('[3] WS Connected successfully!');
  try {
    const targetsRes = await send('Target.getTargets');
    console.log('[4] Found targets count:', targetsRes.targetInfos.length);
    for (const t of targetsRes.targetInfos) {
      if (t.type === 'page') {
        console.log(` - Page: [${t.targetId}] ${t.title} -> ${t.url}`);
      }
    }

    const playTarget = targetsRes.targetInfos.find(t => t.url && t.url.includes('4975743417199686988'));
    if (!playTarget) {
      console.error('[!] Play Console page target not found!');
      ws.close();
      return;
    }

    console.log('[5] Attaching to Play Console target:', playTarget.targetId);
    const attachRes = await send('Target.attachToTarget', { targetId: playTarget.targetId, flatten: true });
    const sId = attachRes.sessionId;
    console.log('[6] Attached with sessionId:', sId);

    await send('DOM.enable', {}, sId);
    await send('Page.enable', {}, sId);

    // Check page state
    const evalRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const text = document.body.innerText;
        const has29 = text.includes('29') && text.includes('1.3.7');
        const isOptimizing = /optimis|optimize|dağıtım için optimize|işleniyor/i.test(text);
        const hasError = text.includes('44965157') || /hata.*oluştu/i.test(text);
        
        const allButtons = Array.from(document.querySelectorAll('button')).map(b => ({
          text: (b.innerText || '').trim(),
          disabled: b.disabled
        }));

        return { has29, isOptimizing, hasError, buttons: allButtons.slice(-8) };
      })()`
    }, sId);

    console.log('[7] Page state evaluation:', JSON.stringify(evalRes.result.value, null, 2));

    // If still optimizing, wait
    if (evalRes.result.value.isOptimizing) {
      console.log('[8] Still optimizing bundle for distribution. Waiting...');
      for (let w = 0; w < 30; w++) {
        await new Promise(r => setTimeout(r, 4000));
        const check = await send('Runtime.evaluate', {
          returnByValue: true,
          expression: `(() => {
            const text = document.body.innerText;
            const isOptimizing = /optimis|optimize|dağıtım için optimize|işleniyor/i.test(text);
            const has29 = text.includes('29') && text.includes('1.3.7');
            return { isOptimizing, has29 };
          })()`
        }, sId);
        console.log(` - Wait step ${w+1}: optimizing=${check.result.value.isOptimizing}, has29=${check.result.value.has29}`);
        if (!check.result.value.isOptimizing) {
          console.log('[+] Optimization finished!');
          break;
        }
      }
    }

    // Now update release notes if textarea exists
    const RELEASE_NOTES = `<tr-TR>\n- Parmak görüş engeli giderildi: Gemi dokunma noktasının 42px yukarısında seyreder, kontrol ve mermi görüşü %100 açıldı.\n- Siberpunk Pilot Karşılama Brifingi (FTUE) ve anında +500 Hoş Geldin Kristali eklendi.\n- Canlı rekor kırma heyecanı: Uçuş sırasında en iyi skor geçildiği an altın parlama, ses çınlaması ve haptik kutlama devreye girdi.\n- Düşman çeşitliliği zenginleştirildi: Ritmik tehlike uyarıları sonrasında dalış yapan Kamikaze ve Dalış Avcısı (Dive Bomber) dronları eklendi.\n- Dinamik Kademeli Müzik: Uçuş süresine göre sakin ambiyanstan aksiyon temposuna ve Boss savaşına yükselen synthwave melodisi optimize edildi.\n</tr-TR>`;

    console.log('[9] Updating release notes...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const textareas = Array.from(document.querySelectorAll('textarea'));
        for (const ta of textareas) {
          ta.value = ${JSON.stringify(RELEASE_NOTES)};
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          ta.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return 'ok';
      })()`
    }, sId);

    // Dismiss error toast if present
    await send('Runtime.evaluate', {
      expression: `(() => {
        const dismissBtns = Array.from(document.querySelectorAll('button')).filter(b => b.getAttribute('aria-label') === 'Close' || b.innerText === '✕' || b.innerText === 'X');
        dismissBtns.forEach(b => b.click());
      })()`
    }, sId);

    // Save as draft or Next
    console.log('[10] Clicking Save as draft or Next...');
    const clickActionRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button')).filter(b => !b.disabled);
        const saveDraftBtn = btns.find(b => /taslağı kaydet|save as draft/i.test((b.innerText || '').trim()));
        if (saveDraftBtn) {
          saveDraftBtn.click();
          return 'Clicked: ' + saveDraftBtn.innerText;
        }
        const saveBtn = btns.find(b => /^kaydet$|^save$/i.test((b.innerText || '').trim()));
        if (saveBtn) {
          saveBtn.click();
          return 'Clicked: ' + saveBtn.innerText;
        }
        const nextBtn = btns.find(b => /ileri|next/i.test((b.innerText || '').trim()));
        if (nextBtn) {
          nextBtn.click();
          return 'Clicked: ' + nextBtn.innerText;
        }
        return 'No eligible button found. Buttons: ' + btns.map(b => b.innerText.trim()).join(' | ');
      })()`
    }, sId);

    console.log('[11] Click action result:', clickActionRes.result.value);

    // Wait 4s and take screenshot
    await new Promise(r => setTimeout(r, 4000));
    const ss = await send('Page.captureScreenshot', { format: 'png' }, sId);
    const ssPath = 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\995dc029-06a7-4876-b1a7-d623264d4dcc\\play_console_v29_confirmed.png';
    fs.writeFileSync(ssPath, Buffer.from(ss.data, 'base64'));
    console.log('[12] Confirmed screenshot saved to:', ssPath);

    ws.close();
  } catch (err) {
    console.error('[!] Error in execution:', err);
    ws.close();
  }
};
