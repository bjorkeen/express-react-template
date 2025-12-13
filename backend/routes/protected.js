const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/hasAccess', requireAuth, (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'You have access!', 
    user: req.user 
  });
});

module.exports = router;
