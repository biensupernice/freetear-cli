from connections.rabbit import rabbit_connection

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