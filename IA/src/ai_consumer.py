import pika
import json

# ---------- CONFIG ----------
RABBIT_HOST = "localhost"

# Exchange/Queue d'entrée
EXCHANGE_NAME = "raw_data_exchange"
QUEUE_NAME = "deeplearning_queue"
ROUTING_KEY = "capteurs_data"

# Nouveau Exchange/Queue de sortie (vers System Manager)
IA_EXCHANGE = "ia_exchange"
IA_QUEUE = "result_ia_queue"
IA_ROUTING_KEY = "ia.result"

# ---------- CONNEXION ----------
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=RABBIT_HOST)
)
channel = connection.channel()

# ---------- EXCHANGE d'entrée ----------
channel.exchange_declare(
    exchange=EXCHANGE_NAME,
    exchange_type='topic',
    durable=True
)

# ---------- QUEUE d'entrée ----------
channel.queue_declare(queue=QUEUE_NAME, durable=True)
channel.queue_bind(
    exchange=EXCHANGE_NAME,
    queue=QUEUE_NAME,
    routing_key=ROUTING_KEY
)

print(f"[✓] IA connecté")
print(f"[✓] Queue '{QUEUE_NAME}' bindée sur exchange '{EXCHANGE_NAME}'")
print("[✓] En attente de données pour IA...\n")

# ---------- NOUVEL EXCHANGE POUR IA ----------
channel.exchange_declare(
    exchange=IA_EXCHANGE,
    exchange_type='direct',
    durable=True
)

# ---------- QUEUE DE SORTIE ET BIND ----------
channel.queue_declare(queue=IA_QUEUE, durable=True)
channel.queue_bind(queue=IA_QUEUE, exchange=IA_EXCHANGE, routing_key=IA_ROUTING_KEY)

print(f"[✓] Exchange IA '{IA_EXCHANGE}' et queue '{IA_QUEUE}' déclarés et bindés\n")

# ---------- FONCTION D'ANALYSE ----------
def is_anomaly(data):
    if "value" not in data:
        return False
    return data["value"] < 0 or data["value"] > 1000

# ---------- CALLBACK ----------
def callback(ch, method, properties, body):
    try:
        message = json.loads(body)
        print(f"[Message reçu] {message}")

        anomaly = is_anomaly(message)

        if anomaly:
            print("⚠️  ANOMALIE PREDICTION IA !")
        else:
            print("✔ IA : pas d'anomalie détectée")

        # --- Envoi résultat IA au système manager ---
        result = {
            "sensor_id": message.get("sensor_id"),
            "value": message.get("value"),
            "anomaly": anomaly,
            "timestamp": message.get("timestamp"),
            "source": "IA"
        }

        channel.basic_publish(
            exchange=IA_EXCHANGE,
            routing_key=IA_ROUTING_KEY,
            body=json.dumps(result)
        )

        print(f"[→] Résultat IA envoyé : {result}")

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
