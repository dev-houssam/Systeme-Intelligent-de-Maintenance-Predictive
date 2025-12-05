// core/RabbitConnection.js
import amqp from "amqplib";

export default class RabbitConnection {
  constructor(url) {
    this.url = url;
    this.channel = null;
  }

  async init() {
    this.conn = await amqp.connect(this.url);
    this.channel = await this.conn.createChannel();
    console.log("🐰 RabbitMQ connecté");
  }

  async declare(exchange, queue, routing) {
    await this.channel.assertExchange(exchange, "direct", { durable: true });
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(queue, exchange, routing);
  }

  publish(exchange, routing, msg) {
    this.channel.publish(exchange, routing, Buffer.from(JSON.stringify(msg)), {
      persistent: true,
    });
  }

  consume(queue, handler) {
    this.channel.consume(
      queue,
      (msg) => handler(msg, this.channel),
      { noAck: false }
    );
  }
}
