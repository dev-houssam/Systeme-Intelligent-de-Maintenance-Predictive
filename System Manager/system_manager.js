/*import amqp from "amqplib";

const RABBIT_URL = "amqp://localhost";

// ADT
const ADT_EXCHANGE = "adt_exchange";
const ADT_QUEUE = "result_adt_queue";
const ADT_ROUTING = "adt.result";

// IA
const IA_EXCHANGE = "ia_exchange";
const IA_QUEUE = "result_ia_queue";
const IA_ROUTING = "ia.result";

async function startManager() {
    const connection = await amqp.connect(RABBIT_URL);
    const channel = await connection.createChannel();

    // ADT Exchange + Queue
    await channel.assertExchange(ADT_EXCHANGE, "direct", { durable: true });
    await channel.assertQueue(ADT_QUEUE, { durable: true });
    await channel.bindQueue(ADT_QUEUE, ADT_EXCHANGE, ADT_ROUTING);

    // IA Exchange + Queue
    await channel.assertExchange(IA_EXCHANGE, "direct", { durable: true });
    await channel.assertQueue(IA_QUEUE, { durable: true });
    await channel.bindQueue(IA_QUEUE, IA_EXCHANGE, IA_ROUTING);

    console.log("🟢 Système Manager écoute ADT + IA...\n");




    // Consommation IA
    channel.consume(IA_QUEUE, (msg) => {
        const data = JSON.parse(msg.content.toString());
        console.log("🤖 IA →", data);
        channel.ack(msg);
    });


    // Consommation ADT
    channel.consume(ADT_QUEUE, (msg) => {
        const data = JSON.parse(msg.content.toString());
        console.log("📩 ADT →", data);
        channel.ack(msg);
    });

    
}

startManager();
*/








import amqp from "amqplib";
import WebSocket, { WebSocketServer } from "ws";

/*
  System Manager:
  - consomme ADT et IA
  - pousse chaque message reçu vers une queue durable de traitement
  - worker consomme la queue de traitement et appelle TraitementGeneral(...)
  - TraitementGeneral tente d'agréger ADT+IA par sensor_id (fenêtre temporelle),
    appelle inferenceEngine pour décider d'envoyer une alerte,
    publie sur exchange notifier si alerte,
    envoie toujours vers websocket UI.
*/

// Rabbit config
const RABBIT_URL = "amqp://localhost";

// Sources
const ADT_EXCHANGE = "adt_exchange";
const ADT_ROUTING = "adt.result";
const ADT_QUEUE = "result_adt_queue";

const IA_EXCHANGE = "ia_exchange";
const IA_ROUTING = "ia.result";
const IA_QUEUE = "result_ia_queue";

// Pipeline / traitement
const PROC_EXCHANGE = "systeme_manager_processing_exchange";
const PROC_ROUTING = "process";
const PROC_QUEUE = "systeme_manager_processing_queue";

// Notification publish
const NOTIF_EXCHANGE = "systeme_manager_notifier_exchange";
const NOTIF_ROUTING = "notification.alert";
const NOTIF_QUEUE = "notification_queue"; // used by notification system

// Websocket config
const WS_PORT = 8080;

// Paramètres d'agrégation (join)
const JOIN_WINDOW_MS = 2000; // fenêtre pour attendre l'autre source (ADT/IA) par sensor_id

// Cache simple pour faire la jonction ADT <-> IA
// Map<sensorId, { msg: any, source: "ADT"|"IA", timestamp: Number, timeout: Timeout }>
const joinCache = new Map();

