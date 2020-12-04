from flask import Flask, render_template
from make_auto_csv import do_process
import os

app = Flask(__name__)
app.static_folder = os.path.abspath("templates/static/")

@app.route('/')
def index(name=None):
    return render_template('remote_graph.html',name=name)

@app.route('/plot_csv')
def index_1(name=None):
    return render_template('plot_csv.html',name=name)

@app.route('/exec')
def parse(name=None):
    # create_json()
    print("done")
    return render_template('remote_graph.html',name=name)

# background process happening without any refreshing
@app.route('/background_process_test')
def background_process_test():
    do_process()
    print ("Hello")
    return "nothing"


if __name__ == '__main__':
    app.run(host='192.168.0.74', port=5012)
    # app.run(host='localhost', debug=True, port=5000)
    app.debug = True