import api from './api';

export const register = (credentials) =>
  api.post('/auth/register', credentials);

export const login = (credentials) =>
  api.post('/auth/login', credentials);

export const logout = () =>
  api.post('/auth/logout');

export const checkAccess = () =>
  api.get('/protected/hasAccess');

export const testApi = () =>
  api.get('/test');
