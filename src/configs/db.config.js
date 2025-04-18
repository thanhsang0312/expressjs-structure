const env = process.env;
const fs = require('fs');

const mysqlConfig = {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME || 'programming_languages',
    port: env.DB_PORT || 3306,
    ssl: env.DB_SSL === 'true' ? {
      mode: 'VERIFY_IDENTITY',
      ca: fs.readFileSync('/etc/ssl/cert.pem', 'utf-8'),
    } : undefined
};

const mongoConfig = {
    url: env.MONGODB_URL || 'mongodb://localhost:27017',
    database: env.MONGODB_DATABASE || 'programming_languages'
};

module.exports = {
    mysql: mysqlConfig,
    mongodb: mongoConfig
};
