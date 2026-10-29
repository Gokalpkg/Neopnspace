const fs = require('fs');
const path = require('path');

const zipPath = path.join(__dirname, '..', 'play_store_assets', 'NeonSpace_Achievements_Import.zip');
const b64Path = path.join(__dirname, '..', 'play_store_assets', 'zip_b64.txt');
fs.writeFileSync(b64Path, fs.readFileSync(zipPath).toString('base64'), 'utf8');
console.log('Wrote zip_b64.txt');

const devtoolsPortFile = fs.readFileSync('C:\\Users\\USER\\AppData\\Local\\Google\\Chrome\\User Data\\DevToolsActivePort', 'utf8').trim().split(/\r?\n/);
const port = devtoolsPortFile[0];
const browserPath = devtoolsPortFile[1];
const wsUrl = `ws://127.0.0.1:${port}${browserPath}`;

console.log('Connecting to browser ws:', wsUrl);
const ws = new WebSocket(wsUrl);

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

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && callbacks[msg.id]) {
    const cb = callbacks[msg.id];
    delete callbacks[msg.id];
    if (msg.error) cb.reject(new Error(JSON.stringify(msg.error)));
    else cb.resolve(msg.result);
  }
};

ws.onopen = async () => {
  try {
    const targetsRes = await send('Target.getTargets');
    const target = targetsRes.targetInfos.find(t => t.url && t.url.includes('import-achievements'));
    if (!target) {
      console.error('import-achievements target not found:', targetsRes.targetInfos.map(t => t.url));
      ws.close();
      return;
    }
    console.log('Found target:', target.targetId, target.url);
    const attachRes = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sId = attachRes.sessionId;

    await send('DOM.enable', {}, sId);
    const doc = await send('DOM.getDocument', {}, sId);
    const queryRes = await send('DOM.querySelector', {
      nodeId: doc.root.nodeId,
      selector: 'input[type="file"]'
    }, sId);

    if (!queryRes || !queryRes.nodeId) {
      throw new Error('input[type="file"] not found');
    }

    console.log('Setting file input on nodeId:', queryRes.nodeId);
    await send('DOM.setFileInputFiles', {
      files: [zipPath],
      nodeId: queryRes.nodeId
    }, sId);

    console.log('SUCCESS: Dispatched NeonSpace_Achievements_Import.zip to file input!');
    ws.close();
  } catch (err) {
    console.error('CDP Error:', err);
    ws.close();
  }
};
