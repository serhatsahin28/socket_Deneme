const mysql = require("mysql");
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "live_messaging_db"
});

db.connect((err) => {

    if (err) throw err;
    console.log("Bağlantı başarılı");


});








module.exports = db;