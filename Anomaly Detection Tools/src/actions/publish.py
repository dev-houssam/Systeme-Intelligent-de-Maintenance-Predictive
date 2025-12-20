from actions.base import Action


class PublishAction(Action):
    def __init__(self, channel, exchange, routing_key):
        self.channel = channel
        self.exchange = exchange
        self.routing_key = routing_key

    def execute(self, anomaly):
        self.channel.basic_publish(
            exchange=self.exchange,
            routing_key=self.routing_key,
            body=str(anomaly),
        )
