const targetId = '6AD4A39C47106510057F1AD5A6F4E0F4';
const browserWs = 'ws://127.0.0.1:9222/devtools/page/' + targetId;
const filePath = 'C:\\Users\\USER\\Desktop\\NeonSpace_v1.2.9_release.aab';

const ws = new WebSocket(browserWs);
ws.onopen = () => {
  console.log('Connected to Play Console page websocket!');
  ws.send(JSON.stringify({ id: 1, method: 'DOM.getDocument' }));
};

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id === 1) {
    console.log('Got document root');
    ws.send(JSON.stringify({
      id: 2,
      method: 'DOM.querySelector',
      params: { nodeId: msg.result.root.nodeId, selector: 'input[type="file"]' }
    }));
  } else if (msg.id === 2) {
    console.log('Found file input nodeId:', msg.result.nodeId);
    if (!msg.result.nodeId) {
      console.error('File input not found!');
      ws.close();
      return;
    }
    ws.send(JSON.stringify({
      id: 3,
      method: 'DOM.setFileInputFiles',
      params: {
        files: [filePath],
        nodeId: msg.result.nodeId
      }
    }));
  } else if (msg.id === 3) {
    console.log('SUCCESS: DOM.setFileInputFiles dispatched for', filePath);
    setTimeout(() => ws.close(), 1000);
  }
};
ws.onerror = (err) => {
  console.error('WebSocket error:', err);
};
