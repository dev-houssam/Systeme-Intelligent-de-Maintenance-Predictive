// src/App.js
import React, { useState, useEffect } from "react";
import WebSocketDashboard from "./WebSocketDashboard";
import AfficherSensorsStatus from "./AfficherSensorsStatus";
import NotificationsSevere from "./NotificationsSevere";

const WS_URL = "ws://localhost:8080";

function App() {
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => console.log("✅ Connecté au WebSocket");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "raw") {
          setRawData((prev) => [msg.data, ...prev].slice(0, 50));
        } else if (msg.type === "processed") {
          setProcessedData((prev) => [msg.data, ...prev].slice(0, 50));
        }
      } catch (err) {
        console.error("Erreur parsing WebSocket :", err);
      }
    };

    ws.onclose = () => console.log("⚠️ WebSocket fermé");

    return () => ws.close();
  }, []);

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Dashboard System Manager</h1>

      <div style={{ display: "flex", width: "60%", color: "#333" }}>

        <AfficherSensorsStatus />

      {/* Notifications très sévères */}
      <NotificationsSevere processedData={processedData} seuil={100} />


     </div>

      
      {/* Dashboard WebSocket */}
      <WebSocketDashboard rawData={rawData} processedData={processedData} />
    </div>
  );
}

export default App;
