// src/AfficherSensorsStatus.js
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3500/api/status";

export default function AfficherSensorsStatus() {
  const [numSensors, setNumSensors] = useState(0);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setNumSensors(data.numSensors);
        console.log(data ,
            +""+ numSensors)
      } catch (err) {
        console.error("Erreur récupération status capteurs :", err);
      }
    }

    fetchStatus();

    // Optionnel : rafraîchir toutes les 5 secondes
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Nombre de capteurs actifs : {numSensors}</h2>
    </div>
  );
}
