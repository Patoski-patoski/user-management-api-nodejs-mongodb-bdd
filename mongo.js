// mongo.js
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'users_db';
const COLLECTION_NAME = 'users';

const client = new MongoClient(MONGO_URI);
let db, usersCollection;

// Connect to MongoDB only once and reuse the collection
async function connectToDB() {
    if (usersCollection) return; // Reuse the collection if already connected
    try {
        await client.connect();
        db = client.db(DB_NAME);
        usersCollection = db.collection(COLLECTION_NAME);
        console.log(`Connected to ${DB_NAME} database`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

async function insertDocument(document) {
    try {
        const insertResult = await usersCollection.insertOne(document);
        console.log(`Inserted document:`, insertResult.insertedId);
        return insertResult;
    } catch (error) {
        console.error('Error inserting document:', error);
        throw error;
    }
}

async function findDocument(filter) {
    try {
        return await usersCollection.findOne(filter);
    } catch (error) {
        console.error('Error finding document:', error);
        throw error;
    }
}

export {usersCollection, connectToDB, insertDocument, findDocument };
