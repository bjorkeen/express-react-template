import api from './api';

//christos form data implementation
export const createTicket = async (ticketData) => {
  const formData = new FormData();
  
  Object.keys(ticketData).forEach(key => {
    //christos handle photo array specifically
    if (key === 'photos' && Array.isArray(ticketData.photos)) {
      ticketData.photos.forEach(file => {
        formData.append('photos', file); 
      });
    } else {
      //filippa (implicitly handled) serviceType/contact fields pass through here
      formData.append(key, ticketData[key]);
    }
  });

  const response = await api.post('/tickets', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getMyTickets = async () => {
  const response = await api.get('/tickets');
  return response.data;
};

export const getTicketById = async (id) => {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
};