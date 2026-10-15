const fs = require('fs');
const devtoolsPortFile = fs.readFileSync('C:\\Users\\USER\\AppData\\Local\\Google\\Chrome\\User Data\\DevToolsActivePort', 'utf8').trim().split(/\r?\n/);
const port = devtoolsPortFile[0];
const browserPath = devtoolsPortFile[1];
const wsUrl = `ws://127.0.0.1:${port}${browserPath}`;

console.log('Connecting to browser ws:', wsUrl);
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  ws.send(JSON.stringify({ id: 1, method: 'Target.getTargets' }));
};

let sessionId = null;
let msgId = 2;

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.id === 1) {
    const targets = data.result.targetInfos;
    const closedTesting = targets.find(t => t.url && (t.url.includes('closed-testing') || t.url.includes('tracks')));
    if (!closedTesting) {
      console.error('Closed testing tab not found among targets:', targets.map(t => ({ title: t.title, url: t.url })));
      ws.close();
      return;
    }
    console.log('Found closed testing tab:', closedTesting.title, closedTesting.targetId);
    ws.send(JSON.stringify({
      id: 2,
      method: 'Target.attachToTarget',
      params: { targetId: closedTesting.targetId, flatten: true }
    }));
  } else if (data.id === 2) {
    sessionId = data.result.sessionId;
    console.log('Attached with sessionId:', sessionId);
    ws.send(JSON.stringify({
      id: 3,
      sessionId,
      method: 'Runtime.evaluate',
      params: {
        returnByValue: true,
        expression: `(() => {
          const btns = Array.from(document.querySelectorAll('button, a')).map(b => ({
            tag: b.tagName,
            text: (b.innerText || b.textContent || '').trim().replace(/\\s+/g, ' '),
            ariaLabel: b.getAttribute('aria-label') || '',
            href: b.href || ''
          })).filter(b => b.text || b.ariaLabel);
          return { url: location.href, title: document.title, btns };
        })()`
      }
    }));
  } else if (data.id === 3) {
    console.log('Page info:', JSON.stringify(data.result.result.value, null, 2));
    ws.close();
  }
};
