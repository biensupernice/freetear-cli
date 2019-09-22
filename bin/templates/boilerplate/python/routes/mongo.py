from bson.json_util import dumps
from connections.mongo import mongo_client

@app.route('/names')
def names():
    return jsonify(mongo_client.database_names())

@app.route('/collections/<path>')
def collections(path):
    return jsonify(mongo_client[path].collection_names())

@app.route('/records/<collection>/<records>')
def records(collection, records):
    print(collection, records)
    return jsonify({"results": dumps(mongo_client[collection][records].find().limit(50))}), 200
