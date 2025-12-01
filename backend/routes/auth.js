const express = require('express');
const router = express.Router();
const {
  registerValidation,
  loginValidation,
} = require('../middleware/validate');

const {
  register,
  login,
  logout,
} = require('../controllers/authController');

router.post('/register', registerValidation, register); // could have validation middleware
router.post('/login', loginValidation, login); // could have validation middleware
router.post('/logout', logout);

module.exports = router;
