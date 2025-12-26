import api from './api';

//create ticket
export const createTicket = async (ticketData) => {

  console.log('Frontend TicketData Photos:', ticketData.photos);

  const formData = new FormData();
  
  Object.keys(ticketData).forEach(key => {
    if (key === 'photos' && Array.isArray(ticketData.photos)) {
      ticketData.photos.forEach(file => {
        formData.append('photos', file); 
      });
    } else {
      formData.append(key, ticketData[key]);
    }
  });

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await api.post('/tickets', formData, config);
  return response.data;
};

// Get logged-in user's tickets
export const getMyTickets = async () => {
  try {
    const response = await api.get('/tickets');

    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.tickets)) return data.tickets;

    return [];
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch tickets';
  }
};

// Get tickets assigned to the logged-in technician
export const getAssignedTickets = async () => {
  const response = await api.get('/tickets/assigned');
  return response.data;
};

// Update ticket status
export const updateTicketStatus = async (ticketId, status) => {
  const response = await fetch(`/api/tickets/${ticketId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update status');
  }

  return response.json();
};


// ...
export const getTicket = async (id) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`/api/tickets/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch ticket');
  }
  return response.json();
};