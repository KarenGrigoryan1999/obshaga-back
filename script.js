const express = require('express');
const bodyParser = require("body-parser");
const controllers = require("./Controllers/MainController")

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(controllers.middleWare)
app.post("/registration", controllers.registration)
app.post("/login", controllers.login)

app.get("/get", controllers.func)
app.post("/getPostLikes", controllers.getPostLikes)
app.post("/getPosts",controllers.getPost);
app.post("/setPosts",controllers.setPost);

io.on('connection',(socket)=>{
	io.on('diconnect',(data)=>{

	})
})

io.on('send mess',function (data) {
	
})

app.listen(4000);



/*
app.get("/get", function(req,res){
	conn.query("SELECT * FROM `messages` WHERE `to` = '"+req.query.to+"'",(err,value,field)=>{
		texts = [];
		froms = [];
		var i = 0;
		if(value !== undefined){
		value.map((text)=>{
			texts[i] = text['message'];
			froms[i] = text['from'];
			i++;
		})
		conn.query("DELETE FROM `messages` WHERE `to` = '"+req.query.to+"'",(err,value,field)=>{})
		res.send(texts.join("@@"));
	}
	})
})*/