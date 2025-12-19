import json
import pika

from notifiers.mail_notifier import MailNotifier
from notifiers.sms_notifier import SMSNotifier
from notifiers.push_notifier import PushNotifier
from notifiers.mcp_notifier import MCPNotifier


def main():
    # -----------------------------
    # Initialisation des notifiers
    # -----------------------------
    notifiers = [
        MailNotifier(),
        SMSNotifier(),
        PushNotifier(),
        MCPNotifier()
    ]

    # -----------------------------
    # Configuration RabbitMQ
    # -----------------------------
    EXCHANGE = "system_manager_notifier_exchange"
    ROUTING_KEY = "notification_alert"
    QUEUE = "notification_queue"

    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host="localhost")
        )
        channel = connection.channel()
    except Exception as e:
        print(f"❌ Impossible de se connecter à RabbitMQ : {e}")
        return

    try:
        channel.exchange_declare(
            exchange=EXCHANGE,
            exchange_type="direct",
            durable=True
        )

        channel.queue_declare(queue=QUEUE, durable=True)

        channel.queue_bind(
            exchange=EXCHANGE,
            queue=QUEUE,
            routing_key=ROUTING_KEY
        )
    except Exception as e:
        print(f"❌ Erreur déclaration exchange/queue : {e}")
        return

    print("🟢 Consumer prêt. En attente de messages...")

    # -----------------------------
    # Callback RabbitMQ
    # -----------------------------
    def on_message(ch, method, properties, body):
        try:
            data = json.loads(body.decode("utf-8"))

            sensor_id = data.get("sensor_id", "unknown")
            message = data.get("message", "No message")
            timestamp = data.get("timestamp", "unknown")
            severity = data.get("severity", "info")

            # Champs optionnels ADT / IA
            if data.get("adt") is not None:
                print("[ADT]", json.dumps(data["adt"], ensure_ascii=False))

            if data.get("ia") is not None:
                print("[IA]", json.dumps(data["ia"], ensure_ascii=False))

            # Envoi vers tous les notifiers
            for notifier in notifiers:
                notifier.send_notification(sensor_id, message, timestamp)

            print(
                f"🔔 Notification traitée : {message} "
                f"(capteur {sensor_id}, severity={severity})\n"
            )

        except json.JSONDecodeError as e:
            print(f"❌ Erreur parsing JSON : {e}")

        except Exception as e:
            print(f"❌ Erreur traitement message : {e}")

    # -----------------------------
    # Lancement du consumer
    # -----------------------------
    channel.basic_consume(
        queue=QUEUE,
        on_message_callback=on_message,
        auto_ack=True
    )

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print("\n🛑 Arrêt du consumer")
    finally:
        channel.stop_consuming()
        connection.close()


if __name__ == "__main__":
    main()
