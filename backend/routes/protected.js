const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// This assumes `authMiddleware` sets `req.user`
router.get('/hasAccess', authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have access.` });
});

module.exports = router;
