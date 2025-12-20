from actions.base import Action


class LogAction(Action):
    def execute(self, anomaly):
        print(f"📄 LOG: {anomaly}")
