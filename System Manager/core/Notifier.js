// core/Notifier.js

export default class Notifier {
  constructor(rabbit, exchange, routing) {
    this.rabbit = rabbit;
    this.exchange = exchange;
    this.routing = routing;
  }

  sendAlert(data) {
    const alert = {
      sensor_id: data.sensor_id,
      message: "Notification automatique",
      adt: data.adt,
      ia: data.ia,
      severity: "info",
      timestamp: new Date().toISOString(),
    };

    this.rabbit.publish(this.exchange, this.routing, alert);
    console.log("🔔 Notification envoyée:", alert);
  }
}
