from core.models import SensorEvent
from core.normalizer import normalize


def from_rabbit(message: dict) -> SensorEvent:
    data = normalize(message)
    print("FROM RABBIT : Data=", data)
    print(40*"-")
    se = SensorEvent(
        sensor_id=data["sensor_id"],
        value=data["value"],
        timestamp=data["timestamp"],
    )
    print("FROM RABBIT : SensorEvent=", se)

    return se
