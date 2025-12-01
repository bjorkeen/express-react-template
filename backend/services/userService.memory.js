const bcrypt = require('bcrypt');

const users = [];

exports.findUser = async (username) => users.find((u) => u.username === username);

exports.createUser = async (username, password) => {
  const hashed = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashed };
  users.push(newUser);
  return newUser;
};

exports.comparePassword = (plain, hashed) => bcrypt.compare(plain, hashed);
