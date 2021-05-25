const mysql = require('mysql');

const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'obshezitie'
});
conn.connect((err) => {
	if (!err) {
		console.log("OK!!!");
	}
});

module.exports = {conn}