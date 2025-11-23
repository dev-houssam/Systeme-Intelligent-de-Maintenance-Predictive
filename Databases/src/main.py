import sys

from ClientMongoDataBase import ClientMongoDataBase
from ClientRabbitMQ import ClientRabbitMQ

#Recuperation du port depuis la ligne de commande
try:
    PORT = sys.argv[1] if sys.argv[1] == "30017" else "27017"
except Exception as e:
    PORT = "27017"

print("port="+PORT)
# Création du client MongoDB
mongo_client = ClientMongoDataBase(
    uri="mongodb://umg_cycatrice:P_at_cyc4AuDB@127.0.0.1:"+ PORT +"/maintenance_predictive",
    db_name="maintenance_predictive"
)

# Création du client RabbitMQ
rabbit_client = ClientRabbitMQ(
    host="localhost",
    exchange="raw_data_exchange",
    queue="capteurs_data",
    mongo_client=mongo_client
)

# Démarrage de la consommation
rabbit_client.start_consuming()
