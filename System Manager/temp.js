//
import amqp from "amqplib";

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