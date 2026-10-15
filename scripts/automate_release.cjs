const fs = require('fs');

const devtoolsPortFile = fs.readFileSync('C:\\Users\\USER\\AppData\\Local\\Google\\Chrome\\User Data\\DevToolsActivePort', 'utf8').trim().split(/\r?\n/);
const port = devtoolsPortFile[0];
const browserPath = devtoolsPortFile[1];
const wsUrl = `ws://127.0.0.1:${port}${browserPath}`;

console.log('Connecting to browser ws:', wsUrl);
const ws = new WebSocket(wsUrl);

const AAB_FILE = 'C:\\Users\\USER\\Desktop\\NeonSpace_v1.3.7_release.aab';
const TRACK_URL = 'https://play.google.com/console/u/0/developers/8199861730425817381/app/4975743417199686988/tracks/4700545205001378002';

const RELEASE_NOTES = `<tr-TR>
- Parmak görüş engeli giderildi: Gemi dokunma noktasının 42px yukarısında seyreder, kontrol ve mermi görüşü %100 açıldı.
- Siberpunk Pilot Karşılama Brifingi (FTUE) ve anında +500 Hoş Geldin Kristali eklendi.
- Canlı rekor kırma heyecanı: Uçuş sırasında en iyi skor geçildiği an altın parlama, ses çınlaması ve haptik kutlama devreye girdi.
- Düşman çeşitliliği zenginleştirildi: Ritmik tehlike uyarıları sonrasında dalış yapan Kamikaze ve Dalış Avcısı (Dive Bomber) dronları eklendi.
- Dinamik Kademeli Müzik: Uçuş süresine göre sakin ambiyanstan aksiyon temposuna ve Boss savaşına yükselen synthwave melodisi optimize edildi.
</tr-TR>`;

let reqId = 1;
const callbacks = {};

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
    let target = targets.find(t => t.url && t.url.includes('4975743417199686988'));
    if (!target) {
      console.log('Target not found, creating new target...');
      const createRes = await send('Target.createTarget', { url: TRACK_URL });
      target = { targetId: createRes.targetId };
    }

    console.log('Attaching to target:', target.targetId);
    const attachRes = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sId = attachRes.sessionId;

    await send('DOM.enable', {}, sId);
    await send('Page.enable', {}, sId);

    // Click "Create new release" button
    console.log('Clicking Create new release button...');
    const clickRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button, a, span')).filter(el => {
          const txt = (el.innerText || el.textContent || '').trim();
          return /create.*release|yeni.*sürüm/i.test(txt);
        });
        if (btns.length > 0) {
          const btn = btns[btns.length - 1]; // usually the button element or inner span
          btn.click();
          if (btn.parentElement && btn.parentElement.tagName === 'BUTTON') btn.parentElement.click();
          return 'clicked: ' + (btn.innerText || btn.textContent);
        }
        return 'not found';
      })()`
    }, sId);
    console.log('Create release click result:', clickRes.result.value);

    // Wait for release preparation page to load
    console.log('Waiting for prepare release page...');
    let fileInputNodeId = null;
    for (let attempt = 0; attempt < 15; attempt++) {
      await new Promise(r => setTimeout(r, 2000));
      const doc = await send('DOM.getDocument', {}, sId);
      const queryRes = await send('DOM.querySelector', {
        nodeId: doc.root.nodeId,
        selector: 'input[type="file"]'
      }, sId);
      if (queryRes && queryRes.nodeId) {
        fileInputNodeId = queryRes.nodeId;
        console.log(`Found file input on attempt ${attempt + 1}! nodeId:`, fileInputNodeId);
        break;
      }
      console.log(`Attempt ${attempt + 1}: input[type="file"] not found yet, retrying...`);
    }

    if (!fileInputNodeId) {
      throw new Error('Could not find input[type="file"] on prepare release page');
    }

    // Set AAB file
    console.log('Uploading AAB file:', AAB_FILE);
    await send('DOM.setFileInputFiles', {
      files: [AAB_FILE],
      nodeId: fileInputNodeId
    }, sId);
    console.log('DOM.setFileInputFiles dispatched successfully!');

    // Poll for upload completion
    console.log('Monitoring bundle upload progress...');
    let uploadSuccess = false;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 4000));
      const statusCheck = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const text = document.body.innerText;
          const has29 = text.includes('29') || text.includes('1.3.7');
          const uploading = /yükleniyor|uploading|\d+%/i.test(text);
          const errorMsg = /hata|error|failed/i.test(text);
          return { has29, uploading, textSlice: text.slice(0, 500) };
        })()`
      }, sId);
      console.log(`[Upload poll ${i+1}] has29: ${statusCheck.result.value.has29}, uploading: ${statusCheck.result.value.uploading}`);
      if (statusCheck.result.value.has29 && !statusCheck.result.value.uploading) {
        uploadSuccess = true;
        console.log('Bundle 29 (1.3.7) uploaded and verified!');
        break;
      }
    }

    // Update release notes
    console.log('Entering release notes...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const textareas = Array.from(document.querySelectorAll('textarea'));
        for (const ta of textareas) {
          ta.value = ${JSON.stringify(RELEASE_NOTES)};
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          ta.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return 'notes updated';
      })()`
    }, sId);

    // Save release (Save as draft or Next)
    console.log('Saving release...');
    await new Promise(r => setTimeout(r, 2000));
    const saveRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button')).filter(b => !b.disabled);
        const saveBtn = btns.find(b => /taslağı kaydet|save as draft|kaydet|save/i.test((b.innerText || '').trim()));
        if (saveBtn) {
          saveBtn.click();
          return 'clicked save draft: ' + saveBtn.innerText;
        }
        const nextBtn = btns.find(b => /ileri|next/i.test((b.innerText || '').trim()));
        if (nextBtn) {
          nextBtn.click();
          return 'clicked next: ' + nextBtn.innerText;
        }
        return 'no active save/next button';
      })()`
    }, sId);
    console.log('Save result:', saveRes.result.value);

    // Capture screenshot
    await new Promise(r => setTimeout(r, 4000));
    const ss = await send('Page.captureScreenshot', { format: 'png' }, sId);
    fs.writeFileSync('C:\\Users\\USER\\.gemini\\antigravity\\brain\\995dc029-06a7-4876-b1a7-d623264d4dcc\\play_console_v29_success.png', Buffer.from(ss.data, 'base64'));
    console.log('Saved screenshot: play_console_v29_success.png');

    ws.close();
  } catch (err) {
    console.error('Automation error:', err);
    ws.close();
  }
};

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && callbacks[msg.id]) {
    if (msg.error) callbacks[msg.id].reject(msg.error);
    else callbacks[msg.id].resolve(msg.result);
    delete callbacks[msg.id];
  }
};
