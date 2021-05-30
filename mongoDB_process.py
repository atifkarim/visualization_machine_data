# this file will be used to store and fetch Firmware table data using mongoengine, pymongo
# in/ from mongodb.
# Chosen database name: self_test_db
# Chosen collection name: self_test_table

from mongoengine import *
import ast
connect(
    db='self_test_db',
    host='localhost',
    port=27017
)

class Creonic_fw(Document):
    user_id = SequenceField(primary_key=True)
    # name = StringField()
    json_data = DictField()
    # created_at = DateTimeField(default=datetime.utcnow)
    meta = {'collection': "self_test_table"}

# check the preferred collection is exist or not. if not then delete the "_id" by using
# the "preferred collection" from "mongoengine.counters" collection otherwise in the
# next run the counter tracing will not work

def check_mongo_db():
    db = get_db()
    print("Database name: ", db.name)
    # get all collections name
    col = db.list_collection_names()
    print("Collections name: ", col)
    counter_collection = "mongoengine.counters"
    preferred_collection = "self_test_table"
    # checking a given collection name is in the collection list or not
    print("checking: ",preferred_collection in db.list_collection_names())
    if not preferred_collection in db.list_collection_names():
      db[counter_collection].delete_one({"_id": preferred_collection+'.user_id'})
      print("Entry of "+ preferred_collection + " is deleted from " + counter_collection)
    else:
      print(preferred_collection + " exist")

# following function will make the required dictionary by fetching data from
# MongoDB on the basis of USER Request
# @profile
def fetch_mongoDB(queryData):
    final_json = {}
    temp_Query = {}
    temp_Query["Query"] = queryData["Query"]
    # if User given any UNIQUE_ID(primary id) for MongoDB collection following IF will work
    if temp_Query["Query"]:
    # if ast.literal_eval(temp_Query["Query"]):
      queryID = int(temp_Query["Query"])
      print("Given Q ID: ", queryID)
    # if User does not give any UNIQUE_ID(primary id) then data will be fetched from the
    # latest Entry and following ELSE will work
    else:
      db = get_db()
      preferred_collection = "self_test_table"
      queryID = db[preferred_collection].count()
      print("Default ID: ", queryID)
    return_MongoJson = getMongoJson(queryID)

    del queryData['Query']

    if queryData:
      print("Something has passed")
      for a in queryData:
          temp_valuedict = {}
          # if a != "Query":
          for key, val in queryData[a].items():
          # for key, val in ast.literal_eval(queryData[a]).items():
              if type(val) == list:
                  for i in range(len(val)):
                      op_val_json = return_MongoJson[a][val[i]]
                      temp_valuedict[val[i]] = op_val_json
                      final_json[a] = temp_valuedict
              else:
                  final_json[a] = return_MongoJson[a]

    else:
      print("Nothing HAS Passed")
      final_json = return_MongoJson
    
    return final_json

# following function fetch JSON data from MongoDB on the basis of UNIQUE_ID(primary id)
def getMongoJson(QueryID):
    json_obj = Creonic_fw.objects(user_id=QueryID)
    for a in json_obj:
        return a.json_data