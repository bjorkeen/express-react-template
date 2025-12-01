const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userService = require('../services/userService');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;

  try {
    const existingUser = await userService.findUser(username);
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });

    await userService.createUser(username, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;

  try {
    const user = await userService.findUser(username);
    if (!user)
      return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await userService.comparePassword(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};
