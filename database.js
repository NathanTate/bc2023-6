const mysql = require('mysql2');

module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'N1a2t3a4n5@',
    database: 'Lab6'
})