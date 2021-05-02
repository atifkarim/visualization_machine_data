# content of this file will come from the app.py
# https://stackoverflow.com/questions/8551952/how-to-get-last-record
# https://stackoverflow.com/questions/2633218/how-can-i-select-all-rows-with-sqlalchemy
# https://www.cloudbees.com/blog/unleash-the-power-of-storing-json-in-postgres/

from sqlalchemy import create_engine, inspect
from sqlalchemy import Column, String, Integer, DateTime, func
from sqlalchemy.ext.declarative import declarative_base  
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON, JSONB

# get the ip address of the connection
import socket
def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

db_string = "postgres://testdb:testdb@"+str(get_ip_address())+":5432/flask_viz"

db = create_engine(db_string)  
base = declarative_base()

class DB_Class(base):
    __tablename__ = 'flask_viz_table'

    id = Column(Integer, primary_key=True)
    json_column = Column(JSONB)


Session = sessionmaker(db)
session = Session()

# base.metadata.create_all(db)

def query():
    # film_1 = session.query(DB_Class).first() # first entry query
    film_1 = session.query(DB_Class).order_by(DB_Class.id.desc()).first() # last entry query
    print(film_1)
    print("latest_id: ", film_1.id)
    print(film_1.json_column)
    print(type(film_1.json_column))
    # a = film_1.json_column
    # print(a["Board_1"]["value_00"]["01_add"])
    # print(type(a["Board_1"]["value_00"]["01_add"]))

query()

def query_all():
    film_1 = session.query(DB_Class).all()
    for x in film_1:
        print(x.id)

query_all()

def query_id():
    film_1 = session.query(DB_Class).filter_by(id="129").first()
    print(film_1.id)
    print(film_1.json_column)

print("hallo----------")
query_id()
# way to query all
# for class_instance in session.query(DB_Class).all():
#     print(vars(class_instance))


# min_id = session.query(func.min(DB_Class.id)).scalar()
# print("before del: ",min_id)

# session.query(DB_Class).filter(DB_Class.id==min_id).delete()
# session.commit()

# print("after del: ",session.query(func.min(DB_Class.id)).scalar())
# rows = session.query(DB_Class).count()
# print("rows: ", rows)