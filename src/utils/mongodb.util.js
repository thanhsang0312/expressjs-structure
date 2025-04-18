const mongoose = require('mongoose');
const dbConfig = require('../configs/db.config');

const connectDB = async () => {
    try {
        await mongoose.connect(dbConfig.mongodb.url, {
            dbName: dbConfig.mongodb.database
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw error;
    }
};

module.exports = {
    connectDB,
    closeDB
}; 