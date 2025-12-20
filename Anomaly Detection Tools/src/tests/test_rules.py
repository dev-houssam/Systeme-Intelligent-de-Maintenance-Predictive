from core.models import SensorEvent
from rules.evaluator import RuleEvaluator

def test_rule_and():
    rule = {
        "conditions": [
            {"field": "value", "op": ">", "value": 10},
            {"field": "delta", "op": ">", "value": 2},
        ],
        "combine": "AND"
    }

    event = SensorEvent("s1", 15, 0, delta=3) # FAUX : quel formule pour calculer le Delta
    assert RuleEvaluator().evaluate(event, rule) is True
