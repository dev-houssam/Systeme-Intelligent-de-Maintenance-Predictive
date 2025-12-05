// core/JoinEngine.js

export default class JoinEngine {
  constructor(windowMs, onCombined) {
    this.windowMs = windowMs;
    this.cache = new Map();
    this.onCombined = onCombined;
  }

  ingest(env) {
    const src = env.source;
    const payload = env.payload || {};
    const sensorId = payload.sensor_id || "unknown";

    const existing = this.cache.get(sensorId);

    // counterpart found
    if (existing && existing.source !== src) {
      clearTimeout(existing.timeout);
      this.cache.delete(sensorId);

      const combined = {
        sensor_id: sensorId,
        adt: src === "ADT" ? payload : existing.msg.payload,
        ia: src === "IA" ? payload : existing.msg.payload,
        sources: [existing.source, src],
        receivedAt: Date.now(),
      };

      this.onCombined(combined);
    } else {
      // store and wait
      const record = {
        source: src,
        msg: env,
        timeout: setTimeout(() => {
          this.cache.delete(sensorId);

          const single = {
            sensor_id: sensorId,
            adt: src === "ADT" ? payload : null,
            ia: src === "IA" ? payload : null,
            sources: [src],
            receivedAt: Date.now(),
          };

          this.onCombined(single);
        }, this.windowMs),
      };

      this.cache.set(sensorId, record);
    }
  }
}
