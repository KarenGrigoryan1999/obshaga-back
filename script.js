const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const controllers = require("./Controllers/MainController")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(controllers.middleWare)
app.post("/registration", controllers.registration)
app.post("/login", controllers.login)

app.get("/get", controllers.func)

app.listen(4001);



/*app.get("/", function(req,res){
	res.send("HELLO!");
})
app.get("/send", function(req,res){
	let from = req.query.from;
	let to = req.query.to;
	let message = req.query.message;
	conn.query("INSERT INTO `messages` (`from`, `to`, `message`) VALUES ('"+from+"', '"+to+"', '"+message+"')",(err,value)=>{
		res.send("Done");
	});	
})
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