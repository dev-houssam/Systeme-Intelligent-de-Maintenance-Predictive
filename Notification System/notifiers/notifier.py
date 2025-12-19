from abc import ABC, abstractmethod


class Notifier(ABC):

    @abstractmethod
    def send_notification(self, sensor_id: str, message: str, timestamp: str):
        pass
