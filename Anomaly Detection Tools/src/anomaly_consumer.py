import pika
import json

# ---------- CONFIG ----------
RABBIT_HOST = "localhost"
EXCHANGE_NAME = "raw_data_exchange"
QUEUE_NAME = "anomaly_detection_queue"
ROUTING_KEY = "capteurs.*"       # topic filter

#ROUTING_KEY = "capteurs_data"       # topic filter


# ---------- CONNEXION ----------
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=RABBIT_HOST)
)
channel = connection.channel()

# ---------- EXCHANGE (topic) ----------
channel.exchange_declare(
    exchange=EXCHANGE_NAME,
    exchange_type='topic',
    durable=True
)

# ---------- QUEUE ----------
channel.queue_declare(
    queue=QUEUE_NAME,
    durable=True
)

# ---------- BINDING ----------
channel.queue_bind(
    exchange=EXCHANGE_NAME,
    queue=QUEUE_NAME,
    routing_key=ROUTING_KEY
)

print(f"[✓] Client Python connecté")
print(f"[✓] Queue '{QUEUE_NAME}' bindée sur exchange '{EXCHANGE_NAME}' avec '{ROUTING_KEY}'")
print("[✓] En attente de données des capteurs...\n")


# ---------- FONCTION D'ANALYSE ----------
def is_anomaly(data):
    """
    Détection d'anomalie très simple :
    - valeur > 1000 ou < 0 = anomalie
    Tu pourras remplacer par du ML plus tard.
    """
    if "value" not in data:
        return False

    return data["value"] < 0 or data["value"] > 1000


# ---------- CALLBACK ----------
def callback(ch, method, properties, body):
    try:
        message = json.loads(body)
        print(f"[Message reçu] {message}")

        if is_anomaly(message):
            print("⚠️  ANOMALIE DÉTECTÉE !")
        else:
            print("OK ✔ Pas d'anomalie")

    except json.JSONDecodeError:
        print("Message JSON invalide")

    print("-" * 40)


# ---------- CONSOMMATION ----------
channel.basic_consume(
    queue=QUEUE_NAME,
    on_message_callback=callback,
    auto_ack=True
)

channel.start_consuming()
