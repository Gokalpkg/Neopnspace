// === NEON SPACE SURVIVOR - EVENT BUS (OLAY VERİ YOLU MİMARİSİ) ===
// KURAL 4: Modüler Eklenti ve Olay Odaklı (Event-Driven) Mimari
// Game loop, ses, haptik, analitik ve UI sistemleri arasındaki sıkı bağı (tight-coupling) kırar.

class EventBusEmitter {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Bir olaya dinleyici bağlar.
   * @param {string} eventName - Olay adı (örn: 'ENTITY_DESTROYED', 'CRYSTAL_COLLECTED')
   * @param {Function} callback - Dinleyici fonksiyon
   * @returns {Function} Dinleyiciyi kaldıran temizleme fonksiyonu
   */
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);
    return () => this.off(eventName, callback);
  }

  /**
   * Bir olaydan dinleyiciyi kaldırır.
   * @param {string} eventName
   * @param {Function} callback
   */
  off(eventName, callback) {
    if (this.listeners.has(eventName)) {
      const set = this.listeners.get(eventName);
      set.delete(callback);
      if (set.size === 0) {
        this.listeners.delete(eventName);
      }
    }
  }

  /**
   * Bir olay sinyali fırlatır.
   * @param {string} eventName
   * @param {any} data
   */
  emit(eventName, data) {
    if (this.listeners.has(eventName)) {
      const set = this.listeners.get(eventName);
      for (const callback of set) {
        try {
          callback(data);
        } catch (err) {
          console.error(`[EventBus] Error in event '${eventName}':`, err);
        }
      }
    }
  }

  /**
   * Sadece bir kez çalışan dinleyici ekler.
   * @param {string} eventName
   * @param {Function} callback
   */
  once(eventName, callback) {
    const unregister = this.on(eventName, (data) => {
      unregister();
      callback(data);
    });
    return unregister;
  }

  /**
   * Tüm dinleyicileri temizler.
   */
  clear() {
    this.listeners.clear();
  }
}

export const EventBus = new EventBusEmitter();
