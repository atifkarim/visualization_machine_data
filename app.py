from flask import Flask, render_template, request
from dummy_data import do_process, create_json, load_json, load_json_1, load_csv, load_table
from flask import jsonify
import os, time
from table_do_process import *

# SQLAlchemy

from sqlalchemy import create_engine, inspect
from sqlalchemy import Column, String, Integer, DateTime, func
from sqlalchemy.ext.declarative import declarative_base  
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB

# get the ip address of the connection
import socket
def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

db_string = "postgres://testdb:testdb@"+str(get_ip_address())+":5432/flask_viz"
db = create_engine(db_string)  
base = declarative_base()

# function to check table exist or not
def table_exists(engine,name):
    ins = inspect(engine)
    ret =ins.dialect.has_table(engine.connect(),name)
    print('Table "{}" exists: {}'.format(name, ret))
    return ret

class Film(base):  
    __tablename__ = 'flask_viz_table'

    id = Column(Integer, primary_key=True)
    title = Column(String)
    address = Column(String)
    age = Column(String)
    created_at = Column(DateTime, default=func.now())

Session = sessionmaker(db)
session = Session()

if not table_exists(db, "flask_viz_table"):
    base.metadata.create_all(db)
else:
    pass

set_data_obj = Set_data()
get_data_obj = Get_data()

app = Flask(__name__)
app.static_folder = os.path.abspath("templates/static/")

@app.route('/')
def index(name=None):
    return render_template('graph.html',name=name)

@app.route('/auto_update')
def parse_auto_update(name=None):
    # data_json = load_json()
    data_json = create_json()
    # print(data_json)
    return jsonify(data_json)

# running of python file using Flask is done without reloading HTML
@app.route('/background_process_test')
def background_process_test():
    # do_process() # create csv file if no file in the directory. You can press the TEST button.
    a = create_json() # create json file if no file in the directory. You can press the TEST button.
    return "nothing"

# to show table data
@app.route('/table', methods=['POST', 'GET'])
def table(name=None):
    if request.method == 'POST':
        Set_data.make_mem_var(request.form)

    return render_template('table.html',name=name)

# to show table data
@app.route('/vanilla_js_table', methods=['POST', 'GET'])
def vanilla_js_table(name=None):
    if request.method == 'POST':
        print("req.form: ", request.form)
        Set_data.update_config_val(request.form)

    return render_template('vanilla_js_table.html',name=name)

# to take updated/ initial list data automatically to display table
@app.route('/auto_update_table')
def parse_auto_update_table(name=None):
    data_json = get_data_obj.do_process()
    print("I am here")
    doctor_strange = Film(
                          title="title_"+str(time.time())
                         ,address="address_"+str(time.time())
                         ,age="2016_"+str(time.time())
                          )
    session.add(doctor_strange)
    session.commit()
    
    return jsonify(data_json)


# The following endpoint initially take all the defined member variables
# to ceate the dropdown.
@app.route('/update_dropdown')
def parse_update_dropdown(name=None):
    data_json = Set_data.ret_dict()
    return jsonify(data_json)

# to ceate the dropdown.
@app.route('/dropdown_for_each_table')
def dropdown_for_each_table(name=None):
    data_json = Set_data.pass_config_val()
    return jsonify(data_json)


@app.route('/update_data_in_pyhton')
def parse_update_data_in_pyhton(name=None):
    Set_data.make_mem_var(request.args)
    return "updated"

# to stop flask server
from flask import request
def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

@app.route('/shutdown', methods=['GET'])
def shutdown():
    shutdown_server()
    return 'Server shutting down...'


if __name__ == '__main__':
    ip_address_var = get_ip_address()
    app.run(host=ip_address_var, port=5012)
    # app.run(host='192.168.0.74', port=5012)
    # app.run(host='localhost', debug=True, port=5000)
    app.debug = True