const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "123456",
    host: "localhost",
    port: 5432,
    database: "quiz_app",
});

module.exports = pool;