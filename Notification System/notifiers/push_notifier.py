import subprocess
from .notifier import Notifier


class PushNotifier(Notifier):

    def send_notification(self, sensor_id: str, message: str, timestamp: str):
        print(f"[PUSH] {timestamp} | Capteur: {sensor_id} | Message: {message}")

        zenity_message = (
            f"Capteur : {sensor_id}\n"
            f"Message : {message}\n"
            f"Heure : {timestamp}"
        )

        try:
            subprocess.Popen([
                "zenity",
                "--info",
                "--title=Notification système",
                f"--text={zenity_message}",
                "--timeout=10"   # ⏱️ fermeture auto après 5 secondes
            ])
        except FileNotFoundError:
            print("❌ Zenity n'est pas installé sur le système")
