import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'pollingapi';

let db;

const connectDB = async () => {
    if (db) {
        return db
    }; 
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    return db;
};

export { connectDB };
