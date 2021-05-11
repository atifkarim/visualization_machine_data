# https://github.com/parisnakitakejser/video-tutorial-python-code/tree/master/mongoengine/9-how-to-use-auto-increment-as-primary-in-mongoengine
# http://polyglot.ninja/
# https://stackabuse.com/guide-to-flask-mongoengine-in-python/
# https://stackoverflow.com/questions/6940503/mongodb-get-documents-by-tags

from mongoengine import connect
from mongoengine import *
from random import random, randint
from mongoengine import Document, StringField, DateTimeField, SequenceField, DictField
from datetime import datetime

connect(
    db='mongo_auto_incr',
    host='localhost',
    port=27017
)

# check the preferred collection is exist or not. if not then delete the "_id" by using
# the "preferred collection" from "mongoengine.counters" collection otherwise in the
# next run the counter tracing will not work

# get db name
db = get_db()
print("Database name: ", db.name)

# get all collections name
col = db.list_collection_names()
print("Collections name: ", col)
counter_collection = "mongoengine.counters"
preferred_collection = "heroku"
# checking a given collection name is in the collection list or not
print("checking: ",preferred_collection in db.list_collection_names())
if not preferred_collection in db.list_collection_names():
  db[counter_collection].delete_one({"_id": preferred_collection+'.user_id'})
  print("Entry of "+ preferred_collection + " is deleted from " + counter_collection)
else:
  print(preferred_collection + " exist")

class Users(Document):
    user_id = SequenceField(primary_key=True)
    # name = StringField()
    json_data = DictField()
    # created_at = DateTimeField(default=datetime.utcnow)
    meta = {'collection': "heroku"}

# user = Users()
# print("id: ",user.id)
# for x in Users.objects:
#   print("h: ", x.meta.keys())
# user.name = 'Paris Nakita Kejser'
# user.save()

def create_fw_obj():
  fw_obj = {
    "001_Modulator_Firmware": {
      "value_00": {
        "name": "Baseband Frame Counter", 
        "unit": "", 
        "value": randint(15,17)*randint(5,7)}, 
      "value_01": {
        "name": "Scrambler Start Seq", 
        "unit": "", 
        "value": randint(1,3)*randint(5,9)}
      },
      "002_Demodulator_Firmware": {
      "value_00": {
        "name": "snr", 
        "unit": "db", 
        "value": randint(100,150)}, 
      "value_01": {
        "name": "adc", 
        "unit": "", 
        "value": randint(180,200)}
      },
      "003_Decoder_Firmware": {
      "value_00": {
        "name": "counter", 
        "unit": "", 
        "value": randint(521,530)}, 
      "value_01": {
        "name": "freq", 
        "unit": "", 
        "value": randint(-30,-10)}
      }
  }

  return fw_obj

for i in range (3):
  user = Users()
  # user.name = 'decoder'
  user.json_data = create_fw_obj()
  # user.tags = ['mongodb', 'mongoengine_new_col']
  user.save()

# num_posts = Users.objects(tags='mongodb').count()
# print('Found {} posts with tag "mongodb"'.format(num_posts))


# fetching data with query from mongodb with mongoengine
# bttf = Users.objects(name="decoder")#.get_or_404()
# print("type bttf: ", type(bttf))
# print("bttf: ", bttf)

try:
  # for x in Users.objects(name="decoder"):
  for x in Users.objects(user_id=2):
    # print("type id: ",type(x.user_id), " ,val id: ",x.user_id)
    # print("type created_at: ",type(x.created_at), " ,val created_at: ",x.created_at)
    print("type json_data: ",type(x.json_data), " ,val json_data: ",x.json_data)
except Exception as e:
  print(repr(e))
try:
  for y in Users.objects(user_id=2):
    print("\n\nonly mod: ", y.json_data["001_Modulator_Firmware"]["value_00"])

    if y.json_data["001_Modulator_Firmware"]["value_00"]["name"] == "Baseband Frame Counter":
      print("\n\nIf condition: ", y.json_data["001_Modulator_Firmware"]["value_00"])
except Exception as e:
  print(repr(e))


# drop a defined collection from a defined db (here db = get_db())
# db["mongoengine.counters"].drop()
# print("mongoengine.counters" in db.list_collection_names()) # after dropping it will be false

# remove a document(Entry) from a defined collection
# https://www.w3schools.com/python/python_mongodb_delete.asp
# db["mongoengine.counters"].delete_one({"_id": 'heroku_chk.user_id'})

print("col len: ",db[preferred_collection].count())