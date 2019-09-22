from flask import Flask, jsonify
import os
import logging

from bson.json_util import dumps
from connections.mongo import mongo_client

from connections.rabbit import rabbit_connection

app = Flask(__name__)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return "Hi Zeit", 200

@app.route('/text')
def text():
    return "text", 200

@app.route('/names')
def names():
    return jsonify(mongo_client.database_names()), 200

@app.route('/collections/<path>')
def collections(path):
    return jsonify(mongo_client[path].collection_names()), 200

@app.route('/records/<collection>/<records>')
def records(collection, records):
    print(collection, records)
    return jsonify({"results": dumps(mongo_client[collection][records].find().limit(50))}), 200

@app.route('/publish')
def rabbit_publish():
    channel = rabbit_connection.channel() # start a channel
    
    channel.queue_declare(queue='hello') # Declare a queue
    channel.basic_publish(exchange='',
                        routing_key='hello',
                        body='Hello CloudAMQP!')
    return " [x] Sent 'Hello World!'", 200

@app.route('/consume')
def rabbit_consume():
    channel = rabbit_connection.channel() # start a channel
    channel.queue_declare(queue='hello') # Declare a queue

    method_frame, header_frame, body = channel.basic_get(queue='hello')        
    print(method_frame)
    if method_frame is None or method_frame.NAME == 'Basic.GetEmpty':
        return 'no info', 200
    else:            
        channel.basic_ack(delivery_tag=method_frame.delivery_tag) 
        return jsonify(body.decode("utf-8")), 200