const mysql = require('mysql');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {conn} = require("../Models/MainModel");

function createWebToken(login, mail) {
	return jwt.sign({ login, mail }, "SECRET", { expiresIn: "24h" });
}

function middleWare(req,res,next){
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
	next();
}

function registration(req, res) {
	const login = req.body.login;
	let password = req.body.password;
	const mail = req.body.email;
	const room = 0;
	const username = req.body.name;
	const fathername = req.body.middleName;
	const lastname = req.body.lastName;
	conn.query("SELECT * FROM `users` WHERE `login` = '" + login + "'", (err, value, field) => {
		conn.query("SELECT * FROM `users` WHERE `mail` = '" + mail + "'", (err, val, field) => {
			//if(password.length === undefined){
			//	return;
			//}
			if (value.length == 0) {
				if (val.length == 0) {
					password = bcrypt.hashSync(password, 10);
					conn.query(`INSERT INTO users (login, mail, password, room, name,lastname,fathername) VALUES ('${login}', '${mail}', '${password}','${room}','${username}','${lastname}','${fathername}')`, (err, value) => {
						res.json("Регистрация прошла успешно!");
					});
				} else {
					res.json("Маил занят!");
				}
			} else {
				res.json("Такой аккаунт уже есть!");
			}
		})
	})
}

function login(req, res) {
	const login = req.body.login;
	const password = req.body.password;
	conn.query("SELECT * FROM `users` WHERE `login` = '" + login + "'", (err, value, field) => {
		if (value.length == 0) {
			res.json("Неверный логин или пароль!");
		} else {
			if (bcrypt.compareSync(password, value[0]['password'])) {
				res.json(createWebToken(login, password));
			} else {
				res.json("Неверный пароль!");
			}
		}
	})
}

function func (req,res){
	try{
		const token = req.headers.authorization.split(" ")[1];
		const user = jwt.verify(token,"SECRET");
		res.json(`Привет, ${user.login}`);
	}catch(e){
		res.json("Нет токена!");
	}
}

module.exports = {
    registration,login, func, middleWare
};