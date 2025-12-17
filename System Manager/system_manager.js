// SystemManager.js
import express from "express";
import RabbitConnection from "./core/RabbitConnection.js";
import JoinEngine from "./core/JoinEngine.js";
import Notifier from "./core/Notifier.js";
import ProcessingWorker from "./core/ProcessingWorker.js";
import UIWebsocket from "./core/UIWebsocket.js";
import cors from "cors";

const RABBIT = "amqp://localhost";



// exchanges + queues
const ADT = { ex: "adt_exchange", rt: "adt.result", q: "result_adt_queue" };
const IA = { ex: "ia_exchange", rt: "ia.result", q: "result_ia_queue" };
const PROC = { ex: "systeme_manager_processing_exchange", rt: "process", q: "systeme_manager_processing_queue" };
const NOTIF = { ex: "system_manager_notifier_exchange", rt: "notification_alert", q: "notification_queue" };

// mémoire pour tracking capteurs / historique si besoin
const sensors = new Set();  // pour /status

async function main() {
  const rabbit = new RabbitConnection(RABBIT);
  await rabbit.init();

  // declarations RabbitMQ
  await rabbit.declare(ADT.ex, ADT.q, ADT.rt);
  await rabbit.declare(IA.ex, IA.q, IA.rt);
  await rabbit.declare(PROC.ex, PROC.q, PROC.rt);
  await rabbit.declare(NOTIF.ex, NOTIF.q, NOTIF.rt);

  // --- WebSocket pour dashboard ---
  const ui = new UIWebsocket(8080);
  let nbCapteur = 7;
  // --- HTTP REST API ---
  const app = express();

  app.use(cors());


  app.get("/api/status", (req, res) => {
    res.json({ numSensors: sensors.size });
  });

  app.listen(3500, () => {
    console.log("🌐 REST API server running on port 3000");
  });

  // Notifier RabbitMQ
  const notifier = new Notifier(rabbit, NOTIF.ex, NOTIF.rt);

  // JoinEngine pour combiner données
  const joinEngine = new JoinEngine(2000, (combined) => {
    notifier.sendAlert(combined);

    // broadcast via WebSocket
    ui.broadcast({ type: "processed", data: combined });
  });

  // ingestion ADT
  rabbit.consume(ADT.q, (msg, channel) => {
    const env = { source: "ADT", receivedAt: Date.now(), payload: JSON.parse(msg.content.toString()) };

    // tracker capteurs
    sensors.add(env.payload.sensor_id);

    rabbit.publish(PROC.ex, PROC.rt, env);

    // broadcast raw data
    ui.broadcast({ type: "raw", data: env });

    channel.ack(msg);
  });

  // ingestion IA
  rabbit.consume(IA.q, (msg, channel) => {
    const env = { source: "IA", receivedAt: Date.now(), payload: JSON.parse(msg.content.toString()) };

    sensors.add(env.payload.sensor_id);

    rabbit.publish(PROC.ex, PROC.rt, env);

    // broadcast raw data
    ui.broadcast({ type: "raw", data: env });

    channel.ack(msg);
  });

  // Workers processing messages
  const worker = new ProcessingWorker(rabbit, PROC.q, joinEngine, ui);
  worker.start();

  console.log("🟢 System Manager opérationnel avec REST API + WebSocket !");
}

main();
