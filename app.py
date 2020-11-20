from flask import Flask, render_template
from function_gen_graph import create_json
import os

app = Flask(__name__)
app._static_folder = os.path.abspath("templates/static/")

@app.route('/')
def index(name=None):
    return render_template('remote_graph.html',name=name)

@app.route('/exec')
def parse(name=None):
    create_json()
    print("done")
    return render_template('remote_graph.html',name=name)


if __name__ == '__main__':
    app.run(host='192.168.0.74', port=5012)
    app.debug = True