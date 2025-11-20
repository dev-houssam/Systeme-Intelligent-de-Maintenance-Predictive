//use maintenance_predictive

db.createCollection("capteurs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id","typeCapteur","valeurActuelle","unite","seuilAlerte","seuilCritique","etat","timestampDerniereMesure","localisation"],
      additionalProperties: false,
      properties: {
        id: {
          bsonType: "string",
          description: "UUIDv7 string",
          pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-7[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
        },
        typeCapteur: { bsonType: "string" },
        valeurActuelle: { bsonType: ["double","int","decimal"] },
        unite: { bsonType: "string" },
        seuilAlerte: { bsonType: ["double","int","decimal"] },
        seuilCritique: { bsonType: ["double","int","decimal"] },
        etat: { bsonType: "string", enum: ["Normal","Alerte","Critique","Inconnu"] },
        timestampDerniereMesure: { bsonType: "date" },
        localisation: { bsonType: "string" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
})
