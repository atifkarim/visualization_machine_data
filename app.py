from flask import Flask, render_template, request
from dummy_data import do_process, create_json, load_json, load_json_1, load_csv, load_table
from flask import jsonify
import os
from table_do_process import *

set_data_obj = Set_data()
get_data_obj = Get_data()

app = Flask(__name__)
app.static_folder = os.path.abspath("templates/static/")

@app.route('/')
def index(name=None):
    return render_template('remote_graph.html',name=name)

@app.route('/plot_csv')
def index_1(name=None):
    return render_template('plot_csv.html',name=name)

# following function will be deprecated soon
@app.route('/exec')
def parse(name=None):
    # create_json()
    print("done")
    return render_template('remote_graph.html',name=name)

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
        key = request.form["var"]
        val = int(request.form["value"])
        Set_data.updateval(key, val)
    return render_template('table.html',name=name)

# to take updated/ initial list data automatically to display table
@app.route('/auto_update_table')
def parse_auto_update_table(name=None):
    data_json = get_data_obj.do_process()
    return jsonify(data_json)


# The following endpoint initially take all the defined member variables
# to ceate the dropdown.
@app.route('/update_dropdown')
def parse_update_dropdown(name=None):
    data_json = Set_data.ret_dict()
    return jsonify(data_json)

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
    app.run(host='192.168.0.74', port=5012)
    # app.run(host='localhost', debug=True, port=5000)
    app.debug = True