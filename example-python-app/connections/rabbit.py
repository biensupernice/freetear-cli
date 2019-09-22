import pika

rabbit_url = "amqp://ugiefhqn:9_sS7CxoDfCnBF_HAvY0KxWSdUV8clGn@reindeer.rmq.cloudamqp.com/ugiefhqn"

params = pika.URLParameters(rabbit_url)
rabbit_connection = pika.BlockingConnection(params)