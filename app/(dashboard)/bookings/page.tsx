"use client";

import { Alert, Button, Card, CardContent, Stack } from '@mui/material';
import { notification } from 'antd';
import { useEffect, useState } from 'react';
import BookingForm from '../../../components/BookingForm';
import BookingTable from '../../../components/BookingTable';
import DashboardLayout from '../../../components/DashboardLayout';
import { createBooking, deleteBooking, getBookings } from '../../../services/bookingService';
import type { Booking } from '../../../types/booking';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('ADMIN');
  const [userId, setUserId] = useState('current-user');
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load bookings';
      setError(message);
      notification.error({ message: 'Failed to load bookings', description: message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(window.localStorage.getItem('selected-role') || 'ADMIN');
      setUserId(window.localStorage.getItem('selected-user-id') || 'current-user');
    }

    void loadBookings();
  }, []);

  const handleCreate = async (values: { userId: string; roomId: string; startTime: string; endTime: string }) => {
    try {
      await createBooking({
        userId: values.userId,
        roomId: values.roomId,
        startTime: values.startTime,
        endTime: values.endTime,
      });
      notification.success({ message: 'Booking created' });
      await loadBookings();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create booking';
      notification.error({ message: 'Failed to create booking', description: message });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBooking(id);
      notification.success({ message: 'Booking deleted' });
      await loadBookings();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete booking';
      notification.error({ message: 'Failed to delete booking', description: message });
    }
  };

  return (
    <DashboardLayout title="Bookings">
      <Stack spacing={3}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Card>
          <CardContent>
            <BookingForm loading={loading} onCreate={handleCreate} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button variant="contained" onClick={() => void loadBookings()}>
                Refresh
              </Button>
            </Stack>
            <BookingTable bookings={bookings} loading={loading} currentRole={role} currentUserId={userId} onDelete={handleDelete} />
          </CardContent>
        </Card>
      </Stack>
    </DashboardLayout>
  );
}
