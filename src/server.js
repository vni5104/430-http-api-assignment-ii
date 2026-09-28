const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    '/notReal': jsonHandler.notFound,
    default: jsonHandler.notFound
};

const parseBody = (request, response, handler) => {
    const body = [];

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyStr = Buffer.concat(body).toString();

        const type = request.headers['content-type'];

        if (type === 'application/json') {
            response.body = JSON.parse(bodyStr);
        } else {
            response.writeHead(400, {'Content-Type': 'application/json'});
            response.write(JSON.stringify({message: 'invalid data format', id: 'invalidFormat'}));
            response.end();
        }

        handler(request, response);
    })
};

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    const handler = urlStruct[parsedUrl.pathname];
    
    if (request.method === 'POST') {
        if (parsedUrl.pathname === '/addUser') {
            parseBody(request, response, jsonHandler.addUser);
        }
    } else { //Assume GET
        if (handler) {
            handler(request, response);
        } else {
            urlStruct.default(request, response);
        }
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
})