# PyMongo
from flask import Flask, render_template, request, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)

mongodb_client = PyMongo(app, uri="mongodb://localhost:27017/todo_auto_flask")
db = mongodb_client.db

@app.route("/add_one")
def add_one():
    db.todos.insert_one({'title': "todo title", 'body': "todo body"})
    return jsonify(message="DONE_success")

from pymongo.errors import BulkWriteError

@app.route("/add_many")
def add_many():
    try:
        todo_many = db.todos.insert_many([
            {'_id': 1, 'title': "todo title one ", 'body': "todo body one "},
            {'_id': 8, 'title': "todo title two", 'body': "todo body two"},
            {'_id': 2, 'title': "todo title three", 'body': "todo body three"},
            {'_id': 9, 'title': "todo title four", 'body': "todo body four"},
            {'_id': 10, 'title': "todo title five", 'body': "todo body five"},
            {'_id': 5, 'title': "todo title six", 'body': "todo body six"},
        ], ordered=False)
    except BulkWriteError as e:
        return jsonify(message="duplicates encountered and ignored",
                             details=e.details,
                             inserted=e.details['nInserted'],
                             duplicates=[x['op'] for x in e.details['writeErrors']])

    return jsonify(message="success", insertedIds=todo_many.inserted_ids)

@app.route("/")
def home():
    todos = db.todos.find()
    print(type(todos))
    return "HEY"
    # return jsonify([todo for todo in todos])

@app.route("/get_todo/<int:todoId>")
def insert_one(todoId):
    todo = db.todos.find_one({"_id": todoId})
    return todo

if __name__ == '__main__':
    # ip_address_var = get_ip_address()
    # app.run(host=ip_address_var, port=5012)
    # app.run(host='192.168.0.74', port=5012)
    app.run(host='localhost', debug=True, port=5000)
    app.debug = True