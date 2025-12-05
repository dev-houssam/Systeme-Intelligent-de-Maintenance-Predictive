// SystemManager.js
import RabbitConnection from "./core/RabbitConnection.js";
import JoinEngine from "./core/JoinEngine.js";
import Notifier from "./core/Notifier.js";
import ProcessingWorker from "./core/ProcessingWorker.js";
import UIWebsocket from "./core/UIWebsocket.js";

const RABBIT = "amqp://localhost";

// exchanges + queues
const ADT = { ex: "adt_exchange", rt: "adt.result", q: "result_adt_queue" };
const IA = { ex: "ia_exchange", rt: "ia.result", q: "result_ia_queue" };
const PROC = { ex: "systeme_manager_processing_exchange", rt: "process", q: "systeme_manager_processing_queue" };
const NOTIF = { ex: "system_manager_notifier_exchange", rt: "notification_alert", q: "notification_queue" };

async function main() {
  const rabbit = new RabbitConnection(RABBIT);
  await rabbit.init();

  // declarations
  await rabbit.declare(ADT.ex, ADT.q, ADT.rt);
  await rabbit.declare(IA.ex, IA.q, IA.rt);
  await rabbit.declare(PROC.ex, PROC.q, PROC.rt);
  await rabbit.declare(NOTIF.ex, NOTIF.q, NOTIF.rt);

  const ui = new UIWebsocket(8080);

  const notifier = new Notifier(rabbit, NOTIF.ex, NOTIF.rt);

  const joinEngine = new JoinEngine(2000, (combined) => {
    notifier.sendAlert(combined);
    ui.broadcast({ type: "processed", data: combined });
  });

  // ingestion ADT
  rabbit.consume(ADT.q, (msg, channel) => {
    const env = { source: "ADT", receivedAt: Date.now(), payload: JSON.parse(msg.content.toString()) };
    rabbit.publish(PROC.ex, PROC.rt, env);
    channel.ack(msg);
  });

  // ingestion IA
  rabbit.consume(IA.q, (msg, channel) => {
    const env = { source: "IA", receivedAt: Date.now(), payload: JSON.parse(msg.content.toString()) };
    rabbit.publish(PROC.ex, PROC.rt, env);
    channel.ack(msg);
  });

  // Workers processing messages
  const worker = new ProcessingWorker(rabbit, PROC.q, joinEngine, ui);
  worker.start();

  console.log("🟢 System Manager opérationnel !");
}

main();
