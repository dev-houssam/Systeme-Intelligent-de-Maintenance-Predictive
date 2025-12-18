import pika
import json
from ClientMongoDataBase import ClientMongoDataBase

class ClientRabbitMQ:
    def __init__(self, host: str, exchange: str, queue: str, mongo_client: ClientMongoDataBase):
        self.host = host
        self.exchange = exchange
        self.queue = queue
        self.mongo_client = mongo_client

        # Connexion à RabbitMQ
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.host))
        self.channel = self.connection.channel()

        # Déclarer l'exchange et la queue
        self.channel.exchange_declare(exchange=self.exchange, exchange_type='topic', durable=True)
        self.channel.queue_declare(queue=self.queue, durable=True)
        self.channel.queue_bind(exchange=self.exchange, queue=self.queue)

    def start_consuming(self):
        # Consommation des messages
        def callback(ch, method, properties, body):
            try:
                # Envoi vers MongoDB
                try:
                    data = json.loads(body)
                    print(data)
                    self.mongo_client.insert_capteur(data)
                except Exception as e:
                    print("client mongo disfonctionne NACK2RMQ", e)
                    ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)

                # Ack le message
                ch.basic_ack(delivery_tag=method.delivery_tag)
            except Exception as e:
                print("Erreur lors du traitement du message:", e)
                ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)

        self.channel.basic_consume(queue=self.queue, on_message_callback=callback)
        print("En attente des messages... Mongo Database opened to receive capteurs data [...]")
        self.channel.start_consuming()
