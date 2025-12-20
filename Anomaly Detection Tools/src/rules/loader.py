import json


class RuleLoader:
    def __init__(self, path):
        self.path = path

    def load(self):
        with open(self.path, "r") as f:
            return json.load(f)