async function startSystemManager() {
  const conn = await amqp.connect(RABBIT_URL);
  const channel = await conn.createChannel();

  // === Déclarations nécessaires ===
  // ADT + IA exchanges/queues (idempotent)
  await channel.assertExchange(ADT_EXCHANGE, "direct", { durable: true });
  await channel.assertQueue(ADT_QUEUE, { durable: true });
  await channel.bindQueue(ADT_QUEUE, ADT_EXCHANGE, ADT_ROUTING);

  await channel.assertExchange(IA_EXCHANGE, "direct", { durable: true });
  await channel.assertQueue(IA_QUEUE, { durable: true });
  await channel.bindQueue(IA_QUEUE, IA_EXCHANGE, IA_ROUTING);

  // Processing exchange + durable queue (garantit que les messages d'ingestion ne se perdent pas)
  await channel.assertExchange(PROC_EXCHANGE, "direct", { durable: true });
  await channel.assertQueue(PROC_QUEUE, { durable: true });
  await channel.bindQueue(PROC_QUEUE, PROC_EXCHANGE, PROC_ROUTING);

  // Notifier exchange + queue (pour Notification System)
  await channel.assertExchange(NOTIF_EXCHANGE, "direct", { durable: true });
  await channel.assertQueue(NOTIF_QUEUE, { durable: true });
  await channel.bindQueue(NOTIF_QUEUE, NOTIF_EXCHANGE, NOTIF_ROUTING);

  console.log("✅ RabbitMQ declarations OK");

  // === WebSocket server ===
  const wss = new WebSocketServer({ port: WS_PORT });
  wss.on("connection", (ws) => {
    console.log("🔌 UI WebSocket connecté");
    ws.send(JSON.stringify({ info: "Connected to System Manager WS" }));
  });

  function broadcastToUI(obj) {
    const s = JSON.stringify(obj);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(s);
      }
    }
  }

  // === Fonctions utilitaires ===
  async function publishToProcessingQueue(payload) {
    // payload is JSON-serializable
    const body = Buffer.from(JSON.stringify(payload));
    // persistent: true pour garantir stockage sur disque si broker crash
    channel.publish(PROC_EXCHANGE, PROC_ROUTING, body, { persistent: true });
  }

  async function publishAlert(alert) {
    const body = Buffer.from(JSON.stringify(alert));
    channel.publish(NOTIF_EXCHANGE, NOTIF_ROUTING, body, { persistent: true });
    console.log("🔔 Alerte publiée vers le Notification Exchange:", alert);
  }

  // === Consommation initiale (ADT & IA) ===
  // Lorsqu'on reçoit un message ADT/IA, on le pousse dans la queue de processing,
  // puis les workers s'en chargent (séparation ingestion/processing).
  channel.consume(
    ADT_QUEUE,
    (msg) => {
      if (!msg) return;
      try {
        const data = JSON.parse(msg.content.toString());
        const envelope = {
          source: "ADT",
          receivedAt: Date.now(),
          payload: data,
        };
        publishToProcessingQueue(envelope);
      } catch (err) {
        console.error("Erreur parse ADT:", err);
      } finally {
        channel.ack(msg);
      }
    },
    { noAck: false }
  );

  channel.consume(
    IA_QUEUE,
    (msg) => {
      if (!msg) return;
      try {
        const data = JSON.parse(msg.content.toString());
        const envelope = {
          source: "IA",
          receivedAt: Date.now(),
          payload: data,
        };
        publishToProcessingQueue(envelope);
      } catch (err) {
        console.error("Erreur parse IA:", err);
      } finally {
        channel.ack(msg);
      }
    },
    { noAck: false }
  );

  console.log("🟢 System Manager: messages ADT & IA ingérés et routés vers la queue de processing");

  // === Worker: consomme la queue de processing et appelle TraitementGeneral ===
  // On lance N workers concurrents. Ici on en fait 4 par exemple.
  const WORKER_COUNT = 4;
  for (let i = 0; i < WORKER_COUNT; i++) {
    startWorker(channel, broadcastToUI);
  }

  console.log(`👷‍ Workers lancés: ${WORKER_COUNT}`);
}

