const users = {};

const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);

    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });

    if (response.method !== 'HEAD' && status != 204) {
        response.write(JSON.stringify(object));
    }
    response.end();
};

const getUsers = (request, response) => {
    const responseJSON = {
        users,
    };

    respondJSON(request, response, 200, responseJSON);
};

const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for is not found.',
        id: 'notFound'
    };

    respondJSON(request, response, 404, responseJSON);
}

const addUser = (request, response) => {
    const responseJSON = {
        message: "Name and Age are required"
    };

    const {name, age} = response.body;

    //Status 400: Bad Request (user missing some/all required params)
    if (!name || !age) {
        responseJSON.id = "missingParameters";
        return respondJSON(request, response, 400, responseJSON);
    }

    //Status 201: Created Successfully (add new user to users)
    let statusCode = 204;

    if (!users[name]) {
        statusCode = 201;
        users[name] = {
            name: name
        };
    }
    users[name].age = age;

    if (statusCode === 201) {
        responseJSON.message = "User Successfully Created";
        return respondJSON(request, response, statusCode, responseJSON);
    }

    //Status 204: Updated (update existing user in users)
    respondJSON(request, response, statusCode, {});
};

module.exports = {
    getUsers,
    notFound,
    addUser,
}