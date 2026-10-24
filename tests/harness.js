import { register } from 'node:module';

// Register the custom loader hook once
try {
  register(new URL('./test-loader.js', import.meta.url));
} catch (e) {
  // Already registered or not supported
}

// Memory-backed localStorage implementation
const storageMap = new Map();
const mockLocalStorage = {
  getItem(k) { return storageMap.has(k) ? storageMap.get(k) : null; },
  setItem(k, v) { storageMap.set(String(k), String(v)); },
  removeItem(k) { storageMap.delete(String(k)); },
  clear() { storageMap.clear(); },
  key(i) { return Array.from(storageMap.keys())[i] || null; },
  get length() { return storageMap.size; }
};

// Canvas 2D Context Mock
function createMockContext(canvas) {
  return {
    canvas,
    fillStyle: '#000',
    strokeStyle: '#fff',
    lineWidth: 1,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    shadowBlur: 0,
    shadowColor: 'transparent',
    fillRect: () => {},
    clearRect: () => {},
    strokeRect: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    arcTo: () => {},
    ellipse: () => {},
    rect: () => {},
    fill: () => {},
    stroke: () => {},
    clip: () => {},
    save: () => {},
    restore: () => {},
    translate: () => {},
    rotate: () => {},
    scale: () => {},
    setTransform: () => {},
    resetTransform: () => {},
    drawImage: () => {},
    createRadialGradient: () => ({ addColorStop: () => {} }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createPattern: () => null,
    measureText: (txt) => ({ width: (txt || '').length * 8, actualBoundingBoxAscent: 10, actualBoundingBoxDescent: 2 }),
    fillText: () => {},
    strokeText: () => {}
  };
}

// DOM Element Mock
function createMockElement(id = 'mock-elem', tagName = 'div') {
  const elem = {
    id,
    tagName: tagName.toUpperCase(),
    style: {
      setProperty(k, v) { this[k] = String(v); },
      getPropertyValue(k) { return this[k] || ''; },
      removeProperty(k) { delete this[k]; }
    },
    className: '',
    children: [],
    parentNode: null,
    innerHTML: '',
    textContent: '',
    dataset: {},
    _attrs: new Map(),
    classList: {
      _classes: new Set(),
      add(...cls) { cls.forEach(c => this._classes.add(c)); },
      remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
      toggle(c) { if (this._classes.has(c)) { this._classes.delete(c); return false; } this._classes.add(c); return true; },
      contains(c) { return this._classes.has(c); }
    },
    setAttribute(k, v) { elem._attrs.set(k, String(v)); },
    getAttribute(k) { return elem._attrs.has(k) ? elem._attrs.get(k) : null; },
    removeAttribute(k) { elem._attrs.delete(k); },
    hasAttribute(k) { return elem._attrs.has(k); },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
    appendChild(child) {
      elem.children.push(child);
      if (child) {
        child.parentNode = elem;
        elem.innerHTML += `<${(child.tagName || 'div').toLowerCase()} class="${child.className || ''}" title="${child.title || ''}">${child.innerHTML || ''}</${(child.tagName || 'div').toLowerCase()}>`;
      }
      return child;
    },
    removeChild(child) { elem.children = elem.children.filter(c => c !== child); return child; },
    remove() { if (elem.parentNode) elem.parentNode.removeChild(elem); },
    querySelector: () => null,
    querySelectorAll: () => [],
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 360, height: 740, right: 360, bottom: 740 })
  };

  const mockCtx = createMockContext(elem);
  elem.getContext = (type) => (type === '2d' ? mockCtx : null);
  return elem;
}

// Setup Global Browser Environment
const elementsById = new Map();

function getOrCreateElement(id) {
  if (!elementsById.has(id)) {
    const elem = createMockElement(id);
    if (id.endsWith('-modal') || id.endsWith('-overlay') || id === 'evolution-banner' || id === 'boss-warning-overlay') {
      elem.classList.add('hidden');
    }
    elementsById.set(id, elem);
  }
  return elementsById.get(id);
}

globalThis.window = globalThis;
globalThis.innerWidth = 360;
globalThis.innerHeight = 740;
globalThis.localStorage = mockLocalStorage;
globalThis.addEventListener = () => {};
globalThis.removeEventListener = () => {};
globalThis.requestAnimationFrame = () => 1;
globalThis.cancelAnimationFrame = () => {};

try {
  Object.defineProperty(globalThis, 'navigator', {
    value: { language: 'en-GB', languages: ['en-GB'], vibrate: () => true },
    configurable: true,
    writable: true
  });
} catch (e) {}

const bodyElement = createMockElement('body', 'body');
globalThis.document = {
  readyState: 'complete',
  body: bodyElement,
  documentElement: { lang: 'en', style: {} },
  getElementById: (id) => getOrCreateElement(id),
  createElement: (tag) => createMockElement(`dyn-${tag}`, tag),
  querySelector: (sel) => {
    if (sel.startsWith('#')) return getOrCreateElement(sel.slice(1));
    return createMockElement('sel-' + sel);
  },
  querySelectorAll: () => [],
  addEventListener: () => {},
  removeEventListener: () => {}
};

// Import dependencies
export const i18nModule = await import('../src/i18n.js');
export const catalogModule = await import('../src/catalog-i18n.js');
export const particlesModule = await import('../src/particles.js');
export const enemiesModule = await import('../src/enemies.js');

// Import game module which creates window.game
await import('../src/game.js');

export function getGame() {
  return window.game;
}

export function resetLocalStorage(initial = {}) {
  mockLocalStorage.clear();
  for (const [k, v] of Object.entries(initial)) {
    mockLocalStorage.setItem(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
  }
  if (window.game) {
    window.game._shipStars = null;
  }
}

export function getStorage() {
  return mockLocalStorage;
}
