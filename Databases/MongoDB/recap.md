## 1️⃣ Installation de MongoDB et Mongosh

```bash
# Ajouter la clé PGP
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Ajouter le dépôt MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Mettre à jour la liste des paquets
sudo apt update

# Installer MongoDB (serveur + outils)
sudo apt install -y mongodb-org

# Installer mongosh (client shell)
sudo apt install -y mongodb-mongosh
```

---

## 2️⃣ Démarrage et activation du service MongoDB

```bash
# Démarrer le service MongoDB
sudo systemctl start mongod

# Activer MongoDB au démarrage
sudo systemctl enable mongod

# Vérifier le statut
sudo systemctl status mongod
```

---

## 3️⃣ Création de l’utilisateur admin

```js
use admin

db.createUser({
  user: "adminmg_cycatrice",
  pwd: "P_at_cyc4ADB",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})
```

> ✅ Important : les rôles globaux (`readWriteAnyDatabase`, `userAdminAnyDatabase`, etc.) doivent **toujours être créés sur la base `admin`**.

---

## 4️⃣ Création de l’utilisateur application (pour ton projet)

```js
use maintenance_predictive

db.createUser({
  user: "umg_cycatrice",
  pwd: "P_at_cyc4AuDB",
  roles: [
    { role: "readWrite", db: "maintenance_predictive" }
  ]
})
```

---

## 5️⃣ Activation de l’authentification dans MongoDB

1. Modifier le fichier de config `/etc/mongod.conf` :

```yaml
security:
  authorization: enabled
```

2. Redémarrer MongoDB :

```bash
sudo systemctl restart mongod
```

3. Connexion avec authentification :

```bash
# Admin
mongosh -u adminmg_cycatrice -p P_at_cyc4ADB --authenticationDatabase admin

# Application
mongosh -u umg_cycatrice -p P_at_cyc4AuDB --authenticationDatabase maintenance_predictive
```

---

## 6️⃣ Création de la collection `capteurs` avec JSON Schema strict

```js
use maintenance_predictive

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
```

* `validationLevel: "strict"` → toutes les insertions doivent respecter le schema.
* `validationAction: "error"` → MongoDB refuse les documents invalides.
