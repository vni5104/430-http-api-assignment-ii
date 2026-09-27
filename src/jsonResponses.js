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
        message: JSON.stringify(users),
    };

    respondJSON(request, response, 200, responseJSON);
};

const notReal = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for is not found.'
    }

    respondJSON(request, response, 404, responseJSON);
}

const addUsers = () => {};

module.exports = {
    getUsers,
    notReal,
    addUsers,
}