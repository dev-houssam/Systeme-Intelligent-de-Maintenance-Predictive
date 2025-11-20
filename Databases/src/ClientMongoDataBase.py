from pymongo import MongoClient
from datetime import datetime

class ClientMongoDataBase:
    def __init__(self, uri: str, db_name: str):
        """
        Initialise la connexion à MongoDB
        """
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.capteurs_collection = self.db["capteurs"]

    def insert_capteur(self, data: dict):
        """
        Insère un document dans la collection capteurs
        """
        try:
            # Convertir timestampDernierMesure en datetime si c'est une string ISO
            if "timestampDernierMesure" in data and isinstance(data["timestampDernierMesure"], str):
                data["timestampDernierMesure"] = datetime.fromisoformat(data["timestampDernierMesure"])

            # Insérer dans MongoDB
            result = self.capteurs_collection.insert_one(data)
            print(f"Document inséré avec _id={result.inserted_id}")
        except Exception as e:
            print("Erreur lors de l'insertion:", e)
