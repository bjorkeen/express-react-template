const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.findUser = (username) => User.findOne({ username });

exports.createUser = async (username, password) => {
  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashed });
  return newUser.save();
};

exports.comparePassword = (plain, hashed) => bcrypt.compare(plain, hashed);
