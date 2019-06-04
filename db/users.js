const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "db");

exports.save = (user, cb) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    if (!data) {
      user.id = 1;
      fs.writeFile(filePath, JSON.stringify([user]), err => {
        if (err) {
          return console.log(err);
        }
      });
    }
    data = JSON.parse(data);

    let notExists = true;
    data.forEach(e => {
      if (e.username === user.username) {
        notExists = false;
        return;
      }
    });

    if (!notExists) {
      return;
    }
    user.id = data.length + 1;
    fs.writeFile(filePath, JSON.stringify([...data, user]), err => {
      if (err) {
        return console.log(err);
      }
      return cb();
    });
  });
};

exports.findById = (id, cb) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err || !data) {
      return;
    }

    let users = JSON.parse(data);
    let user = null;
    users.forEach(p => {
      if (p.id === id) {
        user = p;
        return;
      }
    });

    return user;
  });
};

exports.findByName = (name, cb) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err || !data) {
      return;
    }

    let users = JSON.parse(data);
    let user = null;
    users.forEach(p => {
      if (p.username === name) {
        user = p;
        return user;
      }
    });

    return cb(user);
  });
};
