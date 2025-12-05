// core/ProcessingWorker.js
export default class ProcessingWorker {
  constructor(rabbit, queue, joinEngine, ui) {
    this.rabbit = rabbit;
    this.queue = queue;
    this.joinEngine = joinEngine;
    this.ui = ui;
  }

  start() {
    this.rabbit.consume(this.queue, async (msg, channel) => {
      const payload = JSON.parse(msg.content.toString());
      this.joinEngine.ingest(payload);

      if (this.ui) this.ui.broadcast({ type: "raw", data: payload });

      channel.ack(msg);
    });
  }
}
