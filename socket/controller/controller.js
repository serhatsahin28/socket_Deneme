const express = require("express");
const http = require('http');
const session = require("express-session");
const bodyParser = require('body-parser');
const app = express();
const db = require("../model/db");
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: true }));

const LoginControl = (req, res) => {

    db.query("SELECT * FROM users", (error, result) => {

        if (error) throw error;
        const username = req.body.name;
        const userpassword = req.body.password;
    
        result.forEach(element => {
          if (username == element.username && userpassword == element.password) {
            session.username = username;
            session.password = userpassword;
            res.redirect("/anasayfa");
            return session.username;
          }
          res.render("login");

        });
      });   
}
module.exports = { LoginControl };