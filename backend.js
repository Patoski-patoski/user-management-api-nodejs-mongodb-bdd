//backend.js
import http from 'http';
import { usersCollection, insertDocument, connectToDB, findDocument } from "./mongo.js";

const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';

// Ensure the connection to MongoDB happens only once
await connectToDB().then(() => {
    console.log('MongoDB connection ready for requests');
}).catch(error => {
    console.error('Failed to connect to MongoDB:', error);
});

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}

const getUserhandler = async (req, res) => {
    try {
        const users = await usersCollection.find().toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(users));
        res.end();
        return;
    } catch (error) {
        res.statusCode = 500;
        res.write(JSON.stringify({ error: 'Failed to retrieve users' }));
        res.end();
        return;
    }
};

const getUserhandlerId = async (req, res) => {
    const id = parseInt(req.url.split('/')[3]);
    const user = await findDocument({ user_id: id });
    
    if (!user) {
        errorUserhandler(req, res, id);
        return;
    } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(user));
        res.end();
    }
};

const deleteUserHandler = async (req, res) => {
    const id = parseInt(req.url.split('/')[3]);
    const result = await usersCollection.deleteOne({ user_id: id });

    if (result.deletedCount === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ "error": "User not found" }));
        res.end();
        return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ "message": `Successfully deleted user with id: ${id}` }));
    res.end();
};

const postUserHandler = async (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString(); // Accumulate data chunks
    });

    req.on('end', async () => {
        try {
            if (!body) {
                res.statusCode = 400;
                res.write(JSON.stringify({ error: 'No data received' }));
                res.end();
                return;
            }

            const newUser = JSON.parse(body);

            const users = await usersCollection.find().toArray();
            const userIdExist = users.some(user => user.user_id === newUser.user_id);
            if (userIdExist) {
                res.statusCode = 400;
                res.write(JSON.stringify({ error: ` User with id: ${newUser.user_id} exists` }));
                res.end();
                return;
            } else {
                await insertDocument(newUser);
                res.statusCode = 201;
                res.write(JSON.stringify({ "New user": newUser }));
                res.end();
                return;
            }

        } catch (error) {
            res.statusCode = 400;
            res.write(JSON.stringify({ error: 'Invalid JSON format' }));
        }
        res.end();
    });

    req.on('error', (err) => {
        res.statusCode = 500;
        res.write(JSON.stringify({ error: 'Internal server error. Cannot create user' }));
        res.end();
    });
};

const errorUserhandler = ((req, res, id) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    const err = { "Message": `Unable to ${req.method}. User with id:${id} not found` }
    res.write(JSON.stringify(err));
    res.end();
});

const server = http.createServer((req, res) => {
    logger(req, res, () => {
        if (req.method === 'GET' && req.url === '/api/users') {
            getUserhandler(req, res);
        } else if (req.method == 'GET' && req.url.match(/\/api\/users\/[0-9]+/)) {
            getUserhandlerId(req, res);
        } else if (req.method === 'POST' && req.url === '/api/users') {
            postUserHandler(req, res);
        } else if (req.method === 'DELETE' && req.url.match(/\/api\/users\/[0-9]+/)) {
            deleteUserHandler(req, res);
        }
    });
});

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}/${PORT}`);
});