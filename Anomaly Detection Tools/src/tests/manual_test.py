from core.models import SensorEvent
from core.context import SensorContext
from engine.lifecycle import init_engine

context = SensorContext()
engine = init_engine("storage/rules.json")

# Simule des événements
events = [
    SensorEvent("temp_1", 70, 1),
    SensorEvent("temp_1", 85, 2),
    SensorEvent("temp_1", 92, 3),
]

for e in events:
    e = context.enrich(e)
    result = engine.evaluate(e)
    print(e, "=>", result)
