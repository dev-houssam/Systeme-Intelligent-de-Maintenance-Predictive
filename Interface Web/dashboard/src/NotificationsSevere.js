// src/NotificationsSevere.js
import React from "react";

export default function NotificationsSevere({ processedData, seuil }) {
  const severeCount = processedData.filter(item => {
    // Vérifie si la valeur dépasse le seuil ou autre critère sévère
    return (item.adt?.value > seuil) || (item.ia?.value > seuil);
  }).length;

  return (
    <div style={{
      backgroundColor: severeCount > 0 ? "#ff4d4f" : "#d9f7be",
      color: severeCount > 0 ? "#fff" : "#52c41a",
      padding: "10px 20px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontWeight: "bold",
      fontSize: "16px",
      textAlign: "center"
    }}>
      Notifications très sévères 🔔 : {severeCount}
    </div>
  );
}

