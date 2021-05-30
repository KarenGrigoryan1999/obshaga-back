const mysql = require('mysql');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {conn} = require("../Models/MainModel");
const userModel = require("../Models/MainModel");



function createWebToken(login, mail) {
	return jwt.sign({ login, mail }, "SECRET", { expiresIn: "24h" });
}

function registration(req, res) {
	const login = req.body.login;
	let password = req.body.password;
	const mail = req.body.email;
	const room = 0;
	const username = req.body.name;
	const fathername = req.body.middleName;
	const lastname = req.body.lastName;
	const dormNum = req.body.dorm;
	conn.query("SELECT * FROM `users` WHERE `login` = '" + login + "'", (err, value, field) => {
		conn.query("SELECT * FROM `users` WHERE `mail` = '" + mail + "'", (err, val, field) => {
			if(password === undefined){
				res.json("Ощибка!");
				return;
			}
			if (value.length == 0) {
				if (val.length == 0) {
					password = bcrypt.hashSync(password, 10);
					conn.query(`INSERT INTO users (login, mail, password, room, name,lastname,fathername, dorm) VALUES ('${login}', '${mail}', '${password}','${room}','${username}','${lastname}','${fathername}','${dormNum}')`, (err, value) => {
						res.json({accessToken:createWebToken(login, password),name:username,lastName:lastname,middleName:fathername,dorm:dormNum});
					});
				} else {
					res.json("Майл занят!");
				}
			} else {
				res.status(401).json("Такой аккаунт уже есть!");
			}
		})
	})
}

/*function registration(req, res) {
	const login = req.body.login;
	let password = req.body.password;
	const mail = req.body.email;
	const room = 0;
	const username = req.body.name;
	const fathername = req.body.middleName;
	const lastname = req.body.lastName;
	const dormNum = req.body.dorm;
	const isOne = userModel.hasOne(login);
	const mailCheck = userModel.mailCheck(mail);
	if (isOne) {
		res.status(401).json("Такой аккаунт уже есть!");
		return;
	}
	if(mailCheck){
		res.status(401).json("Майл занят!");
		return;
	}
			if(password === undefined){
				res.json("Ощибка!");
				return;
			}
	password = bcrypt.hashSync(password, 10);
	conn.query(`INSERT INTO users (login, mail, password, room, name,lastname,fathername, dorm) VALUES ('${login}', '${mail}', '${password}','${room}','${username}','${lastname}','${fathername}','${dormNum}')`, (err, value) => {
		res.json({accessToken:createWebToken(login, password),name:username,lastName:lastname,middleName:fathername,dorm:dormNum});
	});
}*/

function login(req, res) {
	login = req.body.login;
	password = req.body.password;
	conn.query("SELECT * FROM `users` WHERE `login` = '" + login + "'", (err, value, field) => {
		if (value.length == 0) {
			res.status(404).json("Пользователь не найден!");
		} else {
			if (bcrypt.compareSync(password, value[0]['password'])) {
				res.json({accessToken:createWebToken(login, password),name:value[0].name,lastName:value[0].lastname,middleName:value[0].fathername,dorm:value[0].dorm});
			} else {
				res.status(401).json("Неверный пароль!");
			}
		}
	})
}

/*function login(req, res) {
	login = req.body.login;
	password = req.body.password;
	const isOne = userModel.hasOne(login);
	console.log(isOne);
	if (!isOne) {
		res.status(404).json("Пользователь не найден!");
		return;
	}
	console.log(isOne+" "+password);
	if (bcrypt.compareSync(password, isOne)) {
		res.json({accessToken:createWebToken(login, password),name:value[0].name,lastName:value[0].lastname,middleName:value[0].fathername,dorm:value[0].dorm});
	} else {
		res.status(401).json("Неверный пароль!");
	}
}*/

function addPost(req,res) {
	const author = req.body.author;
	let isAnon = req.body.isAnon;
	let forAll = req.body.forAll;
	const message = req.body.message;
	const dorm = req.body.dorm;
	isAnon = true;
	forAll = true;
	if(isAnon) isAnon = 1; else isAnon = 0;
	if(forAll) forAll = 1; else forAll = 0;


	let date_ob = new Date();
	let date = ("0" + date_ob.getDate()).slice(-2);
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let currentDate = year + "." + month + "." + date + " " + hours + ":" + minutes;
	if(isAnon == 1){
		author = "Анонимный пользователь";
	}
	
	try{
		const token = req.headers.authorization.split(" ")[1];
		const user = jwt.verify(token,"SECRET");
		if(!author || !message || !dorm){
			res.json("Не заполнено одно из полей");
		}else{
			conn.query(`INSERT INTO posts (author, isAnon, forAll, message, dorm, date) VALUES ('${author}', '${isAnon}', '${forAll}','${message}','${dorm}','${currentDate}')`, (err, value) => {
				res.json("Пост добавлен!");
			});
		}
	}catch(e){
		res.json("Нет токена!");
	}
}

function getPosts(req,res) {
	//const dorm = req.query.dorm;
	try{
		const token = req.headers.authorization.split(" ")[1];
		const user = jwt.verify(token,"SECRET");
		//let filter = dorm.join(" OR `dorm` =");
		/*if(dorm.length == 0){
			res.json("empty");
			return;
		}*/
		//conn.query("SELECT * FROM `posts` WHERE `dorm` = "+filter, (err, value, field) => {
			//res.json(value);
		//})
		conn.query("SELECT * FROM `posts`", (err, value, field) => {
			let arr = value.reverse();
			arr.map(function(currentEl,index){
				conn.query("SELECT * FROM `likes` WHERE `post_id` = '" + currentEl.id + "'", (err, v, field) => {
					arr[index].count = v.length;
					arr[index].isLiked = false;
					v.map((currentLike,i)=>{
						if(currentLike.user_id == token){
							arr[index].isLiked = true;
						}
					})
					if(index == arr.length-1) res.json(arr);
				})
			})
		})
	}catch(e){
		console.log(e);
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
					res.json({count:value.length,isLiked:false});
				}else{
					res.json({count:value.length,isLiked:true});
				}
			})
		})
	}catch(e){
		res.json("Нет токена!");
	}
}

function tapLikeButton(req,res){
	try{
		const token = req.headers.authorization.split(" ")[1];
		const user = jwt.verify(token,"SECRET");
			conn.query("SELECT * FROM `likes` WHERE `user_id` = '" + token + "' AND `post_id` = '"+req.body.postId+"'", (err, val, field) => {
				if(val.length == 0){
					conn.query(`INSERT INTO likes (post_id, user_id) VALUES ('${req.body.postId}','${token}')`, (err, value) => {
					});
					
					conn.query("SELECT * FROM `likes` WHERE `post_id` = '" + req.body.postId + "'", (err, ans, field) => {
						res.json({count:ans.length,Liked:true});
					})

				}else{
					conn.query("DELETE FROM `likes` WHERE `user_id` = '"+token+"' AND `post_id` = '"+req.body.postId+"'",(err,value,field)=>{
						conn.query("SELECT * FROM `likes` WHERE `post_id` = '" + req.body.postId + "'", (err, ans, field) => {
							res.json({count:ans.length,Liked:false});
					})
					})
				}
			})
	}catch(e){
		res.json("Нет токена!");
	}
}

module.exports = {
    registration,
	login,
	getPosts, 
	addPost, 
	getPostLikes,
	tapLikeButton
};