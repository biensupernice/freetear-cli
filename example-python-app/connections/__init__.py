from pymongo import MongoClient
import pika

rabbit_url = "amqp://ugiefhqn:9_sS7CxoDfCnBF_HAvY0KxWSdUV8clGn@reindeer.rmq.cloudamqp.com/ugiefhqn"

mongo_client = MongoClient("mongodb+srv://root-user:xDf4vS78PU4MbudH@cluster0-18344.azure.mongodb.net/test?retryWrites=true&w=majority")

params = pika.URLParameters(rabbit_url)
rabbit_connection = pika.BlockingConnection(params)