import api, { getAuthHeaders, getStoredRole, getStoredUserId } from '../lib/api';
import type { Booking } from '../types/booking';

const normalizeBookings = (payload: unknown): Booking[] => {
  const data = (payload as { data?: unknown } | undefined)?.data;
  const list = Array.isArray(data) ? data : Array.isArray(payload) ? payload : [];

  return (list as Array<Partial<Booking>>).map((booking) => ({
    id: booking.id ?? '',
    title: booking.title ?? 'Untitled Booking',
    roomId: booking.roomId ?? '',
    userId: booking.userId ?? '',
    startTime: booking.startTime ?? new Date(),
    endTime: booking.endTime ?? new Date(),
    status: (booking.status ?? 'PENDING') as Booking['status'],
    createdAt: booking.createdAt ?? new Date(),
    updatedAt: booking.updatedAt ?? new Date(),
    user: booking.user,
    room: booking.room,
  }));
};

export const getBookings = async (): Promise<Booking[]> => {
  const response = await api.get('/api/bookings');
  return normalizeBookings(response.data);
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'user' | 'room'>): Promise<Booking> => {
  const response = await api.post('/api/bookings', booking, {
    headers: getAuthHeaders(getStoredRole(), getStoredUserId()),
  });

  return (response.data?.data ?? response.data) as Booking;
};

export const deleteBooking = async (id: string): Promise<void> => {
  await api.delete(`/api/bookings/${id}`, {
    headers: getAuthHeaders(getStoredRole(), getStoredUserId()),
  });
};
