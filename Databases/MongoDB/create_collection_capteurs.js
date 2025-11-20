//use maintenance_predictive

db.createCollection("capteurs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id","typeCapteur","valeurActuelle","unite","SeuilAlerte","SeuilCritique","Etat","timestampDernierMesure","Localisation"],
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
        SeuilAlerte: { bsonType: ["double","int","decimal"] },
        SeuilCritique: { bsonType: ["double","int","decimal"] },
        Etat: { bsonType: "string", enum: ["Normal","Alerte","Critique","Inconnu"] },
        timestampDernierMesure: { bsonType: "date" },
        Localisation: { bsonType: "string" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
})
