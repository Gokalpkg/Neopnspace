import http from 'http';

function getTabs() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  const tabs = await getTabs();
  console.log('Available tabs count:', tabs.length);
  const targetTab = tabs.find(t => t.url && (t.url.includes('prepare') || t.url.includes('play.google.com/console')));
  
  if (!targetTab) {
    console.error('Target Play Console tab not found! Available titles:', tabs.map(t => t.title));
    process.exit(1);
  }
  
  console.log('Target Tab:', targetTab.title, targetTab.url);
  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  
  ws.onopen = () => {
    console.log('Connected to Chrome DevTools WebSocket');
    ws.send(JSON.stringify({ id: 1, method: 'DOM.getDocument' }));
  };
  
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id === 1) {
      console.log('Document root obtained');
      ws.send(JSON.stringify({
        id: 2,
        method: 'DOM.querySelector',
        params: {
          nodeId: msg.result.root.nodeId,
          selector: 'input[accept*="aab"], input[type="file"]'
        }
      }));
    } else if (msg.id === 2) {
      console.log('FileInput Node ID:', msg.result ? msg.result.nodeId : 'None');
      if (!msg.result || !msg.result.nodeId) {
        console.error('File input not found in DOM!');
        process.exit(1);
      }
      ws.send(JSON.stringify({
        id: 3,
        method: 'DOM.setFileInputFiles',
        params: {
          files: ['C:\\Users\\USER\\Desktop\\NEON_SPACE_SURVIVOR_v1.7.8.aab'],
          nodeId: msg.result.nodeId
        }
      }));
    } else if (msg.id === 3) {
      console.log('DOM.setFileInputFiles response:', msg);
      setTimeout(() => {
        console.log('File upload initiated successfully!');
        process.exit(0);
      }, 1500);
    }
  };
  
  ws.onerror = (err) => {
    console.error('WebSocket error:', err);
    process.exit(1);
  };
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
