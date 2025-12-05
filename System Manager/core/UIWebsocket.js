// core/UIWebsocket.js
import { WebSocketServer } from "ws";

export default class UIWebsocket {
  constructor(port) {
    this.wss = new WebSocketServer({ port });
    console.log("🔌 Websocket UI prêt");
  }

  broadcast(obj) {
    const msg = JSON.stringify(obj);
    for (const c of this.wss.clients) {
      if (c.readyState === 1) c.send(msg);
    }
  }
}
