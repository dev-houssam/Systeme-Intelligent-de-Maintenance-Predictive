// src/WebSocketDashboard.js
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

const WS_URL = "ws://localhost:8080";

export default function WebSocketDashboard() {
  const [rawData, setRawData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => console.log("✅ Connecté au WebSocket");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "raw") {
          setRawData((prev) => [msg.data, ...prev].slice(0, 50));

          // Graphique pour IA
          if (msg.data.source === "IA") {
            const newPoint = {
              timestamp: new Date(msg.data.receivedAt).toLocaleTimeString(),
              value: msg.data.payload.value,
            };
            setChartData((prev) => [...prev.slice(-49), newPoint]);
          }
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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", background: "#f4f6f8", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Dashboard WebSocket</h1>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
        {/* Raw Data */}
        <div style={{
          flex: 1,
          minWidth: "400px",
          background: "#fdfdfd",
          borderRadius: "10px",
          padding: "15px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          maxHeight: "400px",
          overflowY: "auto"
        }}>
          <h2 style={{ color: "#555" }}>Données brutes (raw)</h2>
          {rawData.map((item, index) => (
            <pre key={index} style={{
              background: index % 2 === 0 ? "#e0e0e0" : "#f0f0f0",
              padding: "5px",
              borderRadius: "5px",
              marginBottom: "5px",
              fontSize: "12px"
            }}>
              {JSON.stringify(item, null, 2)}
            </pre>
          ))}
        </div>

        {/* Processed Data */}
        <div style={{
          flex: 1,
          minWidth: "400px",
          background: "#fdfdfd",
          borderRadius: "10px",
          padding: "15px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          maxHeight: "400px",
          overflowY: "auto"
        }}>
          <h2 style={{ color: "#2e7d32" }}>Notifications / données combinées</h2>
          {processedData.map((item, index) => (
            <pre key={index} style={{
              background: index % 2 === 0 ? "#d0f0c0" : "#e8f5e9",
              padding: "5px",
              borderRadius: "5px",
              marginBottom: "5px",
              fontSize: "12px"
            }}>
              {JSON.stringify(item, null, 2)}
            </pre>
          ))}
        </div>
      </div>

      {/* Graphique temps réel */}
      <div style={{
        marginTop: "30px",
        background: "#e3f2fd",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ color: "#1565c0" }}>Graphique temps réel (IA)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid stroke="#cfd8dc" strokeDasharray="5 5" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#1565c0" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
