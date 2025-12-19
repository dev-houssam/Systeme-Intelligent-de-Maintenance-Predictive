from .notifier import Notifier


class MailNotifier(Notifier):

    def send_notification(self, sensor_id: str, message: str, timestamp: str):
        print(f"[MAIL] {timestamp} | Capteur: {sensor_id} | Message: {message}")
        # TODO: implémenter envoi réel via SMTP
