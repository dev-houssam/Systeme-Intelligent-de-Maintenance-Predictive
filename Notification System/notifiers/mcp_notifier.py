from .notifier import Notifier


class MCPNotifier(Notifier):

    def send_notification(self, sensor_id: str, message: str, timestamp: str):
        print(f"[MCP/LLM] {timestamp} | Capteur: {sensor_id} | Message: {message}")
        # TODO: implémenter appel à LLM ou MCP
