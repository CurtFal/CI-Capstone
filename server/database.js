const AWS = require("aws-sdk");

const awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": process.env.ACCESS_KEY_ID, "secretAccessKey": process.env.SECRET_ACCESS_KEY
};

AWS.config.update(awsConfig);

const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.random = () => {
    let number = Math.random() * 9999999;
    let id = number.toString().padStart(7 - number.length, '0');
    let params = {
        TableName: "DataBase_CI",
        Limit: 1,
        KeyConditions: {
            'movie_id': {
                ComparisonOperator: 'GT',
                AttributeValueList: [{ 'S': id }]
            }
        }
    };

    // RandomRangeKey = new UUID
    // RandomItem = Query("HashKeyValue": "KeyOfRandomItems",
    //     "RangeKeyCondition": {
    //         "AttributeValueList":
    //             "RandomRangeKey",
    //     "ComparisonOperator": "GT"
    // },
    //     "Limit": 1)

    return new Promise((res, rej) => {
        docClient.query(params, (err, data) => {
            if (err) {
                rej(err);
            }
            else {
                res({ data, id });
            }
        })
    });
}

module.exports.read = (movie_id) => {
    let params = {
        TableName: "DataBase_CI",
        Key: {
            "movie_id": movie_id
        }
    };

    return new Promise((res, rej) => {
        docClient.get(params, (err, data) => {
            if (err) {
                rej(err);
            }
            else {
                res(data);
            }
        })
    });
}

module.exports.save = (data) => {
    let params = {
        TableName: "DataBase_CI",
        Item: data
    };

    return new Promise((res, rej) => {
        docClient.put(params, (err, data) => {
            console.log(err, data)

            if (err) {
                rej(err);
            }
            else {
                res(data);
            }
        })
    });
}

module.exports.remove = (movie_id) => {
    let params = {
        TableName: "DataBase_CI",
        Key: {
            "movie_id": movie_id
        }
    };

    return new Promise((res, rej) => {
        docClient.delete(params, (err, data) => {
            if (err) {
                rej(err);
            }
            else {
                res(data);
            }
        })
    });
}