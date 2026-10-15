const fs = require('fs');

const devtoolsPortFile = fs.readFileSync('C:\\Users\\USER\\AppData\\Local\\Google\\Chrome\\User Data\\DevToolsActivePort', 'utf8').trim().split(/\r?\n/);
const port = devtoolsPortFile[0];
const browserPath = devtoolsPortFile[1];
const wsUrl = `ws://127.0.0.1:${port}${browserPath}`;

let reqId = 1;
const callbacks = {};
const ws = new WebSocket(wsUrl);

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
    const playTarget = targets.find(t => t.url && t.url.includes('4975743417199686988'));
    console.log('Play Console target:', playTarget ? playTarget.url : 'Not found');
    if (!playTarget) {
      ws.close();
      return;
    }
    const attachRes = await send('Target.attachToTarget', { targetId: playTarget.targetId, flatten: true });
    const sId = attachRes.sessionId;

    const pageInfo = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const text = document.body.innerText;
        const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
          text: (b.innerText || '').trim(),
          disabled: b.disabled
        })).filter(b => b.text.length > 0);
        return {
          title: document.title,
          url: window.location.href,
          textIncludes29: text.includes('29') || text.includes('1.3.7'),
          isOptimizing: /optimis|optimize|dağıtım için optimize|işleniyor/i.test(text),
          hasError: /hata|error|44965157/i.test(text),
          buttons: buttons.slice(-10)
        };
      })()`
    }, sId);

    console.log('Page info:', JSON.stringify(pageInfo.result.value, null, 2));

    const ss = await send('Page.captureScreenshot', { format: 'png' }, sId);
    fs.writeFileSync('C:\\Users\\USER\\.gemini\\antigravity\\brain\\995dc029-06a7-4876-b1a7-d623264d4dcc\\play_console_current.png', Buffer.from(ss.data, 'base64'));
    console.log('Screenshot saved to play_console_current.png');

    ws.close();
  } catch (err) {
    console.error('Error:', err);
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
