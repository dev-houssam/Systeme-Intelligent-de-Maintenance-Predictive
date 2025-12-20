def normalize(raw: dict) -> dict:
    #RAW from message
    return {
        "sensor_id": raw.get("id"),
        "value": float(raw.get("valeurActuelle")),
        "timestamp": raw.get("timestampDerniereMesure"),
    }
