const express = require("express");
const http = require('http');
const session = require("express-session");
const bodyParser = require('body-parser');
const app = express();
const db = require("../model/db");
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: true }));



const LoginControl = (req, res) => {
  const username = req.body.name;
  const userpassword = req.body.password;

  db.query("SELECT * FROM users", (error, result) => {
    var is = false;

    if (error) throw error;

    result.forEach(element => {
      if (element.username == username && element.password == userpassword) {
        is = true;
        session.user = { username, userpassword };
      }
    });

    if (is) {
      db.query("SELECT * FROM messages", (error, result) => {
        if (error) {
          console.error(err);
        }

        var sessionUser = session.user.username;
        return res.render("index", { aa: result, session: sessionUser });
      });
    } else {
      return res.render("login");
    }
  });
};






const Logout = (req, res) => {

  req.session.destroy();

  res.render("login");


}




module.exports = { LoginControl, Logout };