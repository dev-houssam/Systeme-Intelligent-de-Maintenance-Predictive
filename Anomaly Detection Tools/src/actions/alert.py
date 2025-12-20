from actions.base import Action


class AlertAction(Action):
    def execute(self, anomaly):
        print(f"🚨 ALERT: {anomaly}")
