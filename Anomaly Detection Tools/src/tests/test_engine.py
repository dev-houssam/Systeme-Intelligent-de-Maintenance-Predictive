from core.models import SensorEvent
from engine.lifecycle import init_engine

def test_engine_detects_anomaly():
    engine = init_engine("storage/rules.json")
    event = SensorEvent("s1", 90, 0) # FAUX : le format des données a changer
    result = engine.evaluate(event)
    assert result.anomaly is True
