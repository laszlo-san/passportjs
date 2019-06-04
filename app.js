const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;

const db = require("./db/users");

passport.use(
  new Strategy((username, password, cb) => {
    db.findByName(username, user => {
      if (!user) {
        return cb(err);
      }
      if (user.password !== password) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  })
);

 passport.serializeUser(function(user, cb) {
   cb(null, user.id);
 });

 passport.deserializeUser(function(id, cb) {
   db.findById(id, function (err, user) {
     if (err) { return cb(err); }
     cb(null, user);
  });
 });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.get("/signup", (req, res, next) => {
  return res.send(`<form action="/signup", method="POST">
    <input type="text" name="username">
    <input type="password" name="password">
    <button type="submit">ok</button>
  </form>`);
});

app.post("/signup", (req, res, next) => {
  let user = {
    username: req.body.username,
    password: req.body.password
  };

  db.save(user, () => {
    return res.redirect("/");
  });
});

app.get("/login", (req, res, next) => {
  return res.send(`<form action="/login", method="POST">
  <input type="text" name="username">
  <input type="password" name="password">
  <button type="submit">ok</button>
</form>`);
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res, next) => {
    console.log(req.user);
    // const { username, password } = req.body;

    // db.findByName(username, user => {
    //   if (!user) {
    //     return res.send("No such user");
    //   }

    //   if (user.password === password) {
    //     return res.send("Success!!!");
    //   } else {
    //     return res.send("Nope!");
    //   }
    // });
  }
);

app.use("/", (req, res, next) => {
  res.send("yo");
});

db.save({ username: "laci", password: "laci" });

app.listen(3000);
