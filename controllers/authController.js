const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new userModel({
        name: name,
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((response) => {
      res.status(201).json({
        message: "user created",
        userId: response._id,
      });
    });
};
