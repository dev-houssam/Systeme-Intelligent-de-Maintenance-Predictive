from rules.constraints import evaluate_condition
from rules.combiner import combine


class RuleEvaluator:
    def evaluate(self, event, rule: dict) -> bool:
        results = [
            evaluate_condition(event, cond)
            for cond in rule["conditions"]
        ]
        return combine(results, rule.get("combine", "AND"))
