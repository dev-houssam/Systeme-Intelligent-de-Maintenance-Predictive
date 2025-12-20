from rules.loader import RuleLoader
from rules.registry import RuleRegistry
from engine.inference_engine import InferenceEngine


def init_engine(rules_path):
    rules = RuleLoader(rules_path).load()
    registry = RuleRegistry(rules)
    return InferenceEngine(registry)
