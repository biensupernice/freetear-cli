import pika

if not os.environ.has_key('RABBIT_MQ_CONNECTION_URL'):
    raise KeyError('RabbitMQ selected as service but no credientials provided')

rabbit_url = os.environ.get('RABBIT_MQ_CONNECTION_URL')

params = pika.URLParameters(rabbit_url)
rabbit_connection = pika.BlockingConnection(params)