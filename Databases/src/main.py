from ClientMongoDataBase import ClientMongoDataBase
from ClientRabbitMQ import ClientRabbitMQ

# Création du client MongoDB
mongo_client = ClientMongoDataBase(
    uri="mongodb://umg_cycatrice:P_at_cyc4AuDB@127.0.0.1:27017/maintenance_predictive",
    db_name="maintenance_predictive"
)

# Création du client RabbitMQ
rabbit_client = ClientRabbitMQ(
    host="localhost",
    exchange="RAW_data_exchange",
    queue="capteurs_data",
    mongo_client=mongo_client
)

# Démarrage de la consommation
rabbit_client.start_consuming()
