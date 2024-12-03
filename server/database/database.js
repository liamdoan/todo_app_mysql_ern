// create connection to database

const mysql = require('mysql2');

// create a oiil of connections to db
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'todo_app_react'
});

module.exports = pool.promise();
