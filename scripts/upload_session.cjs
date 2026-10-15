const browserWs = 'ws://127.0.0.1:9222/devtools/browser/2c29b750-adb6-4668-938b-d8984d3ec12b';
const filePath = 'C:\\Users\\USER\\Desktop\\NeonSpace_v1.2.9_release.aab';

const ws = new WebSocket(browserWs);
ws.onopen = () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Target.attachToTarget',
    params: {
      targetId: '6AD4A39C47106510057F1AD5A6F4E0F4',
      flatten: true
    }
  }));
};

let sessionId = null;

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id === 1) {
    sessionId = msg.result.sessionId;
    console.log('Attached to target! sessionId:', sessionId);
    ws.send(JSON.stringify({
      sessionId,
      id: 2,
      method: 'DOM.getDocument'
    }));
  } else if (msg.id === 2) {
    console.log('Got document root');
    ws.send(JSON.stringify({
      sessionId,
      id: 3,
      method: 'DOM.querySelector',
      params: { nodeId: msg.result.root.nodeId, selector: 'input[type="file"][accept*="aab"]' }
    }));
  } else if (msg.id === 3) {
    let nodeId = msg.result.nodeId;
    console.log('Selector for aab input result:', nodeId);
    if (!nodeId) {
      ws.send(JSON.stringify({
        sessionId,
        id: 4,
        method: 'DOM.querySelector',
        params: { nodeId: 1, selector: 'input[type="file"]' }
      }));
      return;
    }
    ws.send(JSON.stringify({
      sessionId,
      id: 5,
      method: 'DOM.setFileInputFiles',
      params: {
        files: [filePath],
        nodeId: nodeId
      }
    }));
  } else if (msg.id === 4) {
    console.log('Fallback generic file input result:', msg.result.nodeId);
    ws.send(JSON.stringify({
      sessionId,
      id: 5,
      method: 'DOM.setFileInputFiles',
      params: {
        files: [filePath],
        nodeId: msg.result.nodeId
      }
    }));
  } else if (msg.id === 5) {
    console.log('SUCCESS! DOM.setFileInputFiles result:', msg);
    setTimeout(() => {
      console.log('Finished upload dispatch.');
      ws.close();
    }, 1500);
  }
};

ws.onerror = (err) => console.error('WS Error:', err);
