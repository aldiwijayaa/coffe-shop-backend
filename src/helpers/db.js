const { Pool } = require('pg');

const db = new Pool ({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USERDB,
    password: process.env.PASSDB
});

module.exports = db;