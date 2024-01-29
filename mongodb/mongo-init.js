db = db.getSiblingDB('dictionary');

db.createCollection('words');

db.createUser(
    { 
        user: "user",
        pwd:  "1234",
        roles:
            [
                { role:"readWrite",db:"dictionary"}
            ] 
    } 
);

var fs = require('fs');
var wordsJSON = fs.readFileSync('/docker-entrypoint-initdb.d/words.json');
var data = JSON.parse(wordsJSON);

db.words.insertMany(data)