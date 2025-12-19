from .notifier import Notifier


class SMSNotifier(Notifier):

    def send_notification(self, sensor_id: str, message: str, timestamp: str):
        print(f"[SMS] {timestamp} | Capteur: {sensor_id} | Message: {message}")
        # TODO: implémenter envoi réel via API SMS
