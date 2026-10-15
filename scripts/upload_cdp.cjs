const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const targets = JSON.parse(data);
    const target = targets.find(t => t.url && t.url.includes('prepare'));
    if (!target) {
      console.error('Target not found', targets.map(t => t.url));
      return;
    }
    console.log('Found target:', target.title, target.url);
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    ws.onopen = () => {
      console.log('WebSocket connected to CDP');
      ws.send(JSON.stringify({ id: 1, method: 'DOM.getDocument' }));
    };
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 1) {
        console.log('Got document root');
        ws.send(JSON.stringify({
          id: 2,
          method: 'DOM.querySelector',
          params: { nodeId: msg.result.root.nodeId, selector: 'input[type="file"]' }
        }));
      } else if (msg.id === 2) {
        console.log('Found file input node:', msg.result.nodeId);
        ws.send(JSON.stringify({
          id: 3,
          method: 'DOM.setFileInputFiles',
          params: {
            files: ['C:\\Users\\USER\\Desktop\\NeonSpace_v1.2.9_release.aab'],
            nodeId: msg.result.nodeId
          }
        }));
      } else if (msg.id === 3) {
        console.log('SUCCESS: AAB upload dispatched to Play Console!');
        ws.close();
      }
    };
  });
});
