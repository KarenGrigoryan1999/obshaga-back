const express = require('express');
const bodyParser = require("body-parser");
const controllers = require("./Controllers/MainController")
const {middleWare} = require("./MiddleWares/MidleWare");

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(middleWare)
app.post("/registration", controllers.registration)
app.post("/login", controllers.login)

app.post("/getPostLikes", controllers.getPostLikes)
app.get("/getPosts",controllers.getPosts);
app.post("/addPost",controllers.addPost);
app.post("/tapLikeButton",controllers.tapLikeButton);
app.post("/getFilteredPosts",controllers.getFilteredPosts);

io.on('connection',(socket)=>{
	io.on('diconnect',(data)=>{

	})
})

io.on('setPost',function (data) {
	const author = data.author;
	const isAnon = data.isAnon;
	const forAll = data.forAll;
	const message = data.message;
	const dorm = data.dorm;
	try{
		const token = data.acessToken;
		const user = jwt.verify(token,"SECRET");
		if(!author || !isAnon || !forAll || !message || !dorm || !token){
			res.json("Не заполнено одно из полей");
		}else{
			conn.query(`INSERT INTO posts (author, isAnon, forAll, message, dorm) VALUES ('${author}', '${isAnon}', '${forAll}','${message}','${dorm}')`, (err, value) => {
			
			});
		}
	}catch(e){
		res.json("Нет токена!");
	}
})

app.listen(4000);


