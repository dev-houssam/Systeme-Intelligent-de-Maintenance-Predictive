from dataclasses import dataclass
from typing import List, Optional


@dataclass
class SensorEvent:
    sensor_id: str
    value: float
    timestamp: float
    delta: float = 0.0


@dataclass
class InferenceResult:
    anomaly: bool
    rule_id: Optional[str] = None
    severity: Optional[str] = None
    actions: List[str] = None


@dataclass
class Anomaly:
    sensor_id: str
    value: float
    timestamp: float
    rule_id: str
    severity: str
