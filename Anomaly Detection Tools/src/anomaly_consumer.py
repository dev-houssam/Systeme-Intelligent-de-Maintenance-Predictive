import pika
import json
from core.adapter import from_rabbit
from core.context import SensorContext
from engine.lifecycle import init_engine

# ---------- CONFIG ----------
RABBIT_HOST = "localhost"

EXCHANGE_NAME = "raw_data_exchange"
QUEUE_NAME = "anomaly_detection_queue"
ROUTING_KEY = "capteurs_data"

ADT_EXCHANGE = "adt_exchange"
ADT_ROUTING_KEY = "adt.result"

# ---------- CONNEXION ----------
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=RABBIT_HOST)
)
channel = connection.channel()

# ---------- EXCHANGE / QUEUE ----------
channel.exchange_declare(exchange=EXCHANGE_NAME, exchange_type='topic', durable=True)
channel.queue_declare(queue=QUEUE_NAME, durable=True)
channel.queue_bind(exchange=EXCHANGE_NAME, queue=QUEUE_NAME, routing_key=ROUTING_KEY)

channel.exchange_declare(exchange=ADT_EXCHANGE, exchange_type='direct', durable=True)

print(f"[✓] Client Python connecté (ADT)")
print(f"[✓] Queue '{QUEUE_NAME}' bindée sur exchange '{EXCHANGE_NAME}' avec '{ROUTING_KEY}'")
print(f"[✓] Exchange ADT pour résultats déclaré : '{ADT_EXCHANGE}'")
print("[✓] En attente de données des capteurs...\n")

# ---------- CONTEXT & ENGINE ----------
context = SensorContext()
engine = init_engine("storage/rules.json")

# ---------- WORKER ----------
class Worker:
    def __init__(self, message, channel, delivery_tag):
        self.message = message
        self.channel = channel
        self.delivery_tag = delivery_tag

    def run(self):
        #print("icicicicicicic")
        try:
            # Convert RabbitMQ message -> SensorEvent
            event = from_rabbit(self.message)
            #print("lalalalalalalalalalalal")
            event = context.enrich(event)
            #print("icicicicicicichahahah")
            # Evaluation via moteur d'inférence
            result = engine.evaluate(event)

            #print("+++++:::", event)

            # Préparer le résultat pour RabbitMQ
            output = {
                "sensor_id": event.id,                       # <-- utilise event.id
                "valeurActuelle": event.valeurActuelle,              # <-- utilise valeurActuelle
                "anomaly": result.anomaly,
                "rule_id": getattr(result, "rule_id", None),
                "severity": getattr(result, "severity", None),
                "timestamp": getattr(event, "timestampDerniereMesure", None)
            }
            """
            output = {
                "sensor_id": event.sensor_id,     # via propriété alias
                "value": event.value,             # via propriété
                "anomaly": result.anomaly,
                "rule_id": getattr(result, "rule_id", None),
                "severity": getattr(result, "severity", None),
                "timestamp": event.timestampDerniereMesure
            }"""



            #print(output)


            # Publier dans l'exchange ADT
            self.channel.basic_publish(
                exchange=ADT_EXCHANGE,
                routing_key=ADT_ROUTING_KEY,
                body=json.dumps(output)
            )

            # Log console
            if result.anomaly:
                print(f"⚠️ ANOMALIE: {result.rule_id} ({result.severity}) -> {output}")
            else:
                print(f"OK ✔ -> {output}")

            # Ack manuel après traitement réussi
            self.channel.basic_ack(delivery_tag=self.delivery_tag)

        except Exception as e:
            print(f"[!] Erreur traitement Worker: {e}")
            # Ne pas ack pour permettre re-delivery
        finally:
            print("-" * 40)


# ---------- CALLBACK ----------
def callback(ch, method, properties, body):
    try:
        message = json.loads(body)
        print(f"[Message reçu] {message}")
        worker = Worker(message, ch, method.delivery_tag)
        worker.run()  # Séquentiel
    except json.JSONDecodeError:
        print("[!] Message JSON invalide")
        ch.basic_ack(delivery_tag=method.delivery_tag)
        print("-" * 40)


# ---------- CONSOMMATION ----------
channel.basic_consume(
    queue=QUEUE_NAME,
    on_message_callback=callback,
    auto_ack=False  # ack manuel
)

channel.start_consuming()
