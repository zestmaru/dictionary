from bson import ObjectId


def get_single_word_from_database(db):
    """
    Get a single word from the database request

    Parameters:
        db (pymongo.collection.Collection): MongoDB collection object

    Returns:
        dict: A dictionary representing a single word, with keys "eng", "est", "rus"

    Raises:
        Exception: If an unexpected error occurs during the database operation.
    """

    try:
        random_document = db.aggregate([{"$sample": {"size": 1}}]).next()

        # Convert BSON document to a Python dictionary
        word_dict = {
            "eng": random_document.get("eng", ""),
            "est": random_document.get("est", ""),
            "rus": random_document.get("rus", "")
        }

        return word_dict

    except Exception as e:
        error_message = str(e)
        if 'Connection refused' in error_message:
            return {"Error": "Unable to connect to the database."}, 500
        else:
            return {"Error": f"An unexpected error occurred: {error_message}"}, 500


def get_list_word_from_database(db, page=0):
    """
    Get a list of words from the database request

    Parameters:
        db (pymongo.collection.Collection): MongoDB collection object
        page (int, optional): Page number for pagination. Defaults to 0. 
            Provide 0 to get all objects from database. Page is limited to 10 objects.

    Returns:
        int: total count of objects
        list: A list of dictionaries, each representing a word with keys "_id" of the Mongo ObjectId, "eng", "est", "rus".

    Raises:
        Exception: If an unexpected error occurs during the database operation.
    """
    try:
        if (page != 0):
            # Pagination
            page_size = 10
            skip = (page - 1) * page_size

            all_documents = list(db.find({}).skip(skip).limit(page_size))
        else:
            all_documents = list(db.find({}))

        total_count = db.count_documents({})

        # Convert BSON documents to a list of dictionaries
        word_list = [
            {
                "_id": str(document.get("_id")),
                "eng": document.get("eng", ""),
                "est": document.get("est", ""),
                "rus": document.get("rus", "")
            }
            for document in all_documents
        ]

        return {
            "word_list": word_list,
            "total_count": total_count,
        }

    except Exception as e:
        error_message = str(e)
        if 'Connection refused' in error_message:
            return {"Error": "Unable to connect to the database."}, 500
        else:
            return {"Error": f"An unexpected error occurred: {error_message}"}, 500


def get_random_word_with_random_est(db):
    """
    Get a random word from the database along with two random "est" objects.

    Parameters:
        db (pymongo.collection.Collection): MongoDB collection object

    Returns:
        dict: A dictionary representing a random word with keys "eng", "est", "rus",
              "random_est_1", and "random_est_2".

    Raises:
        Exception: If an unexpected error occurs during the database operation.
    """

    try:
        random_documents = list(db.aggregate([{"$sample": {"size": 3}}]))

        word_dict = {
            "eng": random_documents[0].get("eng", ""),
            "est": random_documents[0].get("est", ""),
            "rus": random_documents[0].get("rus", ""),
            "random_est_1": random_documents[1].get("est", ""),
            "random_est_2": random_documents[2].get("est", ""),
        }

        return word_dict

    except Exception as e:
        error_message = str(e)
        if 'Connection refused' in error_message:
            return {"Error": "Unable to connect to the database."}, 500
        else:
            return {"Error": f"An unexpected error occurred: {error_message}"}, 500


def put_word_to_database(db, data):
    """
    Add a new word to the database.

    Parameters:
        db (pymongo.collection.Collection): MongoDB collection object.
        data (dict): A dictionary containing word data with 'eng', 'est', and 'rus' fields.
            If any of these fields are missing, it returns an error message and a 400 status code.

    Returns:
        dict: A dictionary containing either a success message and the inserted word's _id,
            or an error message with an appropriate status code.

    Raises:
        Exception: If an unexpected error occurs during the database operation.
    """
    try:
        if 'eng' not in data or 'est' not in data or 'rus' not in data:
            return {"Error": "Missing required fields"}, 400

        # Extract only 'eng', 'est', and 'rus' fields from the data
        word_data = {
            'eng': data.get('eng', ''),
            'est': data.get('est', ''),
            'rus': data.get('rus', '')
        }

        word_id = db.insert_one(word_data).inserted_id

        return {"Message": "Word added successfully.", "_id": str(word_id)}

    except Exception as e:
        error_message = str(e)
        if 'Connection refused' in error_message:
            return {"Error": "Unable to connect to the database."}, 500
        else:
            return {"Error": f"An unexpected error occurred: {error_message}"}, 500


def delete_word_from_database(db, word_id):
    """
    Delete a word from the database.

    Parameters:
        db (pymongo.collection.Collection): MongoDB collection object.
        word_id (str): MongoDB ObjectID.

    Returns:
        dict: A dictionary containing either a success message and the inserted word's _id,
            or an error message with an appropriate status code.

    Raises:
        Exception: If an unexpected error occurs during the database operation.
    """
    try:
        if not word_id:
            return {"Error": "Missing _id parameter.", "_id": str(word_id)}, 400

        result = db.delete_one({'_id': ObjectId(word_id)})

        if result.deleted_count == 1:
            return {"Message": "Word deleted successfully.", "_id": str(word_id)}
        else:
            return {"Error": "Word not found with the given _id.", "_id": str(word_id)}, 404

    except Exception as e:
        error_message = str(e)
        if 'Connection refused' in error_message:
            return {"Error": "Unable to connect to the database."}, 500
        else:
            return {"Error": f"An unexpected error occurred: {error_message}"}, 500
