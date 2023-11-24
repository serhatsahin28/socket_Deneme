const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session");
const server = http.createServer(app);
const io = require('socket.io')(server);
const db = require("./model/db");
const controller = require("./controller/controller");
app.set('view engine', 'ejs'); // Şablon motorunu belirtme
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

app.use(session({
  secret: "my-secret",
  resave: false,
  saveUninitialized: true
}));

app.get("/anasayfa", (req, res) => {
  db.query("SELECT * FROM messages", (error, result) => {
    if (error) throw error;
    res.render("index", { aa: result });
  });
});

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", controller.LoginControl);
io.on('connection', (socket) => {
  console.log('Bir istemci bağlandı');
  console.log(session);
  socket.on('disconnect', () => {
    console.log('Bir istemci ayrıldı');
  });
  
  socket.on('messageFromClient', (data) => {
    const message = data.message;
    const user = data.user;
    if (message != "" && user != "") {
      db.query("INSERT INTO messages (text,sender) VALUES (?,?)", [message, "user"], (err) => {
        if (err) throw err;
        console.log("veri eklendi");
      });
    }
    console.log("Boş mesaj gönderilemez");
  });
  socket.on('messageFromClient', (data) => {
    console.log('İstemciden gelen mesaj:', data);
    io.emit('messageFromServer', data);
  });
}); 
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
