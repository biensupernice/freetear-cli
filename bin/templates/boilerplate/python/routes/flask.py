from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return "Hi Zeit", 200

@app.route('/text')
def text():
    return "text", 200