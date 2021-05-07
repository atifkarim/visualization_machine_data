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