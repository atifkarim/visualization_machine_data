# https://github.com/parisnakitakejser/video-tutorial-python-code/tree/master/mongoengine/9-how-to-use-auto-increment-as-primary-in-mongoengine
# http://polyglot.ninja/
# https://stackabuse.com/guide-to-flask-mongoengine-in-python/
# https://stackoverflow.com/questions/6940503/mongodb-get-documents-by-tags

from mongoengine import connect
from mongoengine import *

connect(
    db='mongo_auto_incr',
    host='localhost',
    port=27017
)

from mongoengine import Document, StringField, DateTimeField, SequenceField, DictField
from datetime import datetime


class Users(Document):
    user_id = SequenceField(primary_key=True)
    name = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
    meta = {'collection': "new_collection_1"}


# a = "Bangladesh"
# for x in a:
#     user = Users()
#     user.name = x
#     user.save()

# fw_obj = {
#   "001_Modulator_Firmware": {
#     "value_00": {
#       "name": "Baseband Frame Counter", 
#       "unit": "", 
#       "value": randint(15,17)*randint(5,7)}, 
#     "value_01": {
#       "name": "Scrambler Start Seq", 
#       "unit": "", 
#       "value": randint(1,3)*randint(5,9)}
#     },
#     "002_Demodulator_Firmware": {
#     "value_00": {
#       "name": "snr", 
#       "unit": "db", 
#       "value": randint(100,150)}, 
#     "value_01": {
#       "name": "adc", 
#       "unit": "", 
#       "value": randint(180,200)}
#     },
#     "003_Decoder_Firmware": {
#     "value_00": {
#       "name": "counter", 
#       "unit": "", 
#       "value": randint(521,530)}, 
#     "value_01": {
#       "name": "freq", 
#       "unit": "", 
#       "value": randint(-30,-10)}
#     }
# }

# user = Users()
# # user.name = 'decoder'
# user.json_data = fw_obj
# user.tags = ['mongodb', 'mongoengine_new_col']
# user.save()

# num_posts = Users.objects(tags='mongodb').count()
# print('Found {} posts with tag "mongodb"'.format(num_posts))


# fetching data with query from mongodb with mongoengine
# bttf = Users.objects(name="decoder")#.get_or_404()
# print("type bttf: ", type(bttf))
# print("bttf: ", bttf)

# for x in Users.objects(name="decoder"):
for x in Users.objects(user_id=2):
  # print("type id: ",type(x.user_id), " ,val id: ",x.user_id)
  # print("type created_at: ",type(x.created_at), " ,val created_at: ",x.created_at)
  print("type json_data: ",type(x.json_data), " ,val json_data: ",x.json_data)

for y in Users.objects(user_id=2):
  print("\n\nonly mod: ", y.json_data["001_Modulator_Firmware"]["value_00"])

  if y.json_data["001_Modulator_Firmware"]["value_00"]["name"] == "Baseband Frame Counter":
    print("\n\nIf condition: ", y.json_data["001_Modulator_Firmware"]["value_00"])