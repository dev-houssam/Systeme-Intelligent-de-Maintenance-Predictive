import pymongo


PORT = "30017"
print("port="+PORT)
# Création du client MongoDB
mongo_client = "mongodb://umg_cycatrice:P_at_cyc4AuDB@127.0.0.1:"+ PORT +"/maintenance_predictive",
#db_name="maintenance_predictive"



myclient = pymongo.MongoClient(mongo_client)
mydb = myclient["maintenance_predictive"]
mycol = mydb["customers"]

mydict = { "name": "John", "address": "Highway 37" }

x = mycol.insert_one(mydict)