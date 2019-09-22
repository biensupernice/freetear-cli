from pymongo import MongoClient

if not os.environ.has_key('MONGODB_CONNECTION_URL'):
    raise KeyError('MongoDB selected as service but no credientials provided')

mongo_client = MongoClient("mongodb+srv://root-user:xDf4vS78PU4MbudH@cluster0-18344.azure.mongodb.net/test?retryWrites=true&w=majority")
