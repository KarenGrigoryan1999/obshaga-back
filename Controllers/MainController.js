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
			if(password === undefined){
				res.json("Ощибка!");
				return;
			}
			if (value.length == 0) {
				if (val.length == 0) {
					password = bcrypt.hashSync(password, 10);
					conn.query(`INSERT INTO users (login, mail, password, room, name,lastname,fathername) VALUES ('${login}', '${mail}', '${password}','${room}','${username}','${lastname}','${fathername}')`, (err, value) => {
						res.json({accessToken:createWebToken(login, password),name:username,lastName:lastname,middleName:fathername});
					});
				} else {
					res.json("Майл занят!");
				}
			} else {
				res.json("Такой аккаунт уже есть!");
			}
		})
	})
}

function login(req, res) {
	login = req.body.login;
	password = req.body.password;
	conn.query("SELECT * FROM `users` WHERE `login` = '" + login + "'", (err, value, field) => {
		if (value.length == 0) {
			res.json("Неверный логин или пароль!");
		} else {
			if (bcrypt.compareSync(password, value[0]['password'])) {
				res.json({accessToken:createWebToken(login, password)});
			} else {
				res.json("Неверный пароль!");
			}
		}
	})
}

function setPost(req,res) {
	const author = req.body.author;
	const isAnon = req.body.isAnon;
	const forAll = req.body.forAll;
	const message = req.body.message;
	const dorm = req.body.dorm;
	try{
		const token = req.headers.authorization.split(" ")[1];
		const user = jwt.verify(token,"SECRET");
		if(!author || !isAnon || !forAll || !message || !dorm){
			res.json("Не заполнено одно из полей");
		}else{
			conn.query(`INSERT INTO posts (author, isAnon, forAll, message, dorm) VALUES ('${author}', '${isAnon}', '${forAll}','${message}','${dorm}')`, (err, value) => {
				res.json("Пост добавлен!");
			});
		}
	}catch(e){
		res.json("Нет токена!");
	}
}

function getPost(req,res) {
	const dorm = req.body.dorm;
	try{
		const token = req.headers.authorization.split(" ")[1];
		const user = jwt.verify(token,"SECRET");
		conn.query((dorm != -1)?("SELECT * FROM `posts` WHERE `dorm` = '" + dorm + "'"):("SELECT * FROM `posts`"), (err, value, field) => {
			res.json(value);
		})
	}catch(e){
		res.json("Нет токена!");
	}
}

function getPostLikes(req,res) {
	try{
		const token = req.headers.authorization.split(" ")[1];
		const user = jwt.verify(token,"SECRET");
		conn.query("SELECT * FROM `likes` WHERE `post_id` = '" + req.body.postId + "'", (err, value, field) => {
			conn.query("SELECT * FROM `likes` WHERE `user_id` = '" + token + "'", (err, val, field) => {
				if(val.length == 0){
					res.json({count:value.length,isLiked:true});
				}else{
					res.json({count:value.length,isLiked:false});
				}
			})
		})
	}catch(e){
		res.json("Нет токена!");
	}
}

module.exports = {
    registration,login, func, middleWare, getPost, setPost, getPostLikes
};