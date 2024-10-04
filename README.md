# user-management-api-nodejs-mongodb-bdd

## Node.js MongoDB CRUD API

RESTful User Management API with Node.js, MongoDB, and BDD Testing:

* A simple Node.js application demonstrating CRUD operations with MongoDB.
  
## Features

* Basic HTTP server in Node.js
* MongoDB integration
* Environment variable handling
* CRUD operations for user data

## Setup Instructions

### Prerequisites

* [Node.js](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/)

### Installation

1. Clone the repo:

   ```bash
    git clone https://github.com/Patoski-patoski/user-management-api-nodejs-mongodb-bdd.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables: Create a .env file in the root of your project with the following content:

   ```.env

   PORT=3000
   HOSTNAME=127.0.0.1
   MONGO_URI=mongodb://localhost:27017
   ```

4. Run the server

   ```bash
   npm start
   ```

## API Endpoints

### GET /api/users

* Retrieves all users.

```bash
curl http://127.0.0.1:3000/api/users
```
  
### GET /api/users/:user_id

* Retrieves user by id.

```bash
curl http://127.0.0.1:3000/api/users/4
```

### POST /api/users

* Inserts a new user. Requires a JSON body.

```bash
 curl -X POST -H "Content-Type: application/json" -d '{"user_id": 9, "name": "Percy Paul", "age": 49}' http://127.0.0.1:3000/api/users ; echo ""
```
  
### DELETE /api/users/:user_id

* Deletes a user by ID

```bash
curl -X DELETE http://127.0.0.1:3000/api/users/4 ; echo ""
```

## Setup Environment Variables

To run this project, you will need to set up the necessary environment variables.

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Open the .env file and add your desired username and password:

   ```plaintext
        PORT=3000
        HOSTNAME='127.0.0.1'
        MONGO_URI='mongodb://localhost:27017'
    ```

3. Save the file, and the app will load these variables when it runs.

## License

This project is licensed under the MIT License - see the [MIT License]( https://github.com/Patoski-patoski/user-management-api-nodejs-mongodb-bdd/blob/main/LICENSE) file
for details.
