import axios from 'axios';

const api = axios.create({
  baseURL: 'https://meeting-room-booking-sys-ten.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStoredRole = (): string => {
  if (typeof window === 'undefined') {
    return 'ADMIN';
  }

  return window.localStorage.getItem('selected-role') || 'ADMIN';
};

export const getStoredUserId = (): string => {
  if (typeof window === 'undefined') {
    return 'current-user';
  }

  return window.localStorage.getItem('selected-user-id') || 'current-user';
};

export const getAuthHeaders = (role: string = 'USER', userId?: string) => {
  const headers: Record<string, string> = {
    'x-user-role': role,
  };

  if (userId) {
    headers['x-user-id'] = userId;
  }

  return headers;
};

export default api;
