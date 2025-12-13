import api from './api';

// New Ticket Creation
export const createTicket = async (ticketData) => {
  try {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create ticket';
  }
};

// Get User's Tickets
export const getMyTickets = async () => {
  try {
    const response = await api.get('/tickets');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch tickets';
  }
};