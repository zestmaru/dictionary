
def get_single_word_from_database(db):
    """
    Get a single word from the database request

    Parameters:
        db (pymongo.collection.Collection): MongoDB collection object

    Returns:
        dict: A dictionary representing a single word, with keys 'eng', 'est', 'rus'
    """

    mongo = db
    random_document = mongo.aggregate([{"$sample": {"size": 1}}]).next()

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
        list: A list of dictionaries, each representing a word with keys 'eng', 'est', 'rus', etc.
    """

    mongo = db
    all_documents = list(mongo.find({}))

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
