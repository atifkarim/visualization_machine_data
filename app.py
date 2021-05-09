from flask import Flask, render_template, request, Response
from dummy_data import do_process, create_json, load_json, load_json_1, load_csv, load_table
from flask import jsonify
import os, time
from table_do_process import *
from importlib import import_module

app = Flask(__name__)
app.static_folder = os.path.abspath("templates/static/")


# get the ip address of the connection
import socket
def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

set_data_obj = Set_data()
get_data_obj = Get_data()

@app.route('/')
def index(name=None):
    return render_template('graph.html',name=name)

@app.route('/auto_update_plot')
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

# import camera driver
if os.environ.get('CAMERA'):
    Camera = import_module('camera_' + os.environ['CAMERA']).Camera
else:
    from camera import Camera

def gen(camera):
    """Video streaming generator function."""
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


# following one created to go from '/process' port to ajax_post.html
# need to work letter in form.js file
@app.route('/testing_post')
def test_post():
    return render_template('ajax_post.html')

# sample POST work from JS(form.js) to Flask
@app.route('/process', methods=['POST'])
def process():
    email = request.form['email']
    name = request.form['name']

    if name and email:
        newName = name[::-1]

        return jsonify({'name' : newName})

    return jsonify({'error' : 'Missing data!'})


# Here, I have tried to pass require word from client side using POST method
# At first route '/render_table_from_db' will be called which render a html file
# "table_from_db.html". Inside that html file a JS function named "table_from_db"
# is called in every 1 second which is written in "vanilla_js_table.js" file.
# Inside of "table_from_db" function a get call is calling which requiesting to 
# the route "/update_table_data_from_db". This roure containing a function named
# "parse_table_data_from_db" which doing nothing but creation of JSON with respect
# to a KEY_WORD(written in "table_const_var.py" file in "set_table" dict). This
# KEY_WORD I am trying to change by using a POST method. Total POST method could be
# divided into 3 parts.
# 1/ Flask side (route "/post_for_db")
# 2/ JS side (file "post_for_db.js")
# 3/ HTML part (written in "table_from_db.html" and "vanilla_js_table.html")
# When user will write valid KEY_WORD then "/post_for_db" route will be
# triggered and it will try to change "set_table" dict in "table_const_var.py" file.
# All functionality is controlled by "post_for_db.js" file. After success POST
# this redirected to "/render_table_from_db" route and render "table_from_db.html" file.
# As already "set_table" dict is changed which is supplying data to the function name
# "parse_table_data_from_db" under the hood of route in Flask "update_table_data_from_db"
# user can see the updated data. DOn't forget that "update_table_data_from_db" route is calling
# in every 1 second by JS function "table_from_db" via HTML 
@app.route('/render_table_from_db', methods=['POST', 'GET'])
def render_table_from_db(name=None):
    if request.method == 'POST':
        print("POST DONE")
    return render_template('table_from_db.html',name=name)

@app.route('/update_table_data_from_db')
def parse_table_data_from_db(name=None):
    data_json = get_data_obj.do_process()
    try:
        chose_val = Set_data.set_table["chosen_table"]
        data_json = data_json[chose_val]
    except:
        print("given value is not correct")
        chose_val = "0002_Winter"
        data_json = data_json[chose_val]
    data_json = {chose_val: data_json}
    return jsonify(data_json)

@app.route('/post_for_db', methods=['POST'])
def post_for_db():
    if request.method == 'POST':
        print("request.form type: ", type(request.form))
        print("request.form: ", request.form)
        email = request.form['email']
        name = request.form['name']
        print("name : ", name)
        Set_data.set_table["chosen_table"] = name
        return "HEY WORLD"
    # return render_template('ajax_post.html')
        # return render_template('vanilla_js_table.html',name=None)
    # return render_template('vanilla_js_table.html')

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