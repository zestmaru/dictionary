#!/usr/bin/env python3

from flask import Flask, redirect
from flask import request
from logging.config import dictConfig
from flasgger import Swagger

from functions.get_word_from_database import *
from functions.connect_to_mongo import *

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://sys.stdout',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

app = Flask(__name__)

# MongoDB configuration
app.config['MONGO_URI'] = 'mongodb://user:1234@dictionary-mongodb/dictionary'
app.config['MONGO_DB'] = 'dictionary'
app.config['MONGO_COLLECTION'] = 'words'

# Connect to MongoDB
db_object = connect_to_mongo(
    app.config['MONGO_URI'],
    app.config['MONGO_DB'],
    app.config['MONGO_COLLECTION']
)

# Enable Swagger
swagger = Swagger(app)

# utf-8 for Russian lang
app.config['JSON_AS_ASCII'] = False


# Redirect index to /apidocs
@app.route('/', methods=['GET'])
def index():
    return redirect("/apidocs")


@app.route('/get_single_word', methods=['GET'])
def get_single_word():
    """
    Get a single word.
    ---
    responses:
      200:
        description: Get a single word.
        examples:
          application/json:
            {
                "eng":"Cat",
                "est":"Kass",
                "rus":"Кошка"
            }
    """

    try:
        word = get_single_word_from_database(db_object)

        return word
    except Exception as e:
        app.logger.error("An error occurred: %s", str(e))


@app.route('/get_list_word', methods=['GET'])
def get_list_word():
    """
    Get a list of words.
    ---
    parameters:
      - name: page
        in: query
        type: integer
        required: false
        default: 0
        description: Page number for pagination. Use 0 to get all objects. Page is limited to 10 objects.
    responses:
      200:
        description: Get a list of words.
        examples:
          application/json:
            {
                "total_count": 118,
                "word_list": [
                    {
                        "_id": "65bfdecb83dd8c226b1039db",
                        "eng":"Cat",
                        "est":"Kass",
                        "rus":"Кошка"
                    },
                    {
                        "_id": "65bfdecb83dd8c226b1039dc",
                        "eng":"Dog",
                        "est":"Koer",
                        "rus":"Собака"
                    }
                ]
            }
    """

    try:
        page = int(request.args.get('page', 0))
        word_list = get_list_word_from_database(db_object, page)

        return word_list
    except Exception as e:
        app.logger.error("An error occurred: %s", str(e))


@app.route('/get_random_est', methods=['GET'])
def get_random_est():
    """
    Get a random word along with two random "est" words.
    ---
    responses:
      200:
        description: Get a random word along with two random "est" words.
        examples:
          application/json:
            {
                "eng": "Play",
                "est": "Mängima",
                "random_est_1": "Magus",
                "random_est_2": "Tantsima",
                "rus": "Играть"
            }
    """

    try:
        random_est_word_list = get_random_word_with_random_est(db_object)

        return random_est_word_list
    except Exception as e:
        app.logger.error("An error occurred: %s", str(e))

# Header for the react frontend
@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


if __name__ == '__main__':
    app.run()
