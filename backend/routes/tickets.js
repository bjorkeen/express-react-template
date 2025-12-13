const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { requireAuth } = require('../middleware/authMiddleware');

// POST /api/tickets - Create new ticket (Protected)
router.post('/', requireAuth, ticketController.createTicket);

// GET /api/tickets - Get user's ticket (Protected)
router.get('/', requireAuth, ticketController.getMyTickets);


module.exports = router;