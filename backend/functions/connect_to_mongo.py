from flask import Flask
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import time

app = Flask(__name__)


def connect_to_mongo(mongo_uri, mongo_db_name, mongo_collection_name):
    """
    Connect to MongoDB with retry.

    Parameters:
      mongo_uri (str): MongoDB connection URI
      mongo_db_name (str): MongoDB database name
      mongo_collection_name (str): MongoDB collection name

    Returns:
      db_object: MongoDB collection object.
    """

    while True:
        try:
            app.logger.info(
                f"Attempting to connect to MongoDB using URI: {mongo_uri}")
            mongo = MongoClient(mongo_uri)
            mongo_db = mongo[mongo_db_name]
            db_object = mongo_db[mongo_collection_name]
            app.logger.info(f"Connected to MongoDB using URI: {mongo_uri}!")
            return db_object
        except ConnectionFailure as e:
            app.logger.error(f"Failed to connect to MongoDB: {str(e)}")
            time.sleep(5)
