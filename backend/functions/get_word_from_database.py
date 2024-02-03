import random

def get_single_word_from_database(db):
    """
    Get a single word from the database request

    Parameters:
        db (pymongo.collection.Collection): MongoDB collection object

    Returns:
        dict: A dictionary representing a single word, with keys "eng", "est", "rus"
    """

    random_document = db.aggregate([{"$sample": {"size": 1}}]).next()

    # Convert BSON document to a Python dictionary
    word_dict = {
        "eng": random_document.get("eng", ""),
        "est": random_document.get("est", ""),
        "rus": random_document.get("rus", "")
    }

    return word_dict


def get_list_word_from_database(db):
    """
    Get a list of words from the database request

    Parameters:
        db (pymongo.collection.Collection): MongoDB collection object

    Returns:
        list: A list of dictionaries, each representing a word with keys "eng", "est", "rus".
    """

    all_documents = list(db.find({}))

    # Convert BSON documents to a list of dictionaries
    word_list = [
        {
            "eng": document.get("eng", ""),
            "est": document.get("est", ""),
            "rus": document.get("rus", "")
        }
        for document in all_documents
    ]

    return word_list


def get_random_word_with_random_est(db):
    """
    Get a random word from the database along with two random "est" objects.

    Parameters:
        db (pymongo.collection.Collection): MongoDB collection object

    Returns:
        dict: A dictionary representing a random word with keys "eng", "est", "rus",
              "random_est_1", and "random_est_2".
    """

    random_documents = list(db.aggregate([{ "$sample": { "size": 3 } }]))

    word_dict = {
        "eng": random_documents[0].get("eng", ""),
        "est": random_documents[0].get("est", ""),
        "rus": random_documents[0].get("rus", ""),
        "random_est_1": random_documents[1].get("est", ""),
        "random_est_2": random_documents[2].get("est", ""),
    }

    return word_dict