// Worker: consomme PROC_QUEUE en continu
async function startWorker(channel, broadcastToUI) {
  // Create a consumer tag so we can have multiple workers on same queue
  const consumer = await channel.consume(
    PROC_QUEUE,
    async (msg) => {
      if (!msg) return;
      try {
        const env = JSON.parse(msg.content.toString());
        await TraitementGeneral(env, channel, broadcastToUI);
        channel.ack(msg);
      } catch (err) {
        console.error("Erreur traitement message:", err);
        // si on veut requeue: channel.nack(msg, false, true)
        // pour éviter des boucles infinies, nack sans requeue pourrait être préférable:
        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );
}

// === TraitementGeneral ===
// - Reçoit un envelope { source, receivedAt, payload }
// - Gère une jonction ADT+IA par sensor_id dans une fenêtre JOIN_WINDOW_MS
// - Exécute inferenceEngine(combined) -> bool shouldAlert
// - Si shouldAlert => publishAlert vers NOTIF_EXCHANGE
// - Toujours broadcastToUI(combinedOrSingle)
async function TraitementGeneral(envelope, channel, broadcastToUI) {
  const src = envelope.source; // "ADT"|"IA"
  const payload = envelope.payload || {};
  const sensorId = payload.sensor_id || payload.sensorId || "unknown";
  const now = Date.now();

  // Helper to build standardized record
  function buildRecord(src, payload, receivedAt) {
    return {
      source: src,
      sensor_id: sensorId,
      payload: payload,
      receivedAt,
    };
  }

  // Try to find counterpart in cache
  const cacheKey = sensorId;
  const existing = joinCache.get(cacheKey);

  if (existing && existing.source !== src) {
    // Found counterpart -> create combined object and process immediately
    clearTimeout(existing.timeout);
    joinCache.delete(cacheKey);

    const combined = {
      sensor_id: sensorId,
      adt: src === "ADT" ? payload : existing.msg.payload,
      ia: src === "IA" ? payload : existing.msg.payload,
      receivedAt: now,
      sources: [existing.source, src],
    };

    await processCombined(combined, channel, broadcastToUI);
  } else {
    // No counterpart yet -> store and wait for JOIN_WINDOW_MS
    const record = {
      msg: buildRecord(src, payload, now),
      source: src,
      timestamp: now,
      timeout: setTimeout(async () => {
        // Timeout: counterpart didn't arrive in window -> process single
        joinCache.delete(cacheKey);
        const single = {
          sensor_id: sensorId,
          adt: src === "ADT" ? payload : null,
          ia: src === "IA" ? payload : null,
          receivedAt: Date.now(),
          sources: [src],
        };
        await processCombined(single, channel, broadcastToUI);
      }, JOIN_WINDOW_MS),
    };
    joinCache.set(cacheKey, record);
  }
}

// processCombined: run inference, publish alert if needed, broadcast to UI
async function processCombined(combined, channel, broadcastToUI) {
  try {
    // 1) Normaliser / enrichir les données si nécessaire
    const normalized = {
      sensor_id: combined.sensor_id,
      adt: combined.adt,
      ia: combined.ia,
      receivedAt: combined.receivedAt,
      sources: combined.sources,
    };

    // 2) Appel au moteur d'inference (async) - stub
    const shouldAlert = await inferenceEngine(normalized);

    // 3) Si alerte -> publier vers exchange notifier
    if (shouldAlert) {
      const alert = {
        sensor_id: normalized.sensor_id,
        message: "Anomalie confirmée par System Manager",
        adt: normalized.adt,
        ia: normalized.ia,
        timestamp: new Date().toISOString(),
        severity: "critical",
      };
      // publish durable
      channel.publish(
        NOTIF_EXCHANGE,
        NOTIF_ROUTING,
        Buffer.from(JSON.stringify(alert)),
        { persistent: true }
      );
      console.log("→ Alerte envoyée:", alert);
    }

    // 4) Toujours envoyer à l'interface web (websocket)
    broadcastToUI({
      type: "processed_data",
      data: normalized,
      alert: shouldAlert,
      ts: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Erreur dans processCombined:", err);
  }
}

// stub d'un moteur d'inference async (ici tu connecteras ton vrai moteur)
// retourne Promise<boolean>
async function inferenceEngine(normalizedData) {
  // Exemple simple : si ADT ou IA indique anomaly == true -> alert
  try {
    const adtAnom =
      normalizedData.adt && (normalizedData.adt.anomaly === true || normalizedData.adt.anomaly === "true");
    const iaAnom =
      normalizedData.ia && (normalizedData.ia.anomaly === true || normalizedData.ia.anomaly === "true");

    // si l'un des deux détecte anomalie -> véritable alerte
    if (adtAnom || iaAnom) return true;

    // Sinon tu peux ajouter vrai appel de modèle ici (HTTP, gRPC...)
    // Await callExternalModel(...)

    // heuristique supplémentaire: si values are out of bounds -> alert
    const value =
      (normalizedData.adt && normalizedData.adt.value) ||
      (normalizedData.ia && normalizedData.ia.value) ||
      null;
    if (value !== null && (value < 0 || value > 1000)) return true;

    // sinon pas d'alerte
    return false;
  } catch (err) {
    console.error("Erreur inferenceEngine:", err);
    return false;
  }
}

// Start everything
startSystemManager().catch((err) => {
  console.error("System Manager erreur critique:", err);
  process.exit(1);
});
