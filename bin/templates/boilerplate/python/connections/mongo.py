from pymongo import MongoClient
import os

if 'MONGODB_CONNECTION_URL' not in os.environ:
    print('MongoDB selected as service but no credientials provided')

mongo_client = MongoClient("mongodb+srv://root-user:xDf4vS78PU4MbudH@cluster0-18344.azure.mongodb.net/test?retryWrites=true&w=majority")
