from core.models import InferenceResult
from rules.evaluator import RuleEvaluator


class InferenceEngine:
    def __init__(self, registry):
        self.registry = registry
        self.evaluator = RuleEvaluator()

    def evaluate(self, event) -> InferenceResult:
        print("INFERENCE ENGINE: event=", event)
        print("INFERENCE ENGINE: registry=", self.registry)
        for rule in self.registry.get_all():
            resultat_execution_eval = self.evaluator.evaluate(event, rule)
            if resultat_execution_eval:
                print("\33[47m")
                print("\33[30m")
                print("APPLY RULE = ", rule)
                print("Corriger :  RULE_ID ici")
                print("\33[00m")
                inference_result =  InferenceResult(
                    anomaly=True,
                    rule_id=rule["id"],
                    severity=rule["severity"],
                    actions=rule.get("actions", []),
                )
                print("+++++++++> INFERENCE RESULT=", inference_result)
                #raise Exception("EXCEPT !!!!!!!!!!!!!!!!!!!!!!!!")
                return inference_result
            else:
                pass
                #raise Exception("[ERROR INFERENCE RESULT] : resultat_execution_eval = self.evaluator.evaluate(event, rule)")
        print("AUCUN CALCUL n'est réalisé : ceci est un probleme graave !")
        return InferenceResult(anomaly=False, actions=[])
