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


a = "Bangladesh"
for x in a:
    user = Users()
    user.name = x
    user.save()