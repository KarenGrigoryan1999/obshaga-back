const mysql = require('mysql');
let ans;

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

function hasOne(login){
	conn.query("SELECT * FROM `users` WHERE `login` = '" + login + "'", (err, value, field) => {
		if(value.length == 1){ 
			ans = value[0]['password'];
		}
	})
	return ans;

}

function mailCheck(mail){
	conn.query("SELECT * FROM `users` WHERE `mail` = '" + mail + "'", (err, value, field) => {
		if(value.length == 0) return false;
		else return true;
	})
}


module.exports = {
	conn,
	hasOne,
	mailCheck
}